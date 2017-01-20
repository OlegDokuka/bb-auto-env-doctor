import { ArtifactoryStrategy } from '.';
import { MicroserviceInfo, FileInfo } from '../../entity';
import { DefaultArtifactoryApi } from '../../artifactory';
import { trim, fill, merge } from 'lodash';
import * as inquirer from 'inquirer';

export class DownloadArtifactStrategy extends ArtifactoryStrategy<FileInfo & MicroserviceInfo, string, Error> {
    public wrap(info: FileInfo & MicroserviceInfo): Promise<string | Error> {
        return this.client.download(info.repo, info.path, `./${info.artifactId}-${info.version}.war`).then(() => `./${info.artifactId}.war`);
    }
}