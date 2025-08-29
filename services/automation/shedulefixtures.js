// // Function for in-depth analysis and sending detailed posts
// async function performInDepthAnalysis() {
//     try {
//         const today = moment().startOf('day');
//         const nextWeek = moment().add(7, 'day').endOf('day');

//         const leagueName = "England - Premier League";
        
//         const events = await LeagueEvents.find(); // Fetch all events
//         const epl = events.filter(league => league.leagueName === leagueName && moment(league.leagueEventsData[0].starts).isBetween(today, nextWeek));

//         if (epl.length === 0) {
//             console.log(`No ${leagueName} events found for today or the next 7 days.`);
//             return;
//         }

//         let message = `⚽ *${leagueName} Match Probabilities*\n\n`;

//         epl.forEach(league => {
//             league.leagueEventsData.forEach(event => {
//                 const startTime = moment(event.starts).format('MMMM Do, h:mm A');
//                 message += `🏟️ *${event.home}* vs *${event.away}*\n`;
//                 message += `🕒 *Starts:* ${startTime}\n`;

//                 // Calculate win probabilities
//                 const probabilities = calculateWinProbabilities(event.periods);

//                 message += `🔮 *Probabilities:*\n`;
//                 message += `- Home Win: ${probabilities.home}%\n`;
//                 message += `- Draw: ${probabilities.draw}%\n`;
//                 message += `- Away Win: ${probabilities.away}%\n\n`;
//             });
//         });

//         console.log(message);
//         await sendTelegramMessage(message); // Send the message
//     } catch (error) {
//         console.error('Error performing in-depth analysis:', error.message);
//     }
// }


// async function sendTelegramMessage(message, retries = 5, delay = 1000) {
//     const BASE_URL = `https://api.telegram.org/bot${process.env.THEPITCHBASKET_BOT_API_KEY}/sendMessage`;
//     const parameters = {
//         chat_id: process.env.THEPITCHBASKET_CHAT_ID,
//         text: message,
//         parse_mode: "Markdown"
//     };

//     try {
//         const res = await axios.post(BASE_URL, parameters);
//         console.log('Message sent:', res.data);
//     } catch (error) {
//         if (error.response && error.response.status === 429 && retries > 0) {
//             const retryAfter = error.response.headers['retry-after'] ? parseInt(error.response.headers['retry-after']) * 1000 : delay;
//             console.log(`Rate limit hit, retrying in ${retryAfter / 1000} seconds...`);
//             await new Promise(res => setTimeout(res, retryAfter)); // Wait before retrying
//             return sendTelegramMessage(message, retries - 1, delay * 2); // Exponential backoff
//         } else {
//             console.error('Error sending message:', error.message);
//         }
//     }
// }

// // Function to schedule in-depth analysis
// const scheduleInDepthAnalysis = () => {
//     try {
//         console.log('Setting up cron job for in-depth analysis...');
//         // Run the analysis twice daily at 8 AM and 8 PM
//         cron.schedule('0 8,20 * * *', () => {
//             console.log('Running in-depth analysis...');
//             performInDepthAnalysis();
//         });
//     } catch (error) {
//         console.error('Error setting up cron job for in-depth analysis:', error);
//     }
// };

// export default scheduleInDepthAnalysis;
