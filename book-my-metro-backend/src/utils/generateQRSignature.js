import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const generateQRSignature = (ticketId, sourceId, destinationId) => {

    try {
        const rawData = `${ticketId}|${sourceId}|${destinationId}`;
        const secret = process.env.QR_SECRET;
        
        return crypto
            .createHmac('sha256', secret)
            .update(rawData)
            .digest('hex');
    } catch (error) {
    console.error("Error generating QR signature:", error);
    throw new Error("Failed to generate QR signature");
    }

};

export { generateQRSignature };