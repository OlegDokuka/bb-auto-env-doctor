import { SSHStrategy } from '.';
import { TomcatInfo } from '../../entity';
import { merge, fromPairs, trim } from 'lodash';

interface ExecutionError extends Error {
}

export class TomcatInfoStrategy extends SSHStrategy<void, TomcatInfo, ExecutionError> {
    public wrap(args: void): Promise<TomcatInfo | ExecutionError> {
        return this.client.execCommand(`service tomcat status`)
            .then<TomcatInfo | ExecutionError>(r =>
                r.stderr && !r.stderr.startsWith('Redirecting to /bin/systemctl')
                    ? Promise.reject(new Error(r.stderr))
                    : Promise.resolve(this.parse(r.stdout)));
    }

    private parse(output: string): TomcatInfo {
        const result = output
            .split('\n')
            .slice(1)
            .map(s => fromPairs<string>([trim(s, '\r ').split(': ')] as any))
            .reduce((l, r) => merge(l, r));

        return {
            isLoaded: result['Loaded'].split(' ')[0] === 'loaded',
            status: TomcatInfo.Status[result['Active'].split(' ')[0].toUpperCase()]
        }
    }
}

