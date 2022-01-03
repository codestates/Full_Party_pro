const config = require("./index");

module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    // host: config.database.host,
    // port: config.database.port,
    dialect: "mysql",
    timezone: "+09:00",
  },
  test: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    // host: config.database.host,
    // port: config.database.port,
    dialect: "mysql",
    timezone: "+09:00",
  },
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    // host: config.database.host,
    // port: config.database.port,
    dialect: "mysql",
    timezone: "+09:00",
  },
};