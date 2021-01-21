CREATE TABLE game_tracker_games (
    email TEXT REFERENCES game_tracker_users(email) NOT NULL,
    gameID INTEGER NOT NULL
)