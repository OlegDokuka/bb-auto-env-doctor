#!/usr/bin/env node
import { Flow } from './flow'
import { ArtifactoryClient } from './artifactory'
import { MicroserviceInfo, ArtifactoryItem, TomcatInfo, DeployInfo } from './entity'
import Strategies from './flow/strategy'
import * as NodeSSH from 'node-ssh'

Flow.of(
    Strategies.confirm('Is it finally created Environment? (Otherwise next steps modify Environments creation process)'),
    Flow.fork(
        Flow.retry(
            Flow.union(
                Strategies.SSH.credentials(),
                Strategies.SSH.connection(),
                Strategies.map((c: NodeSSH.NodeSSH) => ({ sshClient: c }))
            )
        ),
        Flow.union(
            Strategies.SSH.credentials(),
            Flow.progress('Waiting for Environment Startup', Flow.retry(
                Flow.union(
                    Strategies.SSH.connection(),
                    Flow.pause(5000)
                )
            )),
            Strategies.map((c: NodeSSH.NodeSSH) => ({ sshClient: c })),
            Flow.context(
                Flow.progress('Waiting for Tomcat Startup', Flow.retry(
                    Flow.union(
                        Flow.pause(5000),
                        Strategies.Tomcat.status(),
                        Strategies.map((v: TomcatInfo) => v.status === TomcatInfo.Status.ACTIVE ? Promise.resolve() : Promise.reject(undefined))
                    )
                )),
                Flow.progress('Stopping Tomcat Service', Strategies.Tomcat.stop()),
                Flow.progress('Starting Tomcat Service', Strategies.Tomcat.start()),
                Flow.progress('Waiting for Tomcat Startup', Flow.retry(
                    Flow.union(
                        Flow.pause(2000),
                        Strategies.Tomcat.status(),
                        Strategies.map((v: TomcatInfo) => v.status === TomcatInfo.Status.ACTIVE ? Promise.resolve() : Promise.reject(undefined))
                    )
                )),
                Flow.progress('Waiting for Deployment finalizing', Flow.retry(
                    Flow.union(
                        Flow.pause(5000),
                        Strategies.Microservice.deployment(),
                        Strategies.map((v: DeployInfo) => v.isFinished ? Promise.resolve() : Promise.reject(undefined))
                    )
                )),
                Flow.progress('Stopping Tomcat Service', Strategies.Tomcat.stop()),
                Flow.progress('Finalizing Step', Flow.pause(60000)),
                Strategies.map((c: { sshClient: NodeSSH.NodeSSH }) => ({ sshClient: c.sshClient }))
            )
        )
    ),
    Flow.context(
        Flow.progress('Stopping Tomcat Service', Strategies.Tomcat.stop()),
        Strategies.Microservice.list(),
        Strategies.Choice('Check MS to uninstall'),
        Flow.progress('Removing Microservices', Strategies.Microservice.remove()),
        Strategies.confirm('Would you like to update MSs?'),
        Flow.fork(
            Flow.context(
                Flow.retry(
                    Flow.union(
                        Strategies.Artifactory.credentials(),
                        Strategies.Artifactory.client()
                    )
                ),
                Strategies.map(v => ({ artifactoryClient: v })),
                Flow.repeat(
                    Flow.context(
                        Strategies.confirm('Would you like to search file in artifactory? (Otherwise from local FS)'),
                        Flow.fork(
                            Flow.context(
                                Strategies.Microservice.list(),
                                Strategies.select('Choose which Microservice should be updated?'),
                                Strategies.Microservice.info(),
                                Flow.progress('Searching', Strategies.Artifactory.search()),
                                Flow._switch(
                                    Flow._case((l: any[]) => l && l.length > 0)(
                                        Flow.context(
                                            Strategies.map((vs: (MicroserviceInfo & ArtifactoryItem)[]) => vs.map(v => ({
                                                name: `${v.name}    ${v.version}    ${v.packaged}`,
                                                value: v
                                            }))),
                                            Strategies.select('Choose required artifact'),
                                            Flow.progress('Downloading', Strategies.Artifactory.download()),
                                            Flow.progress('Uploading', Strategies.SSH.upload(true))
                                        )
                                    ),
                                    Flow._case(() => true)(Strategies.prompt('You service already up to date'))
                                )
                            ),
                            Flow.context(
                                Strategies.input('Enter absolute path to file:'),
                                Flow.progress('Uploading', Strategies.SSH.upload())
                            )
                        ),
                        Strategies.confirm('Would you like to upload another MSs?')
                    )
                )
            ),
            Strategies.empty()
        ),
        Flow.progress('Starting Tomcat Service', Strategies.Tomcat.start()),
        Strategies.map(() => process.exit())
    )
)()
