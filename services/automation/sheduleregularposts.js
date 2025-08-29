// import cron from 'node-cron';
// import moment from 'moment';
// import LeagueEvents from '../../models/betgreen/sportsbook/events/LeagueEvents.js';
// import { sendTelegramMessage, sendTelegramImageMessage } from './utils/telegram.js';

// // Function to generate and post content every 4 hours
// async function generateRegularPosts() {
//     try {
//         const lastFourHours = moment().subtract(4, 'hours').startOf('hour');
//         const now = moment().startOf('hour');

//         const leagueName = ["England - Premier League"];

//         const events = await LeagueEvents.find(); // Fetch all events
//         const epl = events.filter(league => leagueName.includes(league.leagueName) && moment(league.leagueEventsData[0].starts).isBetween(lastFourHours, now));

//         if (epl.length === 0) {
//             console.log(`No ${leagueName} events found in the last 4 hours.`);
//             // return;
//         }

//         let message = `⚽ *${leagueName} Recent Matches*\n\n`;

//         epl.forEach(league => {
//             league.leagueEventsData.forEach(event => {
//                 const startTime = moment(event.starts).format('MMMM Do, h:mm A');
//                 message += `🏟️ *${event.home}* vs *${event.away}*\n`;
//                 message += `🕒 *Started at:* ${startTime}\n`;
//                 message += `🔥 *Stay tuned for more action-packed updates!*\n\n`;
//             });
//         });

//         message += `🎉 *ThePitchBasket* brings you the thrill of the game, just like the best in the business!*\n`;
//         message += `⚡ *With ThePitchBasket, you're always in the game!*\n\n`;
//         message += `👉 *Bet smart, play hard, and experience the best of Premier League action, just like Betika and Pinnacle!*\n`;
//         message += `🎯 *Your winning moment is just a click away!*\n`;


//         const imageUrl = 'https://your-image-url-here.jpg';
//         await sendTelegramMessage(message);
//         await sendTelegramImageMessage(message, imageUrl);
//     } catch (error) {
//         console.error('Error generating regular posts:', error.message);
//     }
// }

// // Function to schedule the regular posts
// const scheduleRegularPosts = () => {
//     try {
//         console.log('Setting up cron job for regular posts...');
//         generateRegularPosts();
//         // Run the post generation every 4 hours
//         cron.schedule('0 */4 * * *', () => {
//             console.log('Generating regular post...');
//             generateRegularPosts();
//         });
//     } catch (error) {
//         console.error('Error setting up cron job for regular posts:', error);
//     }
// };

// export default scheduleRegularPosts;
