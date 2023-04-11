import createEthereum from "./ethereum";
import { Mongo } from './mongo/index';
const AxiomV0ABI = require("../abi/AxiomV0.json");
import { logger } from './utils/logger';


interface SyncOptions {
  fromBlockNum: number;
  toBlockNum?: number | null;
  querySize?: number;
}




export async function AxiomMonitor(
    db,
    rpcProviderUrl: string,
) {
    console.log("hello!");
    const axiomContract: string = "0x01d5b501C1fc0121e1411970fb79c322737025c2";

    await db.init();

    const ethereum = createEthereum(
      AxiomV0ABI,
      axiomContract,
      rpcProviderUrl
    );

    async function sync({ fromBlockNum, toBlockNum, querySize = 10000 }: SyncOptions) {
        let endQueryBlock = toBlockNum || await ethereum.currentBlockNum();

        // backfilling backwards from current or specified block
        while (fromBlockNum < endQueryBlock) {
            console.log("while loop");
            if (fromBlockNum + querySize > endQueryBlock) {
                logger.info(
                    `Syncing contract ${axiomContract} from block ${fromBlockNum} to ${endQueryBlock}`
                );

                const blockRange = { start: fromBlockNum, end: endQueryBlock };

                const result = await ethereum.getPastEvents(blockRange);
                if (result.length > 0) {
                    logger.info(`Found ${result.length} events`);
                    await db.put(result);
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

        logger.info(`Old syncing contract ${axiomContract} complete`);

        // live syncing
        ethereum.getLiveEvents();

    }

    async function syncTest() {
        const fromBlockNum =( await ethereum.currentBlockNum()) - 500;
        await sync({ fromBlockNum });
    }

    return {
        db,
        ethereum,
        sync,
        syncTest,
    }
}

export default AxiomMonitor;

// just for testing
async function main() {
    const db = await Mongo();
    const axiomMonitor = await AxiomMonitor(db, 'https://mainnet.infura.io/v3/26423ae5f7f645398aa0f783e7ced5a6');

    axiomMonitor.syncTest();
}

main();





