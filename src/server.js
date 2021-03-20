require('dotenv').config();
const app = require('./app')
const knex = require('knex')
const { PORT, DATABASE_URL } = require('./config')


const db = knex({
  client: 'postgres',
  connection: DATABASE_URL,
  searchPath: ['knex', 'public'],
  ssl: true,
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