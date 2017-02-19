import { SSHStrategy } from '.'
import * as request from 'request'
import * as inquirer from 'inquirer'

interface PingOptions {
    url: string
    count?: number
    pauseDuration?: number
}

export class PingStrategy extends SSHStrategy<void, Boolean, Error> {
    public wrap(): Promise<Boolean> {
        return new Promise((r, rj) => {
            let count = 100
            const ping = () => request({
                url: `http://${this.client.connection.config.host}:8080`,
                timeout: 4000
            }, function (e, response) {
                count--
                if (!e && (response.statusCode === 200 || response.statusCode === 404)) {
                    r(true)
                } else if (count > 0) {
                    setTimeout(ping, 4000)
                } else {
                    rj(new Error('Request counts limit is exceeded'))
                }
            })

            ping()
        })
    }
}
