CREATE TABLE game_tracker_games (
    email TEXT PRIMARY KEY REFERENCES game_tracker_users(email) NOT NULL,
    gameID BIGINT NOT NULL
);