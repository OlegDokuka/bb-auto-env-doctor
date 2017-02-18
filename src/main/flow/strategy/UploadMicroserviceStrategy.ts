import { SSHStrategy } from '.'
import { merge } from 'lodash'
import { resolve, basename } from 'path'
import { unlink } from 'fs'
import * as inquirer from 'inquirer'

export class UploadMicroserviceStrategy extends SSHStrategy<string, void, Error> {
    constructor();
    constructor(remove: boolean);
    constructor(private remove?: boolean) { super() }

    public wrap(path: string): Promise<void | Error> {
        return this.client.putFile(resolve(path), `/opt/tomcat/webapps/${basename(path)}`)
            .then(() => this.remove
                ? new Promise<void>((r, rj) => unlink(path, (e) => e ? rj(e) : r()))
                : undefined)
    }
}
