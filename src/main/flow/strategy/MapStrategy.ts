import { Strategy } from '.';
import { merge } from 'lodash';
import * as inquirer from 'inquirer';

export class MapStrategy<T, R> implements Strategy<T, R, R> {
    constructor(private mapper: (val: T) => R) { }

    public apply(args: T): Promise<R> {
        return Promise.resolve(this.mapper(args));
    }
}