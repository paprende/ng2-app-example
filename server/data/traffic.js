'use strict';

const getRandomTrafficData = () => {
  return [
    { type: 'TEST', date: '2016-01-01', value: '0' },
    { type: 'TEST', date: '2016-01-02', value: '0' },
    { type: 'TEST', date: '2016-01-03', value: '0' },
    { type: 'TEST', date: '2016-01-04', value: '0' },
    { type: 'TEST', date: '2016-01-05', value: '0' },
    { type: 'TEST', date: '2016-01-06', value: '0' },
    { type: 'TEST', date: '2016-01-07', value: '0' },
    { type: 'TEST', date: '2016-01-08', value: '0' },
    { type: 'TEST', date: '2016-01-09', value: '0' },
    { type: 'TEST', date: '2016-01-10', value: '0' },
    { type: 'TEST', date: '2016-01-11', value: '0' },
    { type: 'TEST', date: '2016-01-12', value: '0' },
    { type: 'TEST', date: '2016-01-13', value: '0' },
    { type: 'TEST', date: '2016-01-14', value: '0' },
  ].map((v) =>
    Object.assign(v, {
      value: Math.floor(Math.random() * 20)
    })
  );
}

module.exports = getRandomTrafficData();
