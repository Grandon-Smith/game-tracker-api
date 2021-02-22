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

app.set('view-engine', 'react')
app.use(express.urlencoded({extended: false}))
app.use(morgan(morganOption));
app.use(helmet());

app.post('/addgame', jsonParser, (req, res, next) => {
    console.log("---------------------------STARTING POST------------------")
    const knexInstance = req.app.get('db')
    const { email, gameid } = req.body;
    // console.log(email, gameid)
    const game = {email, gameid}
    console.log(game)
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
    const role = 'user'
    const newUser = {email, role, password};
    EndpointsService.createNewUser(knexInstance, newUser)
        .then(user => {
            return res.redirect(201, '/login')
        })
        .catch(next)
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