import { Strategy } from '.';
import * as inquirer from 'inquirer';


export class PromptStrategy implements Strategy<void, void, void> {
    constructor(private message: string) { }
    
    public apply(): Promise<void> {
        return Promise.resolve(console.log(this.message));
    }
}