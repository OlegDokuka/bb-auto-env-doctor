import { SSHStrategy } from '.'
import { DeployInfo } from '../../entity'

interface ExecutionError extends Error {
}

export class DeploymentInfoStrategy extends SSHStrategy<void, DeployInfo, ExecutionError> {
    public wrap(args: void): Promise<DeployInfo | ExecutionError> {
        return this.client.execCommand('cat /opt/install/package/deploy.log | grep \'Finished!\'')
            .then<DeployInfo | ExecutionError>(r =>
                r.stderr
                    ? Promise.reject(new Error(r.stderr))
                    : Promise.resolve({ isFinished: r.stdout === 'Finished!' }))
    }
}
