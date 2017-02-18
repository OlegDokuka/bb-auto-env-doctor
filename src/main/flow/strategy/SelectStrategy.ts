import { Strategy } from '.'
import { merge } from 'lodash'
import * as inquirer from 'inquirer'

export class SelectStrategy implements Strategy<any[], any, any> {
    constructor(private message: string) { }

    public apply(choices: any[]): Promise<string> {
        return inquirer.prompt({
            type: 'list',
            message: this.message,
            choices,
            name: 'result'
        }).then(r => r['result'])
    }
}
