import faker from 'faker';

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
      // askCredentials = false;
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

async function runQuery(client, query, forwardError = false) {
  try {
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.log(err.message);
    if (!forwardError) {
      return err;
    }
    throw err;
  }
}

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

async function generateUserAccountData(client) {
  console.log('Start generating user_account fake data');
  let rowsCount = await readlineSync.question(
    'Type count of rows(default 1000): '
  );
  if (!rowsCount) {
    rowsCount = 1000;
  } else {
    rowsCount = parseInt(rowsCount, 10);
  }


  let values = '';
  let isLasQuery = false;
  for (let i = 0; i < rowsCount; i += 1) {
    values += `('${faker.internet.email()}', true),`;
    isLasQuery = false;
    if (i % 1000 === 0) {
      values = values.slice(0, -1);
      const query = `INSERT INTO user_account(email,email_confirmed) values ${values}`;
      console.log('Run query');
      await runQuery(client, query);
      values = '';
      isLasQuery = true;
    }
  }
  if (!isLasQuery) {
    values = values.slice(0, -1);
    const query = `INSERT INTO user_account(email,email_confirmed) values ${values}`;
    console.log('Run query');
    await runQuery(client, query);
  }
  return true;
}

async function createUserAccount(client) {
  console.log('Trying to create user_account table');
  const extensions = await getExtensions(client);
  if (!extensions.map(ext => (ext.extname)).includes('uuid-ossp')) {
    try {
      await runQuery(client, 'CREATE EXTENSION "uuid-ossp"', true);
    } catch (err) {
      console.log(
        `Can't create extension. Give ${config.user} SUPERUSER role
        or create extension uuid-ossp manually`
      );
      return false;
    }
  }
  if (tables.map(table => table.table_name).includes('user_account')) {
    const answer = await readlineSync.question(
      'Table user_account already exist, do you want to use it?(y/n): '
    );
    if (answer === 'y' || answer === 'yes') {
      return true;
    }
    return false;
  }
  const query =
    `
      CREATE TABLE user_account (
        id                     uuid NOT NULL DEFAULT uuid_generate_v1mc(),
        email                  character varying(256),
        email_confirmed        boolean NOT NULL DEFAULT false,
        password_hash          character varying(100),
        security_stamp         character varying(100),
        concurrency_stamp      uuid NOT NULL DEFAULT uuid_generate_v4(),
        phone_number           character varying(50),
        phone_number_confirmed boolean NOT NULL DEFAULT false,
        two_factor_enabled     boolean NOT NULL DEFAULT false,
        lockout_end            timestamp without time zone,
        lockout_enabled        boolean NOT NULL DEFAULT false,
        access_failed_count    smallint NOT NULL DEFAULT 0,
        -- Keys
        CONSTRAINT user_account_pkey PRIMARY KEY (id)
      )
    `;
  await runQuery(client, query);
  return true;
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
  if (await createUserAccount(client)) {
    await generateUserAccountData(client);
  }
  process.exit();
}

connect();
