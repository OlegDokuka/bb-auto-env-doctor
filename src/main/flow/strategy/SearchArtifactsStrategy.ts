import { ArtifactoryStrategy } from '.'
import { MicroserviceInfo, ArtifactoryItem } from '../../entity'
import { DefaultArtifactoryApi, DomainQuery } from '../../artifactory'
import { trim, fill, merge } from 'lodash'
import * as inquirer from 'inquirer'

interface SemanticVersion {
    major: number,
    minor: number,
    patch: number,
    other: Array<number>
    type: '' | 'RELEASE' | 'SNAPSHOT'
}

export class SearchArtifactsStrategy extends ArtifactoryStrategy<MicroserviceInfo, Array<ArtifactoryItem>, Error> {
    public wrap(info: MicroserviceInfo): Promise<Array<ArtifactoryItem & MicroserviceInfo> | Error> {
        const given = this.parseVersion(info.version)

        return this.client.aql(DomainQuery.items().find({
            name: { $match: `${info.artifactId}*.war` },
            $or: [
                { created: { $gt: info.packaged } },
                { updated: { $gt: info.packaged } }
            ],
            $and: [
                { name: { $nmatch: '*-boot*' } }
            ]
        })).then<Array<ArtifactoryItem & MicroserviceInfo>>(infos => infos.map(i => merge(i, {
            packaged: new Date(i.updated ? i.updated : i.created),
            version: i.path.replace(/^(.+)\/(.+)$/, '$2'),
            artifactId: info.artifactId,
            groupId: i.path.replace(/^(.+)\/(.+)\/(.+)$/, '$1').replace(/\//g, '.')
        } as MicroserviceInfo)))
    }

    private parseVersion(version: string): SemanticVersion {
        const splitted = version.split(/[\.|\-]/g)
        const type = splitted.length > 3 && isNaN(+splitted[splitted.length - 1]) ? splitted[splitted.length - 1] : ''
        const major = +splitted[0]
        const minor = +splitted[1]
        const patch = +splitted[2]
        const other = splitted.length > 4 && type
            ? splitted.slice(3, splitted.length - 1).map(v => +v)
            : splitted.length > 3 && !type
                ? splitted.slice(3, splitted.length).map(v => +v)
                : undefined

        return { type: (type === 'SNAPSHOT' || type === 'RELEASE' ? type : '') as any, major, minor, patch, other }
    }
}
