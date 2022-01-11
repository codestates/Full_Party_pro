import { Sequelize } from 'sequelize';
import config from '../config/config';


const sequelize = new Sequelize(
  config.development.database, 
  config.development.username, 
  config.development.password, {
    host: config.development.host,
    dialect: "mysql",
    timezone: config.development.timezone
  }
);

export default sequelize;