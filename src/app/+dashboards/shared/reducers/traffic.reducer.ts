import { ITraffic } from '../models/traffic.model';
import { TRAFFIC_ACTIONS } from '../actions/traffic.actions';

const INITIAL_STATE: Array<ITraffic> = [];

export const trafficReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRAFFIC_ACTIONS.LOAD_ALL:
      return action.payload;
    default:
      return state;
  }
};
