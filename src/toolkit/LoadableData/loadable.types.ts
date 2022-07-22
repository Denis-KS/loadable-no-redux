export type Loading = { type: 'loading' };

export type Failed<E> = { type: 'failed', error: E };

export type Loaded<D> = { type: 'loaded', data: D };

export type NotAsked = { type: 'notAsked' };