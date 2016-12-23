/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { SearchFilterPipe } from './search-filter.pipe';

const data = [{
  name: 'a1010abcd',
  type: 't2.medium',
  region: 'eu-east-1',
  publicIP: '10.10.10.10',
  privateIP: '10.10.10.10',
  state: 'stopped',
  selected: false
}, {
  name: 'a1011abcd',
  type: 't2.medium',
  region: 'eu-east-1',
  publicIP: '11.11.11.11',
  privateIP: '11.11.11.11',
  state: 'stopped',
  selected: false
}, {
  name: 'a1012abcd',
  type: 't2.medium',
  region: 'eu-east-1',
  publicIP: '12.12.12.12',
  privateIP: '12.12.12.12',
  state: 'stopped',
  selected: false
}];

describe('Pipe: Search Filter', () => {

  it('should not filter if filterArgs is null on undefined', () => {
    const pipe = new SearchFilterPipe();

    expect(
      pipe.transform(data, undefined)
    ).toEqual(data);

    expect(
      pipe.transform(data, null)
    ).toEqual(data);

  });

  it('should not filter if empty string', () => {
    const pipe = new SearchFilterPipe();

    expect(
      pipe.transform(data, {
        filter: ''
      })
    ).toEqual(data);

  });

  it('should filter', () => {
    const pipe = new SearchFilterPipe();

    expect(
      pipe.transform(data, {
        filter: '1010'
      })
    ).toEqual([{
      name: 'a1010abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '10.10.10.10',
      privateIP: '10.10.10.10',
      state: 'stopped',
      selected: false
    }]);

  });

});
