// var params = { screen_name: 'nodejs' }
// twitterClient.get('statuses/user_timeline', params, function(
//   error,
//   tweets,
//   response
// ) {
//   if (!error) {
//     console.log(tweets)
//   }
// })

// twitterClient.post('statuses/update', { status: `BeastieBot is rawring because we are LIVE! rawr https://www.twitch.tv/teamTALIMA#stream-${streamId} #teamTALIMA #GameDev #WebDev` }, function (error, tweet, response) {
//   if (error) throw error;
//   console.log(tweet);  // Tweet body.
//   console.log(response);  // Raw response object.
// });

// let streamId = +fs.readFileSync(path.join(__dirname, `../../../data/stream-id`), { encoding: "utf8" });
// setInterval(async () => {
//   const streamData = await api.fetch(`streams/${broadcaster.id}`).catch(() => ({ stream: null }));
//   if (streamData.stream !== null) {
//     if (streamData.stream._id !== streamId) {
//       streamId = streamData.stream._id;
//       fs.writeFileSync(path.join(__dirname, `../../../data/stream-id`), streamId, { encoding: "utf8" });

//       if (twitterClient !== null) {
//         twitterClient.post('statuses/update', {
//           status: `BeastieBot is rawring because we are LIVE! rawr https://www.twitch.tv/teamTALIMA#stream-${streamId} #teamTALIMA #GameDev #WebDev`
//         }, function (error, tweet, response) {
//           if (error) throw error;
//           console.log(tweet);  // Tweet body
//         });
//       }
