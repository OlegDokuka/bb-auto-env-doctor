export interface Strategy<T, R, E> {
    apply(options: T): Promise<R | E>
}

export default Strategy
