const readlineSync = require('readline-sync');

async function dropTable(client, tableName) {
  const query = `DROP TABLE ${tableName} CASCADE`;
  return await runQuery(client, query);
}

async function checkIfEmpty(client, tableName) {
  const query =
    `SELECT * from ${tableName} limit 1`;

  const result = await runQuery(client, query);
  return result.length;
}

async function askAboutTruncate(client, tableName) {
  const answer = await readlineSync.question(
    `Table ${tableName} is not empty, do you want truncate it?(y/n): `
  );
  if (answer === 'y' || answer === 'yes' || !answer.length) {
    const query = `TRUNCATE ${tableName} CASCADE`;
    await runQuery(client, query);
  }
}

export async function runQuery(client, query, forwardError = false) {
  try {
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.log('----------');
    console.log(err.message);
    console.log('----------');
    if (!forwardError) {
      return err;
    }
    throw err;
  }
}

export async function checkTable(client, tableName, tables) {
  if (tables.map(table => table.table_name).includes(tableName)) {
    const answer = await readlineSync.question(
      `Table ${tableName} already exist, do you want drop it?(y/n): `
    );
    if (answer === 'y' || answer === 'yes' || !answer.length) {
      await dropTable(client, tableName);
      return true;
    }
    const isEmpty = await checkIfEmpty(client, tableName);
    if (!isEmpty) {
      await askAboutTruncate(client, tableName);
    }
    return false;
  }
  return true;
}
