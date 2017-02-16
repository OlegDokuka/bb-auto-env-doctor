import { Rule } from '.';
import * as inquirer from 'inquirer';
import * as NodeSSH from 'node-ssh';

export class RepeatRule<T, R> extends Rule<T, R> {
    constructor(private rule: Rule<T, R>) { super(); }

    public process(args: Promise<T>): Promise<R> {
        return args.then<R>(
            v => this.rule.process(Promise.resolve(v)).then(() => this.process(Promise.resolve(v)), () => undefined),
            v => this.rule.process(Promise.reject(v)).then(() => this.process(Promise.reject(v)), () => undefined)
        );
    }
}