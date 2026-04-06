import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {

    try{
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                status: 'fail',
                message: 'Authorization token missing or malformed' 
            });
        }
        
        // Extract the token from the header (removing the "Bearer " prefix)
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object for use in subsequent middleware or route handlers
        req.user = decoded;

        next(); // Proceed to the next middleware or route handler
    } 
    catch (error) {
        return res.status(401).json({ 
            status: 'fail',
            message: 'Invalid or expired token' 
        });
    }

};

export {authMiddleware};