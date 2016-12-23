import { combineReducers } from 'redux';
import { reduceReducers } from './shared/redux/reduce-reducers';

import { instanceReducer, IInstanceState } from './+dashboards/shared/reducers/instance.reducer';
import { trafficReducer } from './+dashboards/shared/reducers/traffic.reducer';

export interface IAppState {
  instances: IInstanceState;
}

export const rootReducer = reduceReducers(
  combineReducers<IAppState>({
    instances: instanceReducer,
    traffic: trafficReducer
  }), (state, action) => {
    return state;
  }
);
