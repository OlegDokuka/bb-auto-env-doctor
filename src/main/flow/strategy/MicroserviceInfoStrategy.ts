import { SSHStrategy } from '.';
import { MicroserviceInfo } from '../../entity';
import { merge, fromPairs, trim } from 'lodash';
import * as inquirer from 'inquirer';


export class MicroserviceInfoStrategy extends SSHStrategy<string, MicroserviceInfo, Error> {
    public wrap(name: string): Promise<MicroserviceInfo | Error> {
        return this.client.execCommand(`unzip -p ${name}.war META-INF/MANIFEST.MF`, { cwd: '/opt/tomcat/webapps/' })
            .then(result =>
                result.stdout.split('\n')
                    .map(l => fromPairs<string>([l.split(': ')] as any))
                    .reduce((l, r) => merge(l, r)))
            .then(v => trim(v['provider'], ' \r') !== 'gradle' ? Promise.resolve({
                artifactId: trim(v['Implementation-Title'], ' \r'),
                groupId: trim(v['Implementation-Vendor-Id'], ' \r'),
                version: trim(v['Implementation-Version'], ' \r')
            }) : Promise.reject({
                artifactId: trim(v['Implementation-Title'], ' \r'),
                version: trim(v['Implementation-Version'], ' \r'),
                packaged: new Date(trim(v['Build-Time'], ' \r'))
            })).then(v =>
                this.client.execCommand(`unzip -p ${name}.war META-INF/maven/${v['groupId']}/${v['artifactId']}/pom.properties`, { cwd: '/opt/tomcat/webapps/' })
                    .then(result =>
                        merge(v as any, {
                            packaged: new Date(result.stdout.split('\n').map(l => trim(l, '\r# '))[1])
                        }) as MicroserviceInfo
                    ), v => Promise.resolve(v)
            )
    }
}