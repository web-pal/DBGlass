import faker from 'faker';

import { checkTable, runQuery } from './utils';

const readlineSync = require('readline-sync');


function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

export default async function createCompany(client, tables) {
  const createSchema = await checkTable(client, 'company', tables);
  if (createSchema) {
    const query =
      `
        CREATE TABLE company (
          id                    serial primary key,
          name                  character varying(256),
          is_active             boolean NOT NULL DEFAULT true
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


  let ids = [];
  let values = '';
  let isLastQuery = false;
  for (let i = 0; i < rowsCount; i += 1) {
    values += `('${replaceAll(faker.company.companyName(), "'", "''")}'),`;
    isLastQuery = false;
    if (i % 1000 === 0) {
      values = values.slice(0, -1);
      const query = `INSERT INTO company(name) values ${values} RETURNING id`;
      let newIds = await runQuery(client, query);
      newIds = newIds.map(i => i.id);
      ids = ids.concat(ids, newIds);
      values = '';
      isLastQuery = true;
    }
  }
  if (!isLastQuery) {
    values = values.slice(0, -1);
    const query = `INSERT INTO company(name) values ${values} RETURNING id`;
    let newIds = await runQuery(client, query);
    newIds = newIds.map(i => i.id);
    ids = ids.concat(ids, newIds);
  }
  return ids;
}
