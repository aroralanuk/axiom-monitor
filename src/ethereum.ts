import { Contract, ContractEventName, EventFilter, EventLog } from 'ethers';
import { ethers } from 'ethers';
// import abiDecoder from 'abi-decoder';
// import logger from './logger.js';

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

    // get current block number
    async function currentBlockNum() {
        return await rpcProvider.getBlockNumber();
    }


  // Other functions

  return {
    contract,
      getPastEvents,
        currentBlockNum,
  };
};

export default createEthereum;




