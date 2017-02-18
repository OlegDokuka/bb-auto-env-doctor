import { assign, isArray, isString } from 'lodash'
import { Strategy } from './strategy'
import { Rule, DirectRule, SubRule, RetryRule, RepeatRule, SwitchRule, ProgressRule, PauseRule } from '.'

export namespace Flow {
    class Flow {
        constructor(elements: Array<Rule<any, any>>);
        constructor(elements: Array<Rule<any, any>>, initial: any);
        constructor(elements: Array<Rule<any, any>>, initial: any, context: any);
        constructor(private elements: Array<Rule<any, any>>, private initial?: any, private context?: any) {
        }

        public process(): Promise<any> {
            return this.elements.reduce((p, c) => c.process(this.withContext(p)), Promise.resolve(this.initial))
        }

        private withContext(input: Promise<any>): Promise<any> {
            return this.context
                ? new Promise((r, rj) => input.then(
                    v => r(this.assignContext(v)),
                    v => rj(this.assignContext(v))
                )) : input
        }
        private assignContext(value: any) {
            return isString(value)
                ? assign(new String(value), this.context)
                : this.isClassInstance(value)
                    ? assign(value, this.context)
                    : assign(isArray(value) ? [] : {}, this.context, value)
        }

        private isClassInstance(object: any) {
            return object
                && object.constructor instanceof Function
                && object.constructor !== Object
                && object.constructor !== Array
                && object.constructor !== Function
                && object.constructor !== Number
        }
    }

    class ForkRule extends Rule<any, void> {
        constructor(private left: Rule<any, any>, private right: Rule<any, any>) { super() }

        public process(input: Promise<any>): Promise<void> {
            return input.then(v => this.left.process(Promise.resolve(v)), v => this.right.process(Promise.resolve(v)))
        }
    }

    class FlowAdapterRule extends Rule<any, void> {
        constructor(private elements: Array<Rule<any, any>>) { super() }
        public process(input: Promise<any>): Promise<void> {
            return input.then(v => new Flow(this.elements, v).process())
        }
    }

    class FlowContextAdapterRule extends Rule<any, void> {
        constructor(private elements: Array<Rule<any, any>>) { super() }
        public process(input: Promise<any>): Promise<void> {
            return input.then(v => new Flow(this.elements, v, v).process())
        }
    }

    export function of(...elements: Array<Rule<any, any> | Strategy<any, any, any>>): () => void {
        const flow = new Flow(adapt(...elements))

        return () => flow.process()
    }

    export function fork(left: Strategy<any, any, any> | Rule<any, any>, right: Strategy<any, any, any> | Rule<any, any>): Rule<any, any> {
        return new ForkRule(adapt(left)[0], adapt(right)[0])
    }

    export function union(...elements: Array<Strategy<any, any, any> | Rule<any, any>>): Rule<any, any> {
        return new FlowAdapterRule(adapt(...elements))
    }

    export function context(...elements: Array<Rule<any, any> | Strategy<any, any, any>>): Rule<any, any> {
        return new FlowContextAdapterRule(adapt(...elements))
    }

    export function _switch(...cases: Array<SwitchRule.CaseRule>): SwitchRule {
        return new SwitchRule(cases)
    }

    export function _case(predicate: (v: any) => boolean): (i: Rule<any, any> | Strategy<any, any, any>) => SwitchRule.CaseRule {
        return i => new SwitchRule.CaseRule(predicate, adapt(i)[0])
    }

    export function repeat(element: Strategy<any, any, any> | Rule<any, any>): Rule<any, any> {
        return new RepeatRule(adapt(element)[0])
    }

    export function retry(element: Strategy<any, any, any> | Rule<any, any>): Rule<any, any> {
        return new RetryRule(adapt(element)[0])
    }

    export function pause(timeInMilliseconds: number): Rule<any, any> {
        return new PauseRule(timeInMilliseconds)
    }

    export function progress(message: string, element: Strategy<any, any, any> | Rule<any, any>): Rule<any, any> {
        return new ProgressRule(message, adapt(element)[0])
    }

    function adapt(...elements: Array<Rule<any, any> | Strategy<any, any, any>>): Array<Rule<any, any>> {
        return elements.map(v => v instanceof Rule ? v : new DirectRule(v))
    }
}
