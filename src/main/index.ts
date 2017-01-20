import { Flow } from './flow';
import { ArtifactoryClient } from './artifactory';
import { MicroserviceInfo, FileInfo } from './entity';
import Strategies from './flow/strategy';
import * as NodeSSH from 'node-ssh';


Flow.of(
    Flow.retry(
        Flow.union(
            Strategies.SSH.credentials(),
            Strategies.SSH.connection()
        )
    ),
    Strategies.map((c: NodeSSH.NodeSSH) => ({ sshClient: c })),
    Flow.context(
        Strategies.tomcat('stop'),
        Strategies.Microservice.list(),
        Strategies.Choice("Check MS to uninstall"),
        Strategies.Microservice.remove(),
        Strategies.confirm("Would you like to update MSs?"),
        Flow.fork(
            Flow.context(
                Flow.retry(
                    Flow.union(
                        Strategies.Artifactory.credentials(),
                        Strategies.Artifactory.client(),
                    )
                ),
                Strategies.map(v => ({ artifactoryClient: v })),
                Flow.context(
                    Flow.repeat(
                        Flow.context(
                            Strategies.Microservice.list(),
                            Strategies.select("Choose which Microservice should be updated?"),
                            Strategies.Microservice.info(),
                            Strategies.Artifactory.search(),
                            Flow._switch(
                                Flow._case((l: any[]) => l && l.length > 0)(
                                    Flow.context(
                                        Strategies.map((vs: (MicroserviceInfo & FileInfo)[]) => vs.map(v => ({
                                            name: `${v.path.replace(/^(.+)\/(.+)\/(.+\.war)$/, '$3')}    ${v.version}    ${v.packaged}`,
                                            value: v
                                        }))),
                                        Strategies.select("Choose required artifact"),
                                        Strategies.Artifactory.download(),
                                        Strategies.SSH.upload(),
                                    ),
                                ),
                                Flow._case(() => true)(Strategies.prompt("You service already up to date"))
                            ),
                            Strategies.confirm("Would you like to update another MSs?")
                        )
                    )
                )
            ),
            Strategies.empty()
        ),
        Strategies.tomcat('start')
    )

)();