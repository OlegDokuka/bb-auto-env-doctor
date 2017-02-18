import { Strategy } from '.'
import { isString } from 'lodash'
import * as inquirer from 'inquirer'
import * as NodeSSH from 'node-ssh'

type SSHClientOptions<T> = T & { sshClient: NodeSSH.NodeSSH }

export abstract class SSHStrategy<T, R, E> implements Strategy<SSHClientOptions<T>, R, E> {
    client: NodeSSH.NodeSSH

    public apply(args: SSHClientOptions<T>): Promise<R | E> {
        this.client = args.sshClient

        return this.wrap(isString(args) ? args.toString() : args)
    }

    public abstract wrap(T): Promise<R | E>
}
