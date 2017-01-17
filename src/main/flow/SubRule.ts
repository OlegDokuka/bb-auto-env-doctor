import { Strategy } from './strategy';
import { Rule } from '.';

export class SubRule<T> extends Rule<T, any> {
    constructor(private strategy: Strategy<T, any, any>) { super(); }

    public process(input: Promise<T>): Promise<any> {
        return input.catch(val => this.strategy.apply(val));
    }
}