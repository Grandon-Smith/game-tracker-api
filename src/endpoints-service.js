const EndpointsService = {
    getAllUsers(knex) {
        return knex.select('*').from('game_tracker_users')
    },
    getUserById(knex, email, password) {
        return knex 
            .from('game_tracker_users')
            .select('*')
            .where('email', email)
            .where('password', password)
            .first()
    },
    createNewUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('game_tracker_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getUserGames(knex, email) {
        return knex
            .from('game_tracker_games')
            .select('*')
            .where('email', email)
            // .first()
    },
    createUserGame(knex, game) {
        return knex
            .insert(game)
            .into('game_tracker_games')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = EndpointsService