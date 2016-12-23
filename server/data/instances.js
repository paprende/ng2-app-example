'use strict';

const getRandomStatisticData = () => {
  let arr = [];
  for (let i = 0; i < 30; i++) {
    arr.push(Math.random() * 10);
  }
  return arr;
};

const getRandomState = () => {
  const state = Math.floor(Math.random() * 3);
  switch (state) {
    case 0:
      return 'stopped';
    case 1:
      return 'starting';
    case 2:
      return 'running';
  }
};

const getRandomInstanceData = (n) => {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(
      Object.assign({
        name: `a${i + 1000}abcd`,
        type: 't2.medium',
        state: 'stopped',
        region: Math.floor(Math.random() * 2) === 0 ? 'eu-east-1' : 'eu-west-1',
        publicIP: '54.210.167.204',
        privateIP: '10.20.30.40',
        traffic: getRandomStatisticData()
      })
    );
  }
  return arr;
};

module.exports = {
  instances: getRandomInstanceData(200),
  getRandomInstanceData: getRandomInstanceData
}
