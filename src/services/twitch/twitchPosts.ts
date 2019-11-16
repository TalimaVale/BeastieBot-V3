import { POST_EVENT } from "../../utils/values";

const twitchPosts = (event, name) => {
  switch (event) {
    case POST_EVENT.TWITCH_NEW_SUB:
      return postNewTwitchSub(name);
    case POST_EVENT.TWITCH_NEW_FOLLOW:
      return postNewTwitchFollow(name);
    case POST_EVENT.TWITCH_HOSTING:
      return postHosting(name);
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

const postFollows5 = () => {
  return;
};

export default twitchPosts;
