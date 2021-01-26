require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
// const {CLIENT_ORIGIN} = require('./config');
const EndpointsService = require('./endpoints-service')
const jsonParser = express.json()

const app = express();

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(
    cors()
    // cors({
    //     origin: CLIENT_ORIGIN
    // })
);
app.use(express.urlencoded({extended: false}))
app.use(morgan(morganOption));
app.use(helmet());


app.get('/usergames', jsonParser, (req, res, next) => {
    res.status(200).json(req.body)
    // const knexInstance = req.app.get('db')
    // const { email } = req.body
    // EndpointsService.getUserGames(knexInstance, email)
    //     .then(games => {
    //         if(!games) {
    //             res.status(203).json({
    //                 error: { message: `Uh oh. Your games are gone!` }
    //             })
    //         }
    //         res.json(games)
    //     })
    //     .catch(next)
})

app.post('/login', jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const {email, password} = req.body;
    EndpointsService.getUserById(knexInstance, email, password)
        .then(user => {
            if(!user) {
                res.status(400)
            }
            res.status(200)
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

app.get('/', (req, res) => {
    res.send('Hello, world!')
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
});

module.exports = app;