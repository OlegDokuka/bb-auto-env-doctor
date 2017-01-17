import { Strategy } from './strategy';
import { Rule } from '.';

export class DirectRule<T> extends Rule<T, any> {
    constructor(private strategy: Strategy<T, any, any>) { super(); }

    public process(input: Promise<T>): Promise<any> {
        return input.then(val => this.strategy.apply(val));
    }
}