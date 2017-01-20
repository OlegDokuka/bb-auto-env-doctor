import { FileInfo } from '../entity';

export interface ArtifactoryApi {
    check(): Promise<void>

    download(repoKey: string, remoteFilePath: string, destinationFilePath: string): Promise<any>
    download(repoKey: string, remoteFilePath: string, destinationFilePath: string, checkChecksum: boolean): Promise<any>

    getFileInfo(repoKey: string, remotefilePath: string): Promise<DefaultArtifactoryApi>
    getFileInfo(repoKey: string, remotefilePath: string, innerFilePath: string): Promise<string>

    quicksearch(name: string): Promise<Array<DefaultArtifactoryApi>>
    quicksearch(name: string, repos: Array<string>): Promise<Array<DefaultArtifactoryApi>>
}

export interface DefaultArtifactoryApi extends FileInfo {
    download(destinationFilePath: string): Promise<any>
    download(destinationFilePath: string, checkChecksum: boolean): Promise<any>
    file(path: string): Promise<string>
}