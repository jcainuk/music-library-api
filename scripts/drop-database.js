/* This is a script to DESTROY the project database.
This is very useful, because if you give the project to another person,
they can also easily initiate the project and create the exact same database
 on their side.
*/

// get the client. We require the mysql2 node package so node can connect to sql
const mysql = require('mysql2');

// This is a core node.js module just to deal with file paths
const path = require('path');

/* Below tells the dotenv library our environment filepath,
then it will retrieve all data we put in our .env.test file. */

require('dotenv').config({
  path: path.join(__dirname, '../.env.test'),
});

/* Below, thanks to the config of dotenv we set up earlier,
 we now have process.env available.

process.env is an object containing all environment variables we wrote in our .env file. */

const {
  DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT,
} = process.env;

/* Below we are connecting to our MySQL server with the credentials
 retrieved from the .env file. */

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
});

/* Below we have some error management, which is optional.

For this one, the query DROP DATABASE destroys the database.

We could also add an "IF EXISTS" at the end of the query. */

connection.query(`DROP DATABASE ${DB_NAME}`, () => connection.end());
