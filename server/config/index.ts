const dotenv = require('dotenv').config();

const importer = (key: any, defaultValue: any = undefined) => {
  const value = process.env[key] || defaultValue;
  if (value === null) throw new Error(`Key ${key} is undefined`);
  return value;
}

export default {
  database: {
    host: importer("DATABASE_HOST"),
    port: importer("DATABASE_PORT"),
    username: importer("DATABASE_USERNAME"),
    password: importer("DATABASE_PASSWORD"),
    name: importer("DATABASE_NAME"),
  },
  port: parseInt(importer("HTTPS_PORT", 8080), 10),
  cors: { allowedOrigin: importer("CORS_ALLOW_ORIGIN") },
  accessSecret: importer("ACCESS_SECRET"),
  google: {
    googleClientId: importer("GOOGLE_CLIENT_ID"),
    googleClientSecret: importer("GOOGLE_CLIENT_SECRET"),
  },
  kakao: {
    kakaoClientId: importer("KAKAO_CLIENT_ID"),
    kakaoClientSecret: importer("KAKAO_CLIENT_SECRET"),
  },
}