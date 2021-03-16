require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const EndpointsService = require('./endpoints-service')
const jsonParser = express.json()
const validator = require("email-validator");


const app = express();

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(cors());

app.set('view-engine', 'react')
app.use(express.urlencoded({extended: false}))
app.use(morgan(morganOption));
app.use(helmet());


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
    console.log(email)
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

app.post('/create-account', jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const { username, email, password } = req.body;
    let response = validator.validate(email.trim())

    if(response === true) {
        console.log('TRUE')
        const role = 'user'
        const newUser = {username, email, role, password};
        EndpointsService.createNewUser(knexInstance, newUser)
            .then(user => {
                return res
                    .status(201)
                    .json(user)
            })
            .catch(next)
    } else if (response === false){
        console.log('FALSE')
        return res
            .status(200)
            .json({
                errorMessage: "It looks like that isn\'t a valid email address, please check that it is correct and try again."
            })
    } else {
        console.log('ERROR')
        return res
            .status(500)
            .json({errorMessage: 'Internal error'})
    };
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