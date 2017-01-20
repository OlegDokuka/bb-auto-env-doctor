import { Rule } from '.';
import * as inquirer from 'inquirer';
import * as NodeSSH from 'node-ssh';

export class RepeatRule<T, R> extends Rule<T, R> {
    constructor(private rule: Rule<T, R>) { super(); }

    public process(args: Promise<T>): Promise<R> {
        return this.rule.process(args).then(v => this.rule.process(args), () => undefined);
    }
}