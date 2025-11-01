-- create driver table
CREATE TABLE driver (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    license_number VARCHAR(50),
    age INT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- create trip table
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL REFERENCES driver(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    avg_speed FLOAT,
    distance FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- create driving_data table
CREATE TABLE driving_data (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    speed FLOAT,
    acceleration FLOAT
);
-- create score table
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    trip_id INT UNIQUE REFERENCES trips(id) ON DELETE CASCADE,
    overall_score INT,
    speed_score INT,
    braking_score INT,
    acceleration_score INT
);