-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS station_routes CASCADE;
DROP TABLE IF EXISTS stations CASCADE;
DROP TABLE IF EXISTS lines CASCADE;

-- Create the Lines table
CREATE TABLE lines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(20) NOT NULL
);

-- Create the Stations table
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    is_interchange BOOLEAN DEFAULT false
);

-- Create the Mapping table
CREATE TABLE station_routes (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id),
    line_id INTEGER REFERENCES lines(id),
    sequence_number INTEGER NOT NULL,
    UNIQUE(line_id, sequence_number)
);