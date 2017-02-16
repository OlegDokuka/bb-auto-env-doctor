import { Strategy } from '.';
import { merge } from 'lodash';
import * as inquirer from 'inquirer';

export class InputStrategy implements Strategy<any, Boolean, Boolean> {
    constructor(private message: string) { }
    public apply(args: any): Promise<Boolean> {
        return inquirer.prompt({
            type: 'input',
            message: this.message,
            name: 'result'
        }).then(r => Promise.resolve(r['result']))
    }
}