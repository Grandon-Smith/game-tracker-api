require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
// const {CLIENT_ORIGIN} = require('./config');
const EndpointsService = require('./endpoints-service')
const jsonParser = express.json()
const emailExistence = require('email-existence')


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
    console.log("---------------------------STARTING POST------------------")
    const knexInstance = req.app.get('db')
    const { email, gameid } = req.body;
    const game = {email, gameid}
    EndpointsService.createUserGame(knexInstance, game)
        .then(game => {
            if(!game) {
                console.log('error')
                res.send('error')
            }
            res.send('good')
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
    const { email, password } = req.body;
    console.log(email)
    emailExistence.check( email, function(error, response){
        if(response === true) {
            console.log('res: ' + response)
            const role = 'user'
            const newUser = {email, role, password};
            EndpointsService.createNewUser(knexInstance, newUser)
                .then(user => {
                    return res
                        .status(201)
                        .json(user)
                })
                .catch(next)
        } else if (response === false){
            console.log('res: ' + response)
            res
                .status(200)
                .json({
                    status: response,
                    errorMessage: "It looks like that isn\'t a valid email address, please check that it is correct and try again."
                })
        } else if (error) {
            console.log('res: ' + response)
            res
                .status(500)
                .json({errorMessage: error})
        }
    });
    
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