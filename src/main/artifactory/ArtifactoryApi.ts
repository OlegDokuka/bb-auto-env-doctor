export interface ArtifactoryApi {
    download(repoKey: string, remoteFilePath: string, destinationFilePath: string): Promise<any>    
    download(repoKey: string, remoteFilePath: string, destinationFilePath: string, checkChecksum: boolean): Promise<any>

    getFileInfo(repoKey: string, remotefilePath: string): Promise<any>

    quicksearch(name: string): Promise<Array<any>>
    quicksearch(name: string, repos: Array<string>): Promise<Array<any>>
}

export interface DefaultArtifactoryApi {
    download(): Promise<any>
    file(path: string): Promise<any>
}