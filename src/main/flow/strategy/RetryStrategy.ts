import { Strategy } from '.';
import * as inquirer from 'inquirer';
import * as NodeSSH from 'node-ssh';

export class RetryStrategy<T, R> implements Strategy<T, R, R> {
    constructor(private strategy: Strategy<T, R, any>) { }

    public apply(args: T): Promise<R> {
        return this.strategy.apply(args).then(v => v, () => this.strategy.apply(args))
    }
}