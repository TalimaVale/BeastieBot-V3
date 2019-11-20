import { beastieFaceEmotes } from "../../../utils/values";
import { isBroadcaster } from "../../../utils";
import { BADGES } from ".";

export const greetings = new Set([
  `hello`,
  `hi`,
  `hey`,
  `hellobeastie`,
  `hello beastie`,
  `hello ttsbeastie`,
  `heybeastie`,
  `hey beastie`,
  `hey ttsbeastie`,
  `hibeastie`,
  `hi beastie`,
  `hi ttsbeastie`
]);

export const sayBeastieGreeting = (tags, badge, command) => {
  let beastieGreeting = "Hello";
  if (command.substring(0, 2) === "hi") beastieGreeting = "Hi";
  else if (command.substring(0, 3) === "hey") beastieGreeting = "Hey";

  const beastieEmote = isBroadcaster(tags.username)
    ? "OhMyDog"
    : beastieFaceEmotes[Math.floor(Math.random() * beastieFaceEmotes.length)];

  if (badge === BADGES.STAFF)
    return `${beastieGreeting} ${
      tags["display-name"]
    }! ${beastieEmote} It's awesome to have official Twitch people in our chatroom! Welcome to the team stream! rawr`;
  else return `${beastieGreeting} ${tags["display-name"]}! ${beastieEmote}`;
};
