import { ArtifactoryStrategy, } from '.';
import { MicroserviceInfo } from '../../entity';
import { DefaultArtifactoryApi } from '../../artifactory';
import { trim, fill, merge } from 'lodash';
import * as inquirer from 'inquirer';

interface SemanticVersion {
    major: number,
    minor: number,
    patch: number,
    other: Array<number>
    type: '' | 'RELEASE' | 'SNAPSHOT'
}

export class SearchArtifactsStrategy extends ArtifactoryStrategy<MicroserviceInfo, Array<MicroserviceInfo & DefaultArtifactoryApi>, Error> {
    public wrap(info: MicroserviceInfo): Promise<Array<MicroserviceInfo & DefaultArtifactoryApi> | Error> {
        const given = this.parseVersion(info.version);

        return this.client.quicksearch(`${info.artifactId}-*.war`)
            .then(v => v
                .filter(daa => this.compareVersions(given, this.parseVersion(daa.path.replace(/^(.+)\/(.+)\/(.+\.war)$/, '$2'))) < 1))
            .then<Array<MicroserviceInfo & DefaultArtifactoryApi> | Error>(v =>
                Promise.all(
                    v.map(daa => daa.file(`/META-INF/maven/${info.groupId}/${info.artifactId}/pom.properties`)
                        .then(pom => merge(daa, this.parsePomProperties(pom))))
                ).then(vv =>
                    vv.filter(inf => {
                        const versionComparisonResult = this.compareVersions(given, this.parseVersion(inf.version));

                        if (versionComparisonResult === 0) {
                            return info.packaged.getTime() < inf.packaged.getTime();
                        }

                        return versionComparisonResult < 0;
                    }).sort((a, b) => {
                        const versionComparisonResult = this.compareVersions(
                            this.parseVersion(a.version),
                            this.parseVersion(b.version)
                        );

                        if (versionComparisonResult === 0) {
                            return a.packaged.getTime() > b.packaged.getTime()
                                ? 1
                                : a.packaged.getTime() < b.packaged.getTime()
                                    ? -1
                                    : 0;
                        }

                        return versionComparisonResult;
                    }))
            );
    }

    private parsePomProperties(pomProps: string): MicroserviceInfo {
        const lines = pomProps.split('\n').map(l => trim(l, '\r')).slice(1);
        const packaged = new Date(trim(lines[0], '\r# '));
        const obj = lines.slice(1).map(v => v.split('=')).reduce((l, r) => merge(l, { [r[0]]: r[1] }), {});

        return merge(obj, { packaged }) as MicroserviceInfo;
    }

    private compareVersions(v1: SemanticVersion, v2: SemanticVersion): number {
        if (v1.major > v2.major) {
            return 1;
        } else if (v1.major < v2.major) {
            return -1;
        }

        if (v1.minor > v2.minor) {
            return 1;
        } else if (v1.minor < v2.minor) {
            return -1;
        }

        if (v1.type === 'SNAPSHOT' && v2.type !== 'SNAPSHOT') {
            return 1;
        } else if (v1.type !== 'SNAPSHOT' && v2.type === 'SNAPSHOT') {
            return -1;
        }

        if (v1.patch > v2.patch) {
            return 1;
        } else if (v1.patch < v2.patch) {
            return -1;
        }

        if (v1.other || v2.other) {
            let v1o = new Array(...(v1.other || [])).map(v => isNaN(v) ? 0 : v);
            let v2o = new Array(...(v2.other || [])).map(v => isNaN(v) ? 0 : v);
            const length = v1o.length > v2o.length ? v1o.length : v2o.length;

            v1o = v1o.concat(fill(new Array(length - v1o.length), 0))
            v2o = v2o.concat(fill(new Array(length - v2o.length), 0))

            for (let i = 0; i < length; i++) {
                if (v1o[i] > v2o[i]) {
                    return 1;
                } else if (v1o[i] < v2o[i]) {
                    return -1;
                }
            }
        }

        return 0;
    }

    private parseVersion(version: string): SemanticVersion {
        const splitted = version.split(/[\.|\-]/g);
        const type = splitted.length > 3 && isNaN(+splitted[splitted.length - 1]) ? splitted[splitted.length - 1] : '';
        const major = +splitted[0];
        const minor = +splitted[1];
        const patch = +splitted[2];
        const other = splitted.length > 4 && type
            ? splitted.slice(3, splitted.length - 1).map(v => +v)
            : splitted.length > 3 && !type
                ? splitted.slice(3, splitted.length).map(v => +v)
                : undefined;

        return { type: (type === 'SNAPSHOT' || type === 'RELEASE' ? type : '') as any, major, minor, patch, other };
    }
}