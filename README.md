# BeastieBot V3

The New Beastie is here!

**Has:**

- Tmi client for Twitch (library to be replaced)
- Webhooks server subscribed and listening to Twitch (library to be replaced, DIFFICULT)
- Twitter client (library to be replaced)
- Database connection for storing community currency (AWS DynamoDB)
- [Yup](https://github.com/jquense/yup) for environment variable validation.
- [Prettier](https://prettier.io/) for code automagic code formatting.

**Setting up the development environment**:

- bot acc = account you want the bot to use when chatting
- broadcast acc = account you use when you stream

0. Copy .env.example to .env
1. Create a twitch account for your bot, if you do not want it to use your broadcaster acc.
1. Go to https://dev.twitch.tv/console/apps and create a new application.
1. Set Name to whatever you want to call your bot, OAuth redirect to `http://localhost` and category to "Chat bot".
1. Copy your Client ID and Client Secret into the corresponding fields in the .env
1. Go to https://twitchapps.com/tmi and generate an oauth for your bot acc.
1. Set the username and oauth of the bot acc in `BEASTIE_USERNAME` and `BEASTIE_OAUTH` without the `oauth:` respectively.
1. Replace `<YourClientId>` with your Client Id and follow the link in your browser to create a token for your broadcasting acc
   ```
   https://id.twitch.tv/oauth2/authorize?client_id=<YourClientId>&redirect_uri=http://localhost&response_type=token&scope=chat:read+chat:edit+channel:moderate+whispers:read+whispers:edit+channel_editor
   ```
1. Copy the token from the redirect url after you have authorized and paste into `BROADCASTER_OAUTH` along with your username in the `BROADCASTER_USERNAME` field.
1. Go to https://discord.com/developers/applications and create a new application
1. Go to Bot and click "Add Bot" and copy the token into the `DISCORD_TOKEN` field.
1. Go to OAuth2 and set redirect url to `http://localhost` and scope to `bot`.
1. Set the permissions as needed (admin is most practical for dev). Copy the URL under `scopes` and add the bot to your server
1. Go to General Information and grab the client id and secret and add them to your .env
1. Set `DISCORD_GUILD_NAME` to the name of the server you want the bot to run in.
1. Set `DISCORD_WELCOME_CHANNEL`to name of the channel you want the bot to welcome people in
1. Set `DISCORD_FEED_CHANNEL` to the channel you want to use for having the bot post messages to twitter
1. Set `DISCORD_GUILD_MASTER_ID` to your discord Id
1. Run yarn install in the root folder, if you do not have yarn installed you can run npm install followed by yarn install
   0 You are set up and ready to start developing!

**Setting up dynamoDB to run locally:**

- Follow the guide for installation here - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html

**Usage:**

Start development: `yarn watch`

Build for production `yarn build`

**Future:**

- Clean project of base template packages/scripts/files
- Refactor project structure by feature
- Enable Twitter client to post when broadcaster stream state changes to 'live'
- Add !livestream/!uptime command to display stream data
- Edit Discord interval to link to discord server
- Add Discord client to post when broadcaster stream state change to 'live'

- Add create database script for developers
- Restart Beastie automatically on shut down

- Add Raid System/Features
- Create markdown file with full feature list
