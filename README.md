# BeastieBot V3

The New Beastie is here!

**Has:**

- Tmi client for Twitch (library to be replaced)
- Webhooks server subscribed and listening to Twitch (library to be replaced, DIFFICULT)
- Twitter client (library to be replaced)
- Database connection for storing community currency (AWS DynamoDB)
- [Yup](https://github.com/jquense/yup) for environment variable validation.
- [Prettier](https://prettier.io/) for code automagic code formatting.

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
