import { MongoClient, MongoClientOptions } from 'mongodb';

interface Indexed {
    events: Record<string, EthereumEvent>;
}

interface EthereumEventInput {
  name: string;
  type: string;
}

interface EthereumEvent {
  inputs: EthereumEventInput[];
  name: string;
}

export interface Store {
  init: () => Promise<any>;
  put: (events: Event[]) => Promise<void>;
  // Add other methods as needed
}

const updateEvent: EthereumEvent = {
  inputs: [
    { name: 'startBlockNumber', type: 'uint32' },
    { name: 'prevHash', type: 'bytes32' },
    { name: 'root', type: 'bytes32' },
    { name: 'numFinal', type: 'uint32' },
  ],
  name: 'UpdateEvent',
};

// const MongoContainer {
//     private indexed: Indexed;
//     private client: MongoClient;
//     private mongoUrl: string;


//     // async init() {
//     //     const options: MongoClientOptions = {
//     //         useNewUrlParser: true,
//     //         useUnifiedTopology: true,
//     //     };
//     //     this.client = await MongoClient.connect(this.mongoUrl, options);
//     // }
// }

export const MangoStore: Store = {
    init: async () => {},

    put: async (events: Event[]) => {}

}

