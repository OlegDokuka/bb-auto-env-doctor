import { Strategy } from '.';
import * as inquirer from 'inquirer';


export class EmptyStrategy implements Strategy<void, void, void> {
    public apply(args: void): Promise<void> {
        return Promise.resolve()
    }
}