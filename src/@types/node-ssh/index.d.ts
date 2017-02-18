import * as SSH2 from 'ssh2'

declare namespace nodessh {
    type Config = {
        // Minimal type of all the config options ssh2 accepts
        host: string
        port: number
        username: string
        password?: string
        privateKey?: string
    }

    type ConfigDirectoryTransfer = {
        recursive: boolean
        tick: ((localPath: string, remotePath: string, error?: Error) => void)
        validate: ((localPath: string) => boolean)
    }

    type ConfigDirectoryTransferGiven = {
        recursive?: boolean
        tick?: ((localPath: string, remotePath: string, error?: Error) => void)
        validate?: ((localPath: string) => boolean)
    }

    interface NodeSSH {
        connect(givenConfig: SSH2.ConnectConfig): Promise<this>

        requestShell(): Promise<SSH2.ClientChannel>
        requestSFTP(): Promise<SSH2.SFTPWrapper>

        mkdir(path: string): Promise<void>
        mkdir(path: string, type: 'exec' | 'sftp'): Promise<void>
        mkdir(path: string, type: 'exec' | 'sftp', givenSftp: Object): Promise<void>

        exec(command: string): Promise<string | Object>
        exec(command: string, parameters: Array<string>): Promise<string | Object>
        exec(command: string, parameters: Array<string>, options: { cwd?: string, stdin?: string, stream?: string }): Promise<string | Object>

        execCommand(givenCommand: string): Promise<{ stdout: string, stderr: string, code: number, signal?: string }>
        execCommand(givenCommand: string, options: { cwd?: string, stdin?: string }): Promise<{ stdout: string, stderr: string, code: number, signal?: string }>

        getFile(localFile: string, remoteFile: string): Promise<void>
        getFile(localFile: string, remoteFile: string, givenSftp: Object): Promise<void>

        putFile(localFile: string, remoteFile: string): Promise<void>
        putFile(localFile: string, remoteFile: string, givenSftp: Object): Promise<void>

        putFiles(files: Array<{ local: string, remote: string }>): Promise<void>
        putFiles(files: Array<{ local: string, remote: string }>, givenSftp: Object): Promise<void>
        putFiles(files: Array<{ local: string, remote: string }>, givenSftp: Object, maxAtOnce: number): Promise<void>

        putDirectory(localDirectory: string, remoteDirectory: string): Promise<boolean>
        putDirectory(localDirectory: string, remoteDirectory: string, givenConfig: Object): Promise<boolean>
        putDirectory(localDirectory: string, remoteDirectory: string, givenConfig: Object, givenSftp: Object): Promise<boolean>

        dispose()
    }
    interface NodeSSHConstructor {
        new (): NodeSSH
    }

}

declare var nodessh: nodessh.NodeSSHConstructor
export = nodessh
