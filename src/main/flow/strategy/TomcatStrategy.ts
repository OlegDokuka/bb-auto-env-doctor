import { SSHStrategy } from '.'

interface ExecutionError extends Error {
}

export class TomcatStrategy extends SSHStrategy<void, string, ExecutionError> {
    constructor(private action: 'start' | 'stop') { super() }

    public wrap(args: void): Promise<string | ExecutionError> {
        return this.client.execCommand(`service tomcat ${this.action}`)
            .then<string | ExecutionError>(r =>
                r.stderr && !r.stderr.startsWith('Redirecting to /bin/systemctl')
                    ? Promise.reject(new Error(r.stderr))
                    : Promise.resolve(r.stdout))
    }
}
