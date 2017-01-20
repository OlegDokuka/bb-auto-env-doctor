import { Checksum } from '.';

export interface FileInfo {
    repo: string
    path: string
    created: Date
    lastModified: Date
    lastUpdated: Date
    createdBy: string
    modifiedBy: string
    downloadUri: string
    mimeType: string
    size: number
    checksums: Checksum
    originalChecksums: Checksum
    uri: string
}