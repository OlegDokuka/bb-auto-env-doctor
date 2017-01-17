import { Strategy } from '.';
import { Credentials } from '../../entity';
import * as inquirer from 'inquirer';
import * as NodeSSH from 'node-ssh';

export class ConnectionStrategy implements Strategy<Credentials, NodeSSH.NodeSSH, Error> {
    public apply(credentials: Credentials): Promise<NodeSSH.NodeSSH | Error> {
        return new NodeSSH().connect(credentials);
    }
}