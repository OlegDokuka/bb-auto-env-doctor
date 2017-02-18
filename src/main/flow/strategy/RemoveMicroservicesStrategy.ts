import { SSHStrategy } from '.'
import * as inquirer from 'inquirer'

export class RemoveMicroservicesStrategy extends SSHStrategy<string[], void, Error> {
    public wrap(args: string[]): Promise<any> {
        return this.client.exec('mkdir', ['-p', 'temp-webapps'], { cwd: '/opt/tomcat/' })
            .then(() => args.reduce((l, r) => l.then(() =>
                this.client.execCommand(`mv ${r}* ../temp-webapps/`, { cwd: '/opt/tomcat/webapps/' })),
                Promise.resolve(undefined)))
    }
}
