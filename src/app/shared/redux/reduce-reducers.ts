export function reduceReducers(...reducers) {
  return function (previous: any, current: any) {
    return reducers.reduce(function (p, r) {
      return r(p, current);
    }, previous);
  };
}
