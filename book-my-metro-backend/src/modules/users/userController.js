import { pool } from '../../config/database.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Placeholder for user-related operations (e.g., registration, login, profile management)

//Register User
const registerUser = async (req, res) => {
    // Implement user registration logic here

    let client;

    try{
        //As of now phone number is optional, we can set it to null if not provided
        const { name, email, phone = null, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                status: 'fail',
                message: 'Please provide name, email, and password' 
            });
        }

        client = await pool.connect();

        await client.query('BEGIN'); // Start transaction

        // Hash the password and store the user in the database
        const hashedPassword = await bcryptjs.hash(password, 10);

        //Insert data in users table
        await client.query(
            'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3)',
            [name, email, phone]
        );

        //Insert data in user_passwords table
        await client.query(
            'INSERT INTO user_passwords (user_id, password_hash) VALUES ((SELECT id FROM users WHERE email = $1), $2)',
            [email, hashedPassword]
        );

        await client.query('COMMIT'); // Commit transaction

        return res.status(201).json({
                status: 'success',
                message: 'User registered successfully'
            }
        );

    }
    catch (error) {

        //Check if client is available before trying to rollback and then rollback
        if (client) await client.query('ROLLBACK');
        
        //Check if the error is due to duplicate email or phone number (unique constraint violation)
        if (error.code === '23505') {
            return res.status(409).json({
                status: 'fail',
                message:  'User already exists'
            });
        }

        //Log the error for debugging purposes and return a generic error message to the client
        console.error('Error occurred while registering user:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to register user'
        });

    } 
    finally {
        if (client) {
            client.release();
        }
    }
};

const loginUser = async (req, res) => {
    // Implement user login logic here

    let client;
    
    try {
        const { email, password } = req.body;
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                status: 'fail',
                message: 'Please provide email and password' 
            });
        }

        client = await pool.connect();

        // Fetch the user from the database based on the provided email
        const userQuery = `
            SELECT u.id, u.name, u.email, up.password_hash 
            FROM users u
            JOIN user_passwords up ON u.id = up.user_id
            WHERE u.email = $1
        `;
        const result = await client.query(userQuery, [email]);

        //Check if user exists with the provided email, if not return an error response
        if (result.rowCount === 0) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password'
            });
        }

        const user = result.rows[0];

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid password'
            });
        }
        // If the password is valid, generate a JWT token for authentication
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return a success message, the jwt token, and user details (excluding the password) in the response
        return res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            token,
            data : {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } 
    catch (error) {
        console.error('Error occurred while logging in user:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to log in user'
        });
    } finally {
        if (client) {
            client.release();
        }
    }
};

export { registerUser, loginUser }; 