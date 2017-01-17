import { Strategy } from './strategy';

export abstract class Rule<T, R> {
    public abstract process(input: Promise<T>): Promise<R>;
}