import { Strategy } from '.';
import * as URL from 'url';
import { Credentials } from '../../entity';
import { ArtifactoryClient } from '../../artifactory';

export class ArtifactoryConnectionStrategy implements Strategy<Credentials, ArtifactoryClient, Error> {
    public apply(credentials: Credentials): Promise<ArtifactoryClient | Error> {
        const url = URL.parse(credentials.host);
        url.auth = `${credentials.username}:${credentials.password}`;
        const artifactory = new ArtifactoryClient(URL.format(url));
        return artifactory.check().then(() => artifactory);
    }
}