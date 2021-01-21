CREATE TABLE game_tracker_users (
    email TEXT PRIMARY KEY AS IDENTITY UNIQUE NOT NULL,
    password TEXT NOT NULL,
)