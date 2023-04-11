import mongoose = require('mongoose');
const mongoUrl =
    `mongodb+srv://${process.env.mongo_username}:${process.env.mongo_password}@${process.env.mongo_host_name}/${process.env.mongo_db_name}?retryWrites=true&w=majority`;


export class MongoHelper {
  public initiateMongoConnection(): void {
    (<any>mongoose).Promise = global.Promise;
    mongoose
      .connect(mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        console.log('Connected to MongoDb');
      })
      .catch((err: Error) => {
        throw `There is error in connecting Mongo DB ${err.message}`;
      });
  }
}
