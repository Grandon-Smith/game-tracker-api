CREATE TABLE game_tracker_games (
    email TEXT REFERENCES game_tracker_users(email) NOT NULL,
    gameid INT NOT NULL UNIQUE
);