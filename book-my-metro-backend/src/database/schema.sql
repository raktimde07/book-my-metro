-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS station_routes CASCADE;
DROP TABLE IF EXISTS stations CASCADE;
DROP TABLE IF EXISTS lines CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_passwords CASCADE;
DROP TABLE IF EXISTS user_social_links CASCADE; 

-----------------*************-----------------
--STATION AND LINE SCHEMA
-----------------*************-----------------

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

-----------------*************-----------------
--USER AND AUTH SCHEMA
-----------------*************-----------------

--  If an user doesn't have a password in our system say they signed up with Google or any other OAuth provider, 
--  then we can just not have an entry for them in the user_passwords table.
--  We cannot store a "fake" or "random" password. 
--  That would be a security risk and technically dishonest to our schema.
--
--  Instead we separate the Identity from the Credential.
--     1. users table: Only stores id, name, email, phone. (No password here)
--     2. user_passwords table: Stores user_id and password_hash.
--     3. user_social_links table: Stores user_id, provider (Google), and provider_id.
--
--  This allows a user to "Link" accounts. A user could sign up with a password today, 
--  and link their Google account tomorrow.
--  Both "keys" would point to the same User ID.
--
-- Create Users table 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Create passwords table
CREATE TABLE user_passwords (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL
);  

--Create social links table
CREATE TABLE user_social_links (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    UNIQUE(provider, provider_id)
);

-----------------*************-----------------
--BOOKING SCHEMA
-----------------*************-----------------
