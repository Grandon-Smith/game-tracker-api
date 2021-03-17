require('dotenv').config();
const app = require('./app')
const knex = require('knex')
const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.set('db', db)



app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})