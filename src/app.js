require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const {CLIENT_ORIGIN} = require('./config');
const EndpointsService = require('./endpoints-service')
const jsonParser = express.json()



const app = express();

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
app.use(morgan(morganOption));
app.use(helmet());

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