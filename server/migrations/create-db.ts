import { Sequelize, Options } from "sequelize";
import config from "../config/config"
import * as dotenv from 'dotenv';
dotenv.config();

class options implements Options {
   dialect!: 'mysql';
   username!: string;
   password!: string;
   host!: string;
   port!: number;
}

const createDBOptions = new options();
createDBOptions.username = config.development.username;
createDBOptions.password = config.development.password;
createDBOptions.host = config.development.host;
createDBOptions.port = config.development.port;
createDBOptions.dialect = 'mysql';

let dbName = config.development.database;

const dbCreateSequelize = new Sequelize(createDBOptions);

console.log(`====== Create DataBase : ${dbName} ======`);

dbCreateSequelize.getQueryInterface().createDatabase(dbName)
  .then(() => console.log("✅ DB create success!"))
  .catch((error) => console.log("❗️ error in create DB : ", error));