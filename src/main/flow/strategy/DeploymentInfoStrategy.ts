import { SSHStrategy } from '.'
import { DeployInfo } from '../../entity'

interface ExecutionError extends Error {
}

export class DeploymentInfoStrategy extends SSHStrategy<void, DeployInfo, ExecutionError> {
    public wrap(args: void): Promise<DeployInfo | ExecutionError> {
        return this.client.execCommand('cat /opt/install/package/deploy.log | grep -E -i -w \'Finished|There was a problem while starting tomcat.|Could not start the tomcat correctly.\'')
            .then<DeployInfo | ExecutionError>(r =>
                r.stderr
                    ? Promise.reject(new Error(r.stderr))
                    : Promise.resolve({ isFinished: r.stdout.length > 0 }))
    }
}
