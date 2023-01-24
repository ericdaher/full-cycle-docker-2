const express = require('express');
const app = express();
const port = 8080;
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};
const mysql = require('mysql');

async function insertRandomName() {
  const possibleNames = ['Eric', 'João', 'Ricardo', 'Angela', 'Julia', 'Rafael', 'Marcela', 'Bianca'];
  const insertQuery = `INSERT INTO people(name) values('${possibleNames[Math.floor(Math.random() * possibleNames.length)]}')`;
  const connection =  await mysql.createConnection(config);
  await connection.query(insertQuery);
  await connection.end();
}

function selectQuery(connection) {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT name FROM people`;
    connection.query(selectSql, (err, result) => {
      if (err) { return reject(err); }
      resolve(result);
    })
  })
}

async function getNames() {
  const connection =  await mysql.createConnection(config);
  const result = await selectQuery(connection);
  await connection.end();

  return result.map(item => item.name);
}

function namesList(names) {
  const namesListHtml = names.map(name => `<li>${name}</li>`).join('');
  return `<ul>${namesListHtml}</ul>`;
}

app.get('/', async (req, res) => {
  await insertRandomName();
  const names = await getNames();
  res.send(`<h1>Full Cycle Rocks!</h1>${namesList(names)}`);
});

app.listen(port, () => {
  console.log('Rodando na porta ' + port);
});
