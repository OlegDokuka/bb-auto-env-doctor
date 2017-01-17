import { Strategy } from '.';
import * as  request from 'request';
import * as inquirer from 'inquirer';

interface PingOptions {
    url: string
    count?: number
    pauseDuration?: number
}

export class PingStrategy implements Strategy<PingOptions, Boolean, Error> {
    public apply(args: PingOptions): Promise<Boolean> {
        return new Promise((r, rj) => {
            let count = args.count || 10;
            const ping = () => request({
                url: args.url,
                timeout: args.pauseDuration || 4000
            }, function (e, response) {
                count--;
                if (!e && response.statusCode === 200) {
                    r(true);
                } else if (count > 0) {
                    setTimeout(ping, args.pauseDuration || 4000)
                } else {
                    rj(new Error("Request counts limit is exceeded"))
                }
            })
        });
    }
}