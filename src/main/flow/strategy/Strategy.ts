export interface Strategy<T, R, E> {
    apply(optins: T): Promise<R | E>;
}

export default Strategy;