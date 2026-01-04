const axios = require('axios');

const EMOTION_SERVICE_URL = process.env.EMOTION_SERVICE_URL || 'http://localhost:5000';

/**
 * Detect emotion from base64 image
 * @param {string} imageBase64 - Base64 encoded image
 * @returns {Promise} - Emotion detection results
 */
const detectEmotion = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Forward request to Python emotion detection service
        const response = await axios.post(`${EMOTION_SERVICE_URL}/detect_emotion`, {
            image: image
        }, {
            timeout: 10000 // 10 second timeout
        });

        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Error in emotion detection:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                error: 'Emotion detection service is not running. Please start the Python service.' 
            });
        }

        return res.status(500).json({ 
            error: 'Failed to detect emotion',
            details: error.message 
        });
    }
};

/**
 * Check if emotion detection service is healthy
 */
const checkEmotionServiceHealth = async (req, res) => {
    try {
        const response = await axios.get(`${EMOTION_SERVICE_URL}/health`, {
            timeout: 5000
        });

        return res.status(200).json({
            service: 'emotion-detection',
            ...response.data
        });

    } catch (error) {
        return res.status(503).json({
            service: 'emotion-detection',
            status: 'unavailable',
            error: error.message
        });
    }
};

module.exports = {
    detectEmotion,
    checkEmotionServiceHealth
};
