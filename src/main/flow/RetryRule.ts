import { Rule } from '.';
import * as inquirer from 'inquirer';
import * as NodeSSH from 'node-ssh';

export class RetryRule<T, R> extends Rule<T, R> {
    constructor(private rule: Rule<T, R>) { super(); }

    public process(args: Promise<T>): Promise<R> {
        return args.then<R>(
            v => this.rule.process(Promise.resolve(v)).then(r => r, () => this.process(Promise.resolve(v))),
            v => this.rule.process(Promise.reject(v)).then(r => r, () => this.process(Promise.resolve(v)))
        );
    }
}