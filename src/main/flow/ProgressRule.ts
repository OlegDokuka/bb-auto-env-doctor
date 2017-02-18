import { Rule } from '.'
import * as inquirer from 'inquirer'
import * as NodeSSH from 'node-ssh'
const logUpdate = require('log-update')

export class ProgressRule<T, R> extends Rule<T, R> {
    constructor(private message: string, private rule: Rule<T, R>) { super() }

    public process(args: Promise<T>): Promise<R> {
        const frames = [
            '⢀⠀',
            '⡀⠀',
            '⠄⠀',
            '⢂⠀',
            '⡂⠀',
            '⠅⠀',
            '⢃⠀',
            '⡃⠀',
            '⠍⠀',
            '⢋⠀',
            '⡋⠀',
            '⠍⠁',
            '⢋⠁',
            '⡋⠁',
            '⠍⠉',
            '⠋⠉',
            '⠋⠉',
            '⠉⠙',
            '⠉⠙',
            '⠉⠩',
            '⠈⢙',
            '⠈⡙',
            '⢈⠩',
            '⡀⢙',
            '⠄⡙',
            '⢂⠩',
            '⡂⢘',
            '⠅⡘',
            '⢃⠨',
            '⡃⢐',
            '⠍⡐',
            '⢋⠠',
            '⡋⢀',
            '⠍⡁',
            '⢋⠁',
            '⡋⠁',
            '⠍⠉',
            '⠋⠉',
            '⠋⠉',
            '⠉⠙',
            '⠉⠙',
            '⠉⠩',
            '⠈⢙',
            '⠈⡙',
            '⠈⠩',
            '⠀⢙',
            '⠀⡙',
            '⠀⠩',
            '⠀⢘',
            '⠀⡘',
            '⠀⠨',
            '⠀⢐',
            '⠀⡐',
            '⠀⠠',
            '⠀⢀',
            '⠀⡀'
        ]
        return args.then<R>(
            v => {
                let i = 0
                const timer = setInterval(() => {
                    const frame = frames[i++ % frames.length]
                    logUpdate(`${this.message} ${frame}`)
                }, 80)

                return this.rule.process(Promise.resolve(v)).then(r => {
                    clearInterval(timer)
                    logUpdate(`${this.message}...Done`)
                    console.log()
                    return Promise.resolve(r)
                }, e => {
                    clearInterval(timer)
                    logUpdate(`${this.message}...Done`)
                    console.log()
                    return Promise.reject(e)
                })
            },
            v => {
                let i = 0
                const timer = setInterval(function () {
                    const frame = frames[i++ % frames.length]
                    logUpdate(`${this.message} ${frame}`)
                }, 80)

                return this.rule.process(Promise.reject(v)).then(r => {
                    clearInterval(timer)
                    logUpdate(`${this.message}...Done`)
                    console.log()
                    return Promise.resolve(r)
                }, e => {
                    clearInterval(timer)
                    logUpdate(`${this.message}...Done`)
                    console.log()
                    return Promise.reject(e)
                })
            }
        )
    }
}
