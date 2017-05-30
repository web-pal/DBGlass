import faker from 'faker';

import { checkTable, runQuery } from './utils';

const readlineSync = require('readline-sync');


export default async function createUserAccount(client, companyIds, tables) {
  const createSchema = await checkTable(client, 'user_account', tables);
  if (createSchema) {
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
          company_id             integer null references company(id),
          -- Keys
          CONSTRAINT user_account_pkey PRIMARY KEY (id)
        )
      `;
    await runQuery(client, query);
  }

  let rowsCount = await readlineSync.question(
    'Type count of rows(default 1000): '
  );
  if (!rowsCount) {
    rowsCount = 1000;
  } else {
    rowsCount = parseInt(rowsCount, 10);
  }


  let values = '';
  let isLastQuery = false;
  for (let i = 0; i < rowsCount; i += 1) {
    const companyId = companyIds[i] ? companyIds[i] : 'null';
    values += `('${faker.internet.email()}', true, ${companyId}),`;
    isLastQuery = false;
    if (i % 1000 === 0) {
      values = values.slice(0, -1);
      const query = `INSERT INTO user_account(email,email_confirmed,company_id) values ${values}`;
      await runQuery(client, query);
      values = '';
      isLastQuery = true;
    }
  }
  if (!isLastQuery) {
    values = values.slice(0, -1);
    const query = `INSERT INTO user_account(email,email_confirmed,company_id) values ${values}`;
    await runQuery(client, query);
  }
}
