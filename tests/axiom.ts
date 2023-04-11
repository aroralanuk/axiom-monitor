async main() {
// just for testing
const db = await Mongo();
const axiomMonitor = await AxiomMonitor(db, 'https://mainnet.infura.io/v3/26423ae5f7f645398aa0f783e7ced5a6');

axiomMonitor.syncHistoryTest();
}
