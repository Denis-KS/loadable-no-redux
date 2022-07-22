import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { notReachable } from '../utils';
import { useLiferef } from '../useLiferef';
import * as LoadableTypes from './loadable.types';

type Loading<P> = { type: 'loading', params: P };

export type LoadableWithParamsType<D, E, P> = Loading<P> | LoadableTypes.Loaded<D> | LoadableTypes.Failed<E>;
type Fetch<D, P> = (params: P) => Promise<D>;
type InitialState<D, E, P> = LoadableWithParamsType<D, E, P> | (() => LoadableWithParamsType<D, E, P>)
type LoadableState<D, E, P> = [LoadableWithParamsType<D, E, P>, Dispatch<SetStateAction<LoadableWithParamsType<D, E, P>>>]

export const useLoadableWithParams = <D, E, P>(fetch: Fetch<D, P>, initialState: InitialState<D, E, P>): LoadableState<D, E, P> => {
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
            case 'loaded':
            case 'failed':
                break;
            default:
                notReachable(state);
        };
    }, [state]);


    return [state, setState];
};