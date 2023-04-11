import { Contract, ContractEventName, EventFilter, EventLog } from 'ethers';
import { ethers } from 'ethers';
import { UpdateEvent, Status } from './updateEvents';

interface BlockRange {
  start: number;
  end: number;
}

const createEthereum = (abi: any[], contractAddress: string, rpcProviderUrl: string) => {
    const rpcProvider = new ethers.JsonRpcProvider(rpcProviderUrl);
    const contract = new ethers.Contract(contractAddress, abi, rpcProvider);

    const eventSignature: string = "UpdateEvent(uint32,bytes32,bytes32,uint32)";
    const eventName: ContractEventName = "UpdateEvent";
    const eventTopic: string = ethers.id(eventSignature);

    const eventsFilter: EventFilter = {
        address: contractAddress,
        topics: [eventTopic],
    };

    async function getPastEvents(blockRange: BlockRange){
        const result = await contract.queryFilter(eventName, blockRange.start, blockRange.end);
        return result;
    }

    let lastUpdateEventBlock: number | null = null;

    async function getLiveEvents() {
        const currentBlockNumber = await currentBlockNum();
        contract.on(eventName, (startBlockNumber, prevHash, root, numFinal, event) => {
            const eventData: UpdateEvent = {
                txHash: event.transactionHash,
                blockIncluded: event.blockNumber,
                status: Status.ONTIME,
                startBlockNumber,
                prevHash,
                root,
                numFinal,
            };
            console.log('New event received:', eventData);

            lastUpdateEventBlock = event.blockNumber;

            // Set a new timeout to trigger an alert if no new UpdateEvent is received within 192 blocks
            if (currentBlockNumber - lastUpdateEventBlock! >= 192) {
                console.log('ALERT: No UpdateEvent received within the last 192 blocks');
            }
        });
    }

    // get current block number
    async function currentBlockNum() {
        return await rpcProvider.getBlockNumber();
    }


  // Other functions

    return {
        contract,
        getPastEvents,
        currentBlockNum,
        getLiveEvents,
  };
};

export default createEthereum;




