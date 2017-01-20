import { Rule } from '.';
import * as inquirer from 'inquirer';
import * as NodeSSH from 'node-ssh';

export class SwitchRule extends Rule<any, any> {
    constructor(private cases: Array<SwitchRule.CaseRule>) { super(); }

    public process(args: Promise<any>): Promise<any> {
        return args.then(v => this.cases.length > 0
            ? this.cases.shift()
                .process(Promise.resolve(v))
                .then(r => r.process(Promise.resolve(v)))
                .catch(() => this.process(Promise.resolve(v)))
            : Promise.reject('No valid cases found'))
    }
}

export namespace SwitchRule {
    export class CaseRule extends Rule<any, Rule<any, any>> {
        constructor(private predicate: (val: any) => boolean, private result: Rule<any, any>) { super(); }

        public process(arg: Promise<any>): Promise<Rule<any, any>> {
            return arg.then(v => this.predicate(v) ? Promise.resolve(this.result) : Promise.reject(v));
        }
    }
}