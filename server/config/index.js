require('dotenv').config();

const importer = (key, defaultValue = undefined) => {
  const value = process.env[key] || defaultValue;
  if (value === null) throw new Error(`Key ${key} is undefined`);
  return value;
}

module.exports = {
  database: {
    host: importer("DATABASE_HOST"),
    port: importer("DATABASE_PORT"),
    username: importer("DATABASE_USERNAME"),
    password: importer("DATABASE_PASSWORD"),
    name: importer("DATABASE_NAME"),
  }
}