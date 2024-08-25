// simple-test.js
require('./util/import-mongo/.env').config();

console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('DATASRC:', process.env.DATASRC);
