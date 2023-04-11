import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import { UpdateEvent, Status } from '../updateEvents';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = `mongodb+srv://kunalarora:${process.env.MONGO_PASSWORD}@axiom.facdj3z.mongodb.net/?retryWrites=true&w=majority`;

interface Events {
    events: Record<string, any>;

}



// function checkOnTime(blockIncluded: number, currentBlockNumber: number): boolean {
//     return blockIncluded - 192 <= startBlockNumber;
// }

function parseEventLogs(event: any): UpdateEvent {
    const txHash = event.transactionHash;
    const blockIncluded = event.blockNumber;
    const status = Status.ONTIME;

    const startBlockNumber = parseInt(event.args.startBlockNumber.toString());
    const prevHash = event.args.prevHash;
    const root = event.args.root;
    const numFinal = parseInt(event.args.numFinal.toString());

    return {
        txHash,
        blockIncluded,
        status,
        startBlockNumber,
        prevHash,
        root,
        numFinal
    };
}

function parseEventsLogs(events: any[]): UpdateEvent[] {
    return events.map(parseEventLogs);
}

async function mongoDbConnect(url: string): Promise<Db> {
    console.log("URI:" , MONGODB_URI);
    try {
        const client = await MongoClient.connect(url);
        const dbName = url.split('/').slice(-1)[0];
        const db = client.db(dbName);
        console.log('Connected to MongoDB successfully.');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function mongoInsertMany(collection: any, events: UpdateEvent[]): Promise<void> {
    try {
        const serializedEvents = events.map((event: any) => JSON.stringify(event));
        console.log('serialized events: ', serializedEvents);
        await collection.insertMany(events, { ordered: true });
    } catch (error) {
        console.log('Duplicate events detected, skipping event');
    }
}


export function Mongo() {
    let db: Db | null = null;

    async function init() {
        if (!db) {
            db = await mongoDbConnect(MONGODB_URI);
        }
    }

    async function put(events: any[], currentBlockNumber: number) {
        const collection = db.collection('events');

        const parsedEvents = parseEventsLogs(events);

        await mongoInsertMany(collection, parsedEvents);
    }

    async function get(eventType: string, indexId: string, value: any) {
        const collection = db.collection(eventType);
        const query: Record<string, any> = {};
        query[`args.${indexId}`] = value;
        const result = await collection.find(query).toArray();
        return result.map((item: any) => JSON.parse(item));
    }

    return {
        init,
        put,
        get,
    };
}
