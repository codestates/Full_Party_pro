const dotenv = require('dotenv').config();

const importer = (key: any, defaultValue: any = undefined) => {
  const value = process.env[key] || defaultValue;
  if (value === null) throw new Error(`Key ${key} is undefined`);
  return value;
}

const index = {
  database: {
    host: importer("DATABASE_HOST"),
    port: importer("DATABASE_PORT"),
    username: importer("DATABASE_USERNAME"),
    password: importer("DATABASE_PASSWORD"),
    name: importer("DATABASE_NAME"),
  },
  port: parseInt(importer("HTTPS_PORT", 8080), 10),
  cors: { allowedOrigin: importer("CORS_ALLOW_ORIGIN") }
}

export default index;