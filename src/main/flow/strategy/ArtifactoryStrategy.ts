import { Strategy } from '.';
import * as inquirer from 'inquirer';
import { ArtifactoryClient } from '../../artifactory';
import { assign, isString } from 'lodash';

type ArtifactoryClientOptions<T> = T & { artifactoryClient: ArtifactoryClient };

export abstract class ArtifactoryStrategy<T, R, E> implements ArtifactoryStrategy<ArtifactoryClientOptions<T>, R, E> {
    client: ArtifactoryClient;

    public apply(args: ArtifactoryClientOptions<T>): Promise<R | E> {
        this.client = args.artifactoryClient;

        return this.wrap(isString(args) ? args.toString() : args);
    }

    public abstract wrap(T): Promise<R | E>;
}