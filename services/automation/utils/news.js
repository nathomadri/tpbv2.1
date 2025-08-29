import axios from 'axios';

// Function to fetch football news and send it to Telegram
async function sendFootballNews() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // Date object for 12 hours ago

    const options = {
        method: 'GET',
        url: 'https://football-news11.p.rapidapi.com/api/news-by-date',
        params: {
            date: currentDate,
            lang: 'en',
            page: '1'
        },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'football-news11.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const newsList = response?.data?.result || []; // Get all news items

        // Filter news items based on time part of 'published_at'
        const recentNews = newsList.filter(news => {
            const [datePart, timePart] = news.published_at.split(' '); // Split date and time
            const newsTime = new Date(`${currentDate}T${timePart}`); // Create Date object with today's date and news time

            return newsTime >= twelveHoursAgo;
        });

        if (recentNews.length > 0) {
            for (const news of recentNews) {
                // Check the categories[0] and assign flags
                let categoryFlag = '';
                if (news.categories && news.categories[0] === 4) {
                    categoryFlag = '📢 *General News*';
                } else if (news.categories && news.categories[0] === 3) {
                    categoryFlag = '🔁 *Transfers*';
                } else if (news.categories && news.categories[0] === 5) {
                    categoryFlag = '📝 *Match Previews*';
                } else if (news.categories && news.categories[0] === 6) {
                    categoryFlag = '🌟 *Featured*';
                } else if (news.categories && news.categories[0] === 7) {
                    categoryFlag = '🌍 *Internationals*';
                }

                // Prepare the caption message with title and link
                const caption = `\n\n\n${categoryFlag}\n\n\n📰 *${news.title}*\n\n\n🌐 [Read More 👉](${news.original_url})\n\n`;

                // Send the image first, then the caption
                await sendTelegramPhoto(news.image, caption);
                
                await delay(60000); // Delay for 60 seconds between posts
            }
            console.log(`${recentNews.length} news posts sent successfully.`);
        } else {
            console.log('No recent news found.');
        }

    } catch (error) {
        console.error('Error fetching or sending football news:', error.message);
    }
}

// Function to send a photo with a caption via Telegram API
async function sendTelegramPhoto(photoUrl, caption, retries = 5, delay = 1000) {
    const BASE_URL = `https://api.telegram.org/bot${process.env.THEPITCHBASKET_BOT_API_KEY}/sendPhoto`;
    const parameters = {
        chat_id: process.env.THEPITCHBASKET_CHAT_ID,
        photo: photoUrl,
        caption: caption,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
    };

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            await axios.post(BASE_URL, parameters);
            console.log('Photo sent successfully.');
            return;
        } catch (error) {
            console.error(`Failed to send photo. Attempt ${attempt + 1} of ${retries}. Error: ${error.message}`);
            if (attempt < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }

    console.error('Failed to send photo after multiple attempts.');
}

// Delay function to add pause between posts
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export the sendFootballNews function to be called whenever you want to post news to Telegram
export { sendFootballNews };
