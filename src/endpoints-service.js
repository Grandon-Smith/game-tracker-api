const EndpointsService = {
    getAllUsers(knex) {
        return knex.select('*').from('public.game_tracker_users')
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
    },
    createUserGame(knex, game) {
        return knex
            .insert(game)
            .into('game_tracker_games')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    removeUserGame(knex, email, gameid) {
        return knex
            .from('game_tracker_games')
            .where('email', email)
            .where('gameid', gameid)
            .delete()
    }
}

module.exports = EndpointsService