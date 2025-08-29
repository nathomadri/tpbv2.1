// utils/telegram.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Function to send a message via Telegram API
export async function sendTelegramMessage(message) {
    const BASE_URL = `https://api.telegram.org/bot${process.env.THEPITCHBASKET_BOT_API_KEY}/sendMessage`;
    const parameters = {
        chat_id: process.env.THEPITCHBASKET_CHAT_ID,
        text: message,
        parse_mode: "Markdown"
    };

    try {
        const res = await axios.post(BASE_URL, parameters);
        console.log('Message sent:', res.data);
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
}



// Function to send a message with an image via Telegram API
export async function sendTelegramImageMessage(message, imageUrl) {
    const BASE_URL = `https://api.telegram.org/bot${process.env.THEPITCHBASKET_BOT_API_KEY}/sendPhoto`;
    const parameters = {
        chat_id: process.env.THEPITCHBASKET_CHAT_ID,
        caption: message,
        photo: imageUrl,
        parse_mode: "Markdown"
    };

    try {
        const res = await axios.post(BASE_URL, parameters);
        console.log('Message with image sent:', res.data);
    } catch (error) {
        console.error('Error sending message with image:', error.message);
    }
}
