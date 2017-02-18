import { SSHStrategy } from '.'
import * as inquirer from 'inquirer'

export class ListMicroservicesStrategy extends SSHStrategy<void, string[], Error> {
    public wrap(args: void): Promise<string[]> {
        return this.client.execCommand('ls', { cwd: '/opt/tomcat/webapps/' })
            .then(result =>
                result.stdout.split('\n')
                    .filter(v => /^(.+)\.war?/gi.test(v))
                    .map(v => /^(.+)\.war?/gi.exec(v)[1]))
    }
}
