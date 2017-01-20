import { Strategy } from '.';
import { Credentials } from '../../entity';
import * as URL from 'url';
import * as inquirer from 'inquirer';

interface CredentialsAnswer extends inquirer.Answers, Credentials {
}

export class ArtifactoryCredentialsStrategy implements Strategy<void, CredentialsAnswer, CredentialsAnswer> {
    public apply(args?: void): Promise<CredentialsAnswer> {
        return inquirer.prompt([{
            type: 'input',
            message: 'Artfactory URL:',
            name: 'host',
            validate: a => {
                try {
                    URL.parse(a)
                    return true;
                } catch (e) {
                    return false;
                }
            }
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