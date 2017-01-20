import { Rule } from '.';
import * as inquirer from 'inquirer';
import * as NodeSSH from 'node-ssh';

export class RetryRule<T, R> extends Rule<T, R> {
    constructor(private rule: Rule<T, R>) { super(); }

    public process(args: Promise<T>): Promise<R> {
        return this.rule.process(args).then(v => v, () => this.rule.process(args));
    }
}