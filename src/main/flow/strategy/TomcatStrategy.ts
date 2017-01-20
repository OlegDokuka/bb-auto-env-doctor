import { SSHStrategy } from '.';
import * as inquirer from 'inquirer';

interface ExecutionError extends Error {
}

export class TomcatStrategy extends SSHStrategy<void, string, ExecutionError> {
    constructor(private action: 'start' | 'stop') { super(); }

    public wrap(args: void): Promise<string | ExecutionError> {
        return this.client.execCommand(`service tomcat stop`)
            .then<string | ExecutionError>(r =>
                r.stderr && !r.stderr.startsWith('Redirecting to /bin/systemctl')
                    ? Promise.reject(new Error(r.stderr))
                    : Promise.resolve(r.stdout));
    }
}