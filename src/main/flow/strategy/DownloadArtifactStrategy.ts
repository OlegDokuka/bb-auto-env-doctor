import { ArtifactoryStrategy } from '.';
import { MicroserviceInfo, ArtifactoryItem } from '../../entity';
import { DefaultArtifactoryApi } from '../../artifactory';
import { trim, fill, merge } from 'lodash';
import * as inquirer from 'inquirer';

export class DownloadArtifactStrategy extends ArtifactoryStrategy<ArtifactoryItem & MicroserviceInfo, string, Error> {
    public wrap(info: ArtifactoryItem & MicroserviceInfo): Promise<string | Error> {
        return this.client.download(info.repo, `${info.path}/${info.name}`, `./${info.artifactId}.war`).then(() => `./${info.artifactId}.war`);
    }
}