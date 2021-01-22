const EndpointsService = {
    getAllUsers(knex) {
        return knex.select('*').from('game_tracker_users')
    },
}

module.exports = EndpointsService