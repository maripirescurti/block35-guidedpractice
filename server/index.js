// imports
const { client } = require('pg');

// init function
const init = async() => {
  await client.connect();
  console.log('connected to database');
};

init ();