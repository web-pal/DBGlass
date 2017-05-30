import faker from 'faker';

import { runQuery } from './utils';
import createUserAccount from './userAccount';
import createCompany from './company';

const pg = require('pg');
const readlineSync = require('readline-sync');

const config = {
  user: 'dbglass',
  database: 'dbglass',
  password: 'dbglass',
  host: 'localhost',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
let tables = [];
let askCredentials = true;

process.argv.slice(2).forEach((val) => {
  switch (val) {
    case 'default-config':
      askCredentials = false;
      break;
    default:
      console.log('Unknown command');
      break;
  }
});

// Ask credentials
if (askCredentials) {
  for (const key of Object.keys(config)) {
    const value = config[key];
    const question = `${key} ${value ? `(default ${value}): ` : ': '}`;
    if (!['max', 'idleTimeoutMillis'].includes(key)) {
      const answer = readlineSync.question(question);
      if (answer) {
        config[value] = answer;
      }
    }
  }
}
const pool = new pg.Pool(config);

pool.on('error', (err) => {
  console.error(err.message);
});

async function getTables(client) {
  const query =
    `SELECT table_name FROM information_schema.tables
    WHERE table_schema='public' AND table_type='BASE TABLE'`;

  return await runQuery(client, query);
}

async function getExtensions(client) {
  const query =
    'SELECT extname FROM pg_extension';
  return await runQuery(client, query);
}

async function connect() {
  let client = null;
  try {
    console.log('Trying connect to database.');
    client = await pool.connect();
  } catch (err) {
    return console.log('Error during connection...');
  }
  tables = await getTables(client);

  const extensions = await getExtensions(client);
  if (!extensions.map(ext => (ext.extname)).includes('uuid-ossp')) {
    try {
      await runQuery(client, 'CREATE EXTENSION "uuid-ossp"', true);
    } catch (err) {
      console.log(
        `Can't create extension. Give ${config.user} SUPERUSER role
        or create extension uuid-ossp manually`
      );
      process.exit();
    }
  }

  const companyIds = await createCompany(client, tables);
  await createUserAccount(client, companyIds, tables);
  process.exit();
}

connect();
