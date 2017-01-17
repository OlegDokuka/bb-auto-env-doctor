import { Strategy } from '.';
import * as inquirer from 'inquirer';
import * as NodeSSH from 'node-ssh';
import { assign } from 'lodash';

type SSHClientOptions<T> = T & { sshClient: NodeSSH.NodeSSH };

export abstract class SSHStrategy<T, R, E> implements Strategy<SSHClientOptions<T>, SSHClientOptions<R>, SSHClientOptions<E>> {
    client: NodeSSH.NodeSSH;

    public apply(args: SSHClientOptions<T>): Promise<SSHClientOptions<R> | SSHClientOptions<E>> {
        this.client = args.sshClient;

        return this.wrap(args)
            .then(v => assign({}, { sshClient: this.client }, v), e => assign({}, { sshClient: this.client }, e));
    }

    public abstract wrap(T): Promise<R | E>;
}