import { ICloudInstance, ICloudInstanceState, NullInstance } from '../models/instance.model';
import { INSTANCE_ACTIONS } from '../actions/instance.actions';
import { reduceReducers } from '../../../shared/redux/reduce-reducers';

export interface IInstanceState {
  instances: Array<ICloudInstance>;
  categories: Array<ICloudInstanceState>;
  isAllSelected: boolean;
  isAllRunning: boolean;
  isSomeSelected: boolean;
}

const INITIAL_STATE: IInstanceState = {
  instances: [] as Array<ICloudInstance>,
  categories: [] as Array<ICloudInstanceState>,
  isAllSelected: false,
  isAllRunning: false,
  isSomeSelected: false
};

const instanceListReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INSTANCE_ACTIONS.LOAD_ALL:
      return Object.assign({}, state, {
        instances: action.payload.map((v) => Object.assign(new NullInstance(), v))
      });
    case INSTANCE_ACTIONS.SELECT:
      return Object.assign({}, state, {
        instances: state.instances.map((i) => {
          if (action.payload.name === i.name) {
            i.selected = !i.selected;
          }
          return i;
        })
      });
    case INSTANCE_ACTIONS.REMOVE:
      return Object.assign({}, state, {
        instances: state.instances.filter((i) => action.payload.name !== i.name)
      });
    case INSTANCE_ACTIONS.SELECT_ALL:
      return Object.assign({}, state, {
        instances: state.instances.map((i) => {
          i.selected = true;
          return i;
        }),
        isAllSelected: true
      });
    case INSTANCE_ACTIONS.DESELECT_ALL:
      return Object.assign({}, state, {
        instances: state.instances.map((i) => {
          i.selected = false;
          return i;
        }),
        isAllSelected: false
      });
    case INSTANCE_ACTIONS.ADD:
      return Object.assign({}, state, {
        instances: state.instances.concat(action.payload)
      });
    case INSTANCE_ACTIONS.UPDATE:
      return Object.assign({}, state, {
        instances: state.instances.map((v) => {
          if (action.payload.name === v.name) {
            return Object.assign({}, v, action.payload);
          }
          return v;
        })
      });
    case INSTANCE_ACTIONS.UPDATE_STATE:
      return Object.assign({}, state, {
        instances: state.instances.map((v) => {
          const result = action.payload.find((item) => item.name === v.name);
          if (result) {
            v.state = result.state;
          }
          return v;
        })
      });
    default:
      return state;
  }
};

const instanceSumReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return Object.assign({}, state, {
        categories: state.instances
          .reduce((prev: any, i) => {
            const match = prev.find((v) => v['type'] === i.state);
            if (match) {
              match.amount++;
            }
            return prev;
          }, [
            { type: 'running', amount: 0, color: '#39FF14' },
            { type: 'starting', amount: 0, color: '#1439FF' },
            { type: 'stopped', amount: 0, color: '#F44336' }
          ]),
        isAllRunning: state.instances.length > 0 ? state.instances
          .filter((i: any) => i.state === 'running').length === state.instances.length : false,
        isSomeSelected: state.instances
          .filter((i: any) => i.selected)
          .length > 0
      });
  }
};

export const instanceReducer = reduceReducers(instanceListReducer, instanceSumReducer);
