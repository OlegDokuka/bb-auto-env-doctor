import { Strategy } from '.';
import { merge } from 'lodash';
import * as inquirer from 'inquirer';

export class ConfirmStrategy implements Strategy<any, Boolean, Boolean> {
    constructor(private message: string) { }
    public apply(args: any): Promise<Boolean> {
        return inquirer.prompt({
            type: 'confirm',
            message: this.message,
            name: 'result'
        }).then(r => r['result'] === true ? Promise.resolve() : Promise.reject(undefined));
    }
}