import { Strategy } from '.';
import { Credentials } from '../../entity';
import * as inquirer from 'inquirer';

interface CredentialsAnswer extends inquirer.Answers, Credentials {
}

export class CredentialsStrategy implements Strategy<void, CredentialsAnswer, CredentialsAnswer> {
    public apply(args?: void): Promise<CredentialsAnswer> {
        return inquirer.prompt([{
            type: 'input',
            message: 'Environment:',
            name: 'host'
        }, {
            type: 'input',
            message: 'User:',
            name: 'username'
        }, {
            type: 'password',
            message: 'Password:',
            name: 'password'
        }]);
    }
}