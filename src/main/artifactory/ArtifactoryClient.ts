/*
  The MIT License (MIT)

  Copyright (c) 2015 Christian Adam

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/**
  @overview Provides a module that let's you interact with Artifactory API
  @author Christian Adam
*/

import { template } from 'lodash';
import * as request from 'request';
import * as path from 'path';
import * as fs from 'fs';
import * as md5File from 'md5-file';

import { ArtifactoryApi } from './ArtifactoryApi'


export class ArtifactoryClient implements ArtifactoryApi {
    private client: request.RequestAPI<request.Request, request.CoreOptions, any>;
    /**
     *
     */
    constructor(private url: URL) {
        this.client = request.defaults({
            baseUrl: url.toString(),
            strictSSL: false
        })
    }
    /** Get file info from Artifactory server. The result is provided in a json object.
     * @param   {string} repoKey  The key of the repo where the file is stored.
     * @param   {string} remotefilePath The path to the file inside the repo.
     * @returns {object} A QPromise to a json object with the file's info as specified in the {@link http://www.jfrog.com/confluence/display/RTF/Artifactory+REST+API#ArtifactoryRESTAPI-FileInfo|FileInfo} Artifactory API.
     */
    public getFileInfo(repoKey: string, remotefilePath: string): Promise<any> {
        return new Promise((resolve, reject) =>
            this.client.get(ArtifactoryClient.TEMPLATES.getFileInfo({ repoKey, filePath: remotefilePath }),
                (error, response, body) => {
                    if (error) {
                        reject(error.message);
                        return;
                    }
                    //We expect an OK return code.
                    if (response.statusCode !== 200) {
                        reject(response.statusCode);
                        return;
                    }
                    resolve(JSON.parse(body));
                }));
    }

    public quicksearch(name: string): Promise<any>;
    public quicksearch(name: string, repos: Array<string>): Promise<any>;
    public quicksearch(name: string, repos?: Array<string>): Promise<any> {
        return new Promise((resolve, reject) =>
            this.client.get(ArtifactoryClient.TEMPLATES.search({ type: 'artifact' }), { qs: { name, repos: (repos || []).join(',') } },
                (error, response, body) => {
                    if (error) {
                        reject(error.message);
                        return;
                    }
                    //We expect an OK return code.
                    if (response.statusCode !== 200) {
                        reject(response.statusCode);
                        return;
                    }
                    resolve(JSON.parse(body));
                }));
    }
    public download(repoKey: string, remoteFilePath: string, destinationFilePath: string): Promise<any>;
    public download(repoKey: string, remoteFilePath: string, destinationFilePath: string, checkChecksum: boolean): Promise<any>;
    public download(repoKey: string, remoteFilePath: string, destinationFilePath: string, checkChecksum?: boolean): Promise<any> {
        destinationFilePath = path.resolve(destinationFilePath);

        return new Promise((resolve, reject) => {
            const endpoint = ArtifactoryClient.TEMPLATES.filePath({ repoKey: repoKey, filePath: remoteFilePath });

            if (!fs.existsSync(path.dirname(destinationFilePath))) {
                reject('The destination folder ' + path.dirname(destinationFilePath) + ' does not exist.');
                return;
            }

            const requestLike = request.get(endpoint)
                .on('response', (resp) => {
                    if (resp.statusCode === 200) {
                        const stream = requestLike.pipe(fs.createWriteStream(destinationFilePath));

                        stream.on('finish', () => {
                            if (checkChecksum) {
                                this.getFileInfo(repoKey, remoteFilePath).then((fileInfo) => {
                                    md5File(destinationFilePath, function (err, sum) {
                                        if (err) {
                                            reject('Error while calculating MD5: ' + err.toString());
                                            return;
                                        }
                                        if (sum === fileInfo.checksums.md5) {
                                            resolve('Download was SUCCESSFUL even checking expected checksum MD5 (' + fileInfo.checksums.md5 + ')');
                                        } else {
                                            reject('Error downloading file ' + this.url + endpoint + '. Checksum (MD5) validation failed. Expected: ' +
                                                fileInfo.checksums.md5 + ' - Actual downloaded: ' + sum);
                                        }
                                    });
                                }).catch((err) => reject(err));
                            } else {
                                resolve('Download was SUCCESSFUL');
                            }
                        });
                    } else {
                        reject('Server returned ' + resp.statusCode);
                    }
                });
        })
    };
}

export namespace ArtifactoryClient {
    export const API = {
        storage: '/api/storage/',
        build: '/api/build'
    }
    export const TEMPLATES = {
        getFileInfo: template(`${API.storage}<%= repoKey %><%= filePath %>`),
        filePath: template('/<%= repoKey %><%= filePath %>'),
        search: template('/api/search/<%= type %>')
    };
}