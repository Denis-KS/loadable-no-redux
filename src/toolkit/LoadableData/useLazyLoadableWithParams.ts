import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { notReachable } from '../utils';
import { useLiferef } from '../useLiferef';
import * as LoadableTypes from './loadable.types';

type Loading<P> = { type: 'loading', params: P };

export type LazyLoadableWithParamsType<D, E, P> = Loading<P> | LoadableTypes.Loaded<D> | LoadableTypes.Failed<E> | LoadableTypes.NotAsked;
type Fetch<D, P> = (params: P) => Promise<D>;
type InitialState<D, E, P> = LazyLoadableWithParamsType<D, E, P> | (() => LazyLoadableWithParamsType<D, E, P>);
type LoadableState<D, E, P> = [LazyLoadableWithParamsType<D, E, P>, Dispatch<SetStateAction<LazyLoadableWithParamsType<D, E, P>>>]

export const useLazyLoadableWithParams = <D, E, P>(fetch: Fetch<D, P>, initialState: InitialState<D, E, P> = { type: 'notAsked' }): LoadableState<D, E, P> => {
    const fetchRef = useLiferef(fetch)
    const [state, setState] = useState(initialState);

    useEffect(() => {
        switch (state.type) {
            case 'loading': {
                fetchRef.current(state.params)
                .then((result) => setState({ type: 'loaded', data: result }))
                .catch(error => setState({ type: 'failed', error }));
                break;
            }
            case 'notAsked':
            case 'loaded':
            case 'failed':
                break;
            default:
                notReachable(state);
        };
    }, [state]);


    return [state, setState];
};