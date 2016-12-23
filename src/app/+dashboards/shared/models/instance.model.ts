export interface ICloudInstance {
  name: string;
  type: string;
  state: string;
  region: string;
  publicIP: string;
  privateIP: string;
  traffic: Array<number>;
  selected: boolean;
};

export interface ICloudInstanceState {
  type: string;
  amount: number;
  color: string;
}

export class NullInstance implements ICloudInstance {
  name = '';
  type = '';
  state = '';
  region = '';
  publicIP = '';
  privateIP = '';
  traffic = [];
  selected = false;
}
