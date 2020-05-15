import { POST_EVENT } from "../../utils/values";

const twitchPosts = (event, name) => {
  switch (event) {
    case POST_EVENT.TWITCH_NEW_SUB:
      return postNewTwitchSub(name);
    case POST_EVENT.TWITCH_NEW_FOLLOW:
      return postNewTwitchFollow(name);
    case POST_EVENT.TWITCH_HOSTING:
      return postHosting(name);
    case POST_EVENT.END_OF_STREAM:
      return postEndOfStream();
    default:
      return;
  }
};

const postNewTwitchSub = name => {
  return `WE HAVE A SUBSCRIBER! Whoohoo! <3 Thanks for supporting our community ${name}! :D`;
};

const postNewTwitchFollow = name => {
  return `Welcome to the team ${name}! Awesome to have you join us! :D`;
};

const postHosting = name => {
  return `We are now hosting ${name}! Take this portal and join their chat :) twitch.tv/${name}`;
};

const postEndOfStream = () => {
  return `Goodbye, thanks for watching! :) Check the schedule for the next live stream, and don't forget to join the team Discord! https://discord.gg/eZtrhh7`;
};

/*const postFollows5 = () => {
  return;
};*/

export default twitchPosts;
