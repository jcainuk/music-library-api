/* This is a script to CREATE the project database.
This is very useful, because if you give the project to another person,
they can also easily initiate the project and create the exact same database
 on their side.
*/

// get the client. We require the mysql2 node package so node can connect to sql
const mysql = require('mysql2');
const path = require('path');

/* Below, we retrieve the arguments that we can pass to the command line when launching the script.
For example, if we launch node create-database.js, args will contain nothing.

For example, if we launch node create-database.js test, args will contain "test".

In this last case, if we summarise the code:

- process.argv contains an array with the node reference, the script reference,
 and the args, like ["/usr/local/bin/node", "./create-database", "test"]
- process.argv.slice(2) contains an array with only the args, like ["test"]
- process.argv.slice(2)[0] contains the string "test".
 */

const args = process.argv.slice(2)[0];

/* Below we have the ternary operator, it's an equivalent of an if / else.

If the args variable is equal to "test", then it will assign "../.env.test" to the variable
 envFile. Else, it will assign "../.env" to the variable envFile.

Therefore, we can use different environment files, with different environment
variables, and easily switch between those environment files when we launch our script.

E.g. we could, later on, add some other environment files like "dev", "preproduction",
"production",
and after some update of this script you would be able to launch it like:
node create-database.js production. */

const envFile = args === 'test' ? '../.env.test' : '../.env';

/* Below, we could have written:

const dotenv = require('dotenv');
const envFilePath = path.join(__dirname, envFile);
const dotenvConfig = { path: envFilePath }:
dotenv.config(dotenvConfig);

It is basically to tell the dotenv library our environment filepath,
then it will retrieve all data we put in our .env file. */

require('dotenv').config({
  path: path.join(__dirname, envFile),
});

/* Below, thanks to the config of dotenv we set up earlier, we now have process.env available.

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

/* With the connection we just created before we can access our MySQL server.
We can launch any query with connection.query() function.

In this case, the query CREATE DATABASE IF NOT EXISTS is straight forward,
 it will create the database only if it does not already exist.

 */

connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
  if (err) {
    console.log('Your environment variables might be wrong. Please double check .env file');
    console.log('Environment Variables are:', {
      DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT,
    });
    console.log(err);
  }
  connection.close();
});
