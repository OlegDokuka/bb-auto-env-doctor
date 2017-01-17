import { Flow } from './flow';
import Strategies from './flow/strategy';
import * as NodeSSH from 'node-ssh';

Flow.of(
    // Strategies.confirm("Would you like left node?"),
    // Flow.fork(
    //     Strategies.map(() => console.log("left")),
    //     Strategies.map(() => console.log("right"))
    // )
    // Strategies.credentials(),
    // Strategies.confirm()
    Strategies.map(() => ({ host: 'autumn-sea-43-live.backbase.dev', user: 'root', password: 'b4ckb4s3' })),
    Strategies.connection(),
    Strategies.map((c: NodeSSH.NodeSSH) => ({ sshClient: c })),
    Flow.context(
        // Strategies.tomcat('start'),
        Strategies.listMicroservices(),
        Strategies.choise("Check MS to uninstall")
    )
)()