import React, { useState } from 'react';

import './App.css';
import { fetchApis } from './domains/apisDomain/api';
import { fetchCities } from './domains/citiesDomain/api';
import { fetchUniversities, UniversitiesParams } from './domains/universitiesDomain/api';
import { useLazyLoadableWithParams, LazyLoadableWithParamsType } from './toolkit/LoadableData/useLazyLoadableWithParams';
import { useLoadable, LoadableType } from './toolkit/LoadableData/useLoadable';
import { useLoadableWithParams, LoadableWithParamsType } from './toolkit/LoadableData/useLoadableWithParams';
import { notReachable } from './toolkit/utils';

type Message = 
    { type: 'onUniversityChange', value: string }
  | { type: 'onApiChange', value: string }
  | { type: 'onSearchChange', value: string }
  | { type: 'onSearchClick' };

interface IState {
  university: string | null;
  api: string | null;
  search: string;
};

const initialState: IState = {
  university: null,
  api: null,
  search: '',
};

const App = () => {
  const [state, setState] = useState(initialState);
  const [universitiesLoadableState] = useLoadableWithParams(fetchUniversities, { type: 'loading', params: { country: 'Jordan' } });
  const [apisLoadableState] = useLoadable(fetchApis);
  const [citiesLoadableState, setCitiesLoadableState] = useLazyLoadableWithParams(fetchCities);

  const onMessage = (message: Message) => {
    switch (message.type) {
      case 'onUniversityChange': 
        setState((prevState) => ({...prevState, university: message.value}))
        break;
      case 'onApiChange':
        setState((prevState) => ({...prevState, api: message.value}))
        break;
      case 'onSearchChange':
        setState((prevState) => ({...prevState, search: message.value}))
        break;
      case 'onSearchClick':
        setCitiesLoadableState({ type: 'loading', params: state.search });
        break; 
      default: notReachable(message);
    }
  };

  return (
    <>
      <UniversitiesLoadableView loadableState={universitiesLoadableState} onMessage={onMessage} />
      <ApisLoadableView loadableState={apisLoadableState} onMessage={onMessage}/>
      <input onChange={({ target: { value } }) => onMessage({ type: 'onSearchChange', value }) } value={state.search} />
      <button onClick={() => onMessage({ type: 'onSearchClick' })}>Search</button>
      <br/>
      <SynonimLoadableView loadableState={citiesLoadableState} />
    </>
  )
};

export default App;

interface ILoadableOverview {
  loadableState: LoadableWithParamsType<any, unknown, UniversitiesParams> | LoadableType<any, unknown>;
  onMessage: (message: Message) => void;
}

interface ISynonimLoadableOverview {
  loadableState: LazyLoadableWithParamsType<any, unknown, string>
}

const UniversitiesLoadableView: React.FC<ILoadableOverview> = ({ loadableState, onMessage }) => {
  switch (loadableState.type) {
    case 'loading': return <span>Loading...</span>
    case 'loaded': return (
      <select onChange={({ target: { value } }) => onMessage({ type: 'onUniversityChange', value })}>
        {loadableState.data.map(({ name }: any, index: number) => <option key={index}>{name}</option> )}
      </select>
    )
    case 'failed': return <span>failed...</span>
    default: return notReachable(loadableState)
  };
}

const ApisLoadableView: React.FC<ILoadableOverview> = ({ loadableState, onMessage }) => {
  switch (loadableState.type) {
    case 'loading': return <span>Loading...</span>
    case 'loaded': return (
      <select onChange={({ target: { value } }) => onMessage({ type: 'onApiChange', value })}>
        {loadableState.data.entries.map(({ API }: any, index: number) => <option key={index}>{API}</option> )}
      </select>
    )
    case 'failed': return <span>failed...</span>
    default: return notReachable(loadableState)
  };
}

const SynonimLoadableView: React.FC<ISynonimLoadableOverview> = ({ loadableState }) => {
  switch (loadableState.type) {
    case 'notAsked': return <span>not asked</span>
    case 'loading': return <span>loading</span>
    case 'loaded': return <span>{loadableState.data.data.map(({ city }: any, index: number) => <div key={index}>{city}</div>)}</span>
    case 'failed': return <span>failed</span>
    default: return notReachable(loadableState);
  }
}
