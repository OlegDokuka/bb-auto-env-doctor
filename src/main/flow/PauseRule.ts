import { Rule } from '.'
import * as inquirer from 'inquirer'
import * as NodeSSH from 'node-ssh'

export class PauseRule<T, R> extends Rule<T, R> {
    constructor(private timeInMilliseconds: number) { super() }

    public process(args: Promise<T>): Promise<R> {
        return args.then<R>(
            v => new Promise(r => setTimeout(() => r(v), this.timeInMilliseconds)),
            v => new Promise(({}, r) => setTimeout(() => r(v), this.timeInMilliseconds))
        )
    }
}
