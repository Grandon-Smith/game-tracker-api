require('dotenv').config();
const app = require('./app')
const knex = require('knex')
const { PORT, DATABASE_URL } = require('./config')
// const { Pool } = require('pg');


// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   },
//   "host": process.env.HOST,
//   "password": process.env.PASSWORD,
//   "max": 10,
//   "connectionTimeoutMillis": 20000,
//   "idleTimeoutMillis": 0,
// });

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})