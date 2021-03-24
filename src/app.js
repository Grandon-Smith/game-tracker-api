require('dotenv').config();
const express = require('express');
const knex = require('knex')
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const EndpointsService = require('./endpoints-service')
const jsonParser = express.json();
const { PORT, DATABASE_URL } = require('./config')
const bcrypt = require('bcrypt')



const app = express();

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(cors());

app.set('view-engine', 'react')
app.use(express.urlencoded({extended: false}))
app.use(morgan(morganOption));
app.use(helmet());

const db = knex({
  client: 'postgres',
  connection: DATABASE_URL,
  ssl: true,
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

app.delete('/removegame', jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const { email, gameid } = req.body;
    EndpointsService.removeUserGame(knexInstance, email, gameid)
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})

app.post('/addgame', jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const { email, gameid } = req.body;
    const game = {email, gameid}
    EndpointsService.createUserGame(knexInstance, game)
        .then(game => {
            if(!game) {
                console.log('error')
                res.json({message: 'error'})
            }
            res.json({message: 'good'})
        })
        .catch(next)
})

app.post('/usergames', jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const { email } = req.body
    EndpointsService.getUserGames(knexInstance, email)
        .then(games => {
            if(!games) {
                res.status(204).json({
                    error: { message: `Uh oh. Your games are gone!` }
                })
            }
            console.log(games)
            res.json(games)
        })
        .catch(next)
})

app.post('/create-account', jsonParser, async (req, res, next) => {
        const knexInstance = req.app.get('db')
        let { username, email, password } = req.body;
        console.log(username, email, password)
        try {
            const salt = await bcrypt.genSalt(8)
            password = await bcrypt.hash(password, salt)
            console.log(salt)
            console.log(password)
            const role = 'user'
            const newUser = {username, email, role, password};
            EndpointsService.createNewUser(knexInstance, newUser)
                .then(user => {
                    return res
                        .status(201)
                        .json(user)
                })
                .catch()

        } catch {
            console.log('ERROR')
            return res
                .status(500)
                .json({errorMessage: 'Internal error'})
                .end()
        }
})

app.post('/login', jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const {email, password} = req.body;

    EndpointsService.getUserById(knexInstance, email, password)
        .then(user => {
            if(!user) {
                res
                    .status(204)
                    .json({error: "User not found."})
                    .end()
            }
            res
                .status(200)
                .json({user: user})
                .end()
        })
        .catch(next)
})

app.get('/users', (req, res, next) => {
    const knexInstance = req.app.get('db')
    EndpointsService.getAllUsers(knexInstance)
        .then(users =>
            res.json(users)
        )
        .catch(next)
})

app.get('/users', (req, res, next) => {
    const knexInstance = db
    EndpointsService.getAllUsers(knexInstance)
        .then(users =>
            res.json(users)
        )
        .catch(next)
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { message: error.message,
        other: 'error here'
    }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    .catch(next)
});

module.exports = app;