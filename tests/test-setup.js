/* This is just some configuration to make sure the test will refer to
 the .env.test file. */

const dotenv = require('dotenv');

dotenv.config({ path: './.env.test' });
