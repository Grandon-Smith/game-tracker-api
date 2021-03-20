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
  client: 'postgres',
  connection: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  searchPath: ['knex', 'public'],
  pool: { min: 0, max: 10 },
  log: {
    warn(message) {
    },
    error(message) {
    },
    deprecate(message) {
    },
    debug(message) {
    },
  }
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})