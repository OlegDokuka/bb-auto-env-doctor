export { Strategy } from './Strategy';
export { SSHStrategy } from './SSHStrategy';
import { Strategy } from './Strategy';
import { ConfirmStrategy } from './ConfirmStrategy';
import { SSHStrategy } from './SSHStrategy';
import { ChoiseStrategy } from './ChoiseStrategy';
import { ConnectionStrategy } from './ConnectionStrategy';
import { CredentialsStrategy } from './CredentialsStrategy';
import { ListMicroservicesStrategy } from './ListMicroservicesStrategy';
import { PingStrategy } from './PingStrategy';
import { RemoveMicroservicesStrategy } from './RemoveMicroservicesStrategy';
import { TomcatStrategy } from './TomcatStrategy';
import { RetryStrategy } from './RetryStrategy';
import { MapStrategy } from './MapStrategy';


namespace Strategies {
    export function map<T, R>(mapper: (val: T) => R) {
        return new MapStrategy(mapper);
    }

    export function choise(message: string) {
        return new ChoiseStrategy(message);
    }

    export function confirm(message: string) {
        return new ConfirmStrategy(message);
    }

    export function connection() {
        return new ConnectionStrategy();
    }

    export function credentials() {
        return new CredentialsStrategy();
    }

    export function listMicroservices() {
        return new ListMicroservicesStrategy();
    }

    export function removeMicroservices() {
        return new RemoveMicroservicesStrategy();
    }

    export function ping() {
        return new PingStrategy();
    }

    export function tomcat(action: 'start' | 'stop') {
        return new TomcatStrategy(action);
    }

    export function retry<T, R>(strategy: Strategy<T, R, any>) {
        return new RetryStrategy(strategy);
    }
}

export default Strategies;
