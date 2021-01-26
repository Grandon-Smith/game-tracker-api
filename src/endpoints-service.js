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
    getUserGames(knex, email) {
        return knex
            .from('game_tracker_games')
            .select('*')
            .where('email', email)
            .first()
    }
}

module.exports = EndpointsService