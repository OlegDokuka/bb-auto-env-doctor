export { Strategy } from './Strategy';
export { SSHStrategy } from './SSHStrategy';
export { ArtifactoryStrategy } from './ArtifactoryStrategy';

import { Strategy } from './Strategy';
import { ConfirmStrategy } from './ConfirmStrategy';
import { SSHStrategy } from './SSHStrategy';
import { ChoiceStrategy } from './ChoiceStrategy';
import { ConnectionStrategy } from './ConnectionStrategy';
import { CredentialsStrategy } from './CredentialsStrategy';
import { ListMicroservicesStrategy } from './ListMicroservicesStrategy';
import { PingStrategy } from './PingStrategy';
import { RemoveMicroservicesStrategy } from './RemoveMicroservicesStrategy';
import { TomcatStrategy } from './TomcatStrategy';
import { MapStrategy } from './MapStrategy';
import { ArtifactoryCredentialsStrategy } from './ArtifactoryCredentialsStrategy';
import { ArtifactoryConnectionStrategy } from './ArtifactoryConnectionStrategy';
import { MicroserviceInfoStrategy } from './MicroserviceInfoStrategy';
import { DownloadArtifactStrategy } from './DownloadArtifactStrategy';
import { UploadMicroserviceStrategy } from './UploadMicroserviceStrategy';
import { SearchArtifactsStrategy } from './SearchArtifactsStrategy';
import { SelectStrategy } from './SelectStrategy';
import { EmptyStrategy } from './EmptyStrategy';
import { PromptStrategy } from './PromptStrategy';


namespace Strategies {
    export namespace Artifactory {
        export function client() {
            return new ArtifactoryConnectionStrategy();
        }

        export function credentials() {
            return new ArtifactoryCredentialsStrategy();
        }

        export function search() {
            return new SearchArtifactsStrategy();
        }

        export function download() {
            return new DownloadArtifactStrategy();
        }
    }

    export namespace SSH {
        export function connection() {
            return new ConnectionStrategy();
        }

        export function credentials() {
            return new CredentialsStrategy();
        }

        export function upload() {
            return new UploadMicroserviceStrategy();
        }
    }

    export namespace Microservice {
        export function info() {
            return new MicroserviceInfoStrategy();
        }

        export function list() {
            return new ListMicroservicesStrategy();
        }

        export function remove() {
            return new RemoveMicroservicesStrategy();
        }
    }

    export function empty() {
        return new EmptyStrategy();
    }

    export function prompt(message: string) {
        return new PromptStrategy(message);
    }

    export function map<T, R>(mapper: (val: T) => R) {
        return new MapStrategy(mapper);
    }

    export function Choice(message: string) {
        return new ChoiceStrategy(message);
    }

    export function select(message: string) {
        return new SelectStrategy(message);
    }

    export function confirm(message: string) {
        return new ConfirmStrategy(message);
    }

    export function ping() {
        return new PingStrategy();
    }

    export function tomcat(action: 'start' | 'stop') {
        return new TomcatStrategy(action);
    }
}

export default Strategies;
