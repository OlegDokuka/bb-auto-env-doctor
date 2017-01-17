import { Strategy } from '.';
import { merge } from 'lodash';
import * as inquirer from 'inquirer';


export class ChoiseStrategy implements Strategy<string[], string[], string[]> {
    constructor(private message: string) { }

    public apply(choices: string[]): Promise<string[]> {
        return inquirer.prompt({
            type: 'checkbox',
            message: this.message,
            choices,
            name: 'result'
        }).then(r => r['result']);
    }
}