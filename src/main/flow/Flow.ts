import { assign } from 'lodash';
import { Strategy } from './strategy';
import { Rule, DirectRule, SubRule } from '.';


export namespace Flow {
    class Flow {
        constructor(elements: Array<Rule<any, any>>);
        constructor(elements: Array<Rule<any, any>>, initial: any);
        constructor(elements: Array<Rule<any, any>>, initial: any, context: any);
        constructor(private elements: Array<Rule<any, any>>, private initial?: any, private context?: any) {
        }

        public process(): Promise<any> {
            return this.elements.reduce((p, c) => c.process(this.withContext(p)), new Promise((r, rj) => setTimeout(r, 0, this.initial)));
        }

        private withContext(input: Promise<any>): Promise<any> {
            return this.context
                ? new Promise((r, rj) => input.then(
                    v => r(assign([], this.context, v)),
                    v => rj(assign([], this.context, v))
                )) : input;
        }
    }

    class ForkRule extends Rule<any, void> {
        constructor(private left: Rule<any, any>, private right: Rule<any, any>) { super(); }

        public process(input: Promise<any>): Promise<void> {
            return input.then(v => this.left.process(Promise.resolve(v)), v => this.right.process(Promise.resolve(v)));
        }
    }

    class FlowAdapterRule extends Rule<any, void> {
        constructor(private elements: Array<Rule<any, any>>) { super(); }
        public process(input: Promise<any>): Promise<void> {
            return input.then(v => new Flow(this.elements, v).process());
        }
    }

    class FlowContextAdapterRule extends Rule<any, void> {
        constructor(private elements: Array<Rule<any, any>>) { super(); }
        public process(input: Promise<any>): Promise<void> {
            return input.then(v => new Flow(this.elements, v, v).process());
        }
    }

    export function of(...elements: Array<Rule<any, any> | Strategy<any, any, any>>): () => void {
        const flow = new Flow(adapt(...elements));

        return () => flow.process();
    }

    export function fork(left: Strategy<any, any, any> | Rule<any, any>, right: Strategy<any, any, any> | Rule<any, any>): Rule<any, any> {
        return new ForkRule(adapt(left)[0], adapt(right)[0]);
    }

    export function union(...elements: Array<Strategy<any, any, any> | Rule<any, any>>): Rule<any, any> {
        return new FlowAdapterRule(adapt(...elements));
    }

    export function context(...elements: Array<Rule<any, any> | Strategy<any, any, any>>): Rule<any, any> {
        return new FlowContextAdapterRule(adapt(...elements));
    }

    function adapt(...elements: Array<Rule<any, any> | Strategy<any, any, any>>): Array<Rule<any, any>> {
        return elements.map(v => v instanceof Rule ? v : new DirectRule(v));
    }
}