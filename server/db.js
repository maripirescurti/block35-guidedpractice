// imports
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_talent_agency_db');

// methods
const createTables = async() => {
  const SQL = `
    DROP TABLE IF EXISTS user_skills;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS skills;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255)
    );
    CREATE TABLE skills(
      id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );
    CREATE TABLE user_skills(
      id UUID PRIMARY KEY,
      skill_id UUID REFERENCES skills(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      CONSTRAINT unique_skill_user UNIQUE (skill_id, user_id)
    );
  `;
  await client.query(SQL);
}

// exports
module.exports = {
  client,
  createTables
};