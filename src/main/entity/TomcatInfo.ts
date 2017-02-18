export interface TomcatInfo {
    isLoaded: boolean,
    status: TomcatInfo.Status
}

export namespace TomcatInfo {
    export enum Status {
        INACTIVE, ACTIVE, FAILED
    }
}
