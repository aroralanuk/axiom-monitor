import createEthereum from "./ethereum";
import {Store, MangoStore} from './mongo';
const AxiomV0ABI = require("../abi/AxiomV0.json");
import { logger } from './utils/logger';

export const stores = {
    mongo: MangoStore,
}



interface SyncOptions {
  fromBlockNum: number;
  toBlockNum?: number | null;
  querySize?: number;
}




export function AxiomMonitor(
    store: Store,
    rpcProviderUrl: string,
) {
    console.log("hello worl");
    const axiomContract: string = "0x01d5b501C1fc0121e1411970fb79c322737025c2";
    const ethereum = createEthereum(
      AxiomV0ABI,
      axiomContract,
      rpcProviderUrl
    );
    // ethereum.contract.on("UpdateEvent", (startBlockNumber, prevHash, root, numFinal) => {
    //     console.log("UpdateEvent", startBlockNumber, prevHash, root, numFinal);
    // });

    async function syncHistory({ fromBlockNum, toBlockNum, querySize = 10000 }: SyncOptions) {
      const db = await store.init();
        let endQueryBlock = toBlockNum || await ethereum.currentBlockNum();

        // backfilling backwards from current or specified block
        while (fromBlockNum < endQueryBlock) {

            if (fromBlockNum + querySize > endQueryBlock) {
                logger.info(
                    `Syncing contract ${axiomContract} from block ${fromBlockNum} to ${endQueryBlock}`
                );

                const blockRange = { start: fromBlockNum, end: endQueryBlock };

                const result = await ethereum.getPastEvents(blockRange);
                if (result.length > 0) {
                    logger.info(`Found ${result.length} events`);
                    // await this.store.put(result);
                }
            } else {
                logger.info(
                    `Syncing contract ${axiomContract} from block ${endQueryBlock - querySize} to ${endQueryBlock}`
                );

                const blockRange = { start: endQueryBlock - querySize, end: endQueryBlock };

                const result = await ethereum.getPastEvents(blockRange);
                if (result.length > 0) {
                    logger.info(`Found ${result.length} events`);
                    // await this.store.put(result);
                }
            }
            endQueryBlock -= querySize;
        }


    }

    async function syncHistoryTest() {
        const fromBlockNum =( await ethereum.currentBlockNum()) - 7000;
        await syncHistory({ fromBlockNum });
    }

    //  async function liveSync()

    // check if no recent update in the last 192 blocks

    //

    return {
        store,
        ethereum,
        syncHistory,
        syncHistoryTest,
    }
}

export default AxiomMonitor;


// just for testing
const store = stores.mongo;
store.init();
const axiomMonitor = AxiomMonitor(store, 'https://mainnet.infura.io/v3/26423ae5f7f645398aa0f783e7ced5a6');

axiomMonitor.syncHistoryTest();



