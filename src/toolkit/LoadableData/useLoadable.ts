import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLiferef } from '../useLiferef';
import { notReachable } from '../utils';
import * as LoadableTypes from './loadable.types';

export type LoadableType<D, E> = LoadableTypes.Loading | LoadableTypes.Loaded<D> | LoadableTypes.Failed<E>;
type Fetch<D> = () => Promise<D>;
type InitialState<D, E> = LoadableType<D, E> | (() => LoadableType<D, E>)
type LoadableState<D, E> = [LoadableType<D, E>, Dispatch<SetStateAction<LoadableType<D, E>>>]

export const useLoadable = <D, E>(fetch: Fetch<D>, initialState: InitialState<D, E> = { type: 'loading' }): LoadableState<D, E> => {
    const fetchRef = useLiferef(fetch)
    const [state, setState] = useState(initialState);

    useEffect(() => {
        switch (state.type) {
            case 'loading': {
                console.log('ololo');
                fetchRef.current()
                .then((result) => setState({ type: 'loaded', data: result }))
                .catch(error => setState({ type: 'failed', error }));
                break;
            }
            case 'loaded':
            case 'failed':
                break;
            default:
                notReachable(state);
        };
    }, [state]);


    return [state, setState];
};