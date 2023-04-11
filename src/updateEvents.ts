
export enum Status {
  ONTIME = 'ONTIME',
  MISSING = 'MISSING',
  RESOLVED = 'RESOLVED',
}

export interface UpdateEvent {
  txHash: string;
  blockIncluded: number;
  status: Status;

  // event topics
  startBlockNumber: number;
  prevHash: string;
  root: string;
  numFinal: number;
}
