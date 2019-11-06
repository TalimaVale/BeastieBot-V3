import { isBroadcaster } from "../../utils";
import { beastieFaceEmotes } from "../../utils/values";

export enum MESSAGE_TYPE {
  "GREETING"
}

const greetings = new Set([
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

export const sayBeastieGreeting = (tags, message) => {
  let beastieGreeting = "Hello";
  if (message.toLowerCase().substring(1, 3) === "hi") beastieGreeting = "Hi";
  else if (message.toLowerCase().substring(1, 4) === "hey")
    beastieGreeting = "Hey";

  const beastieEmote = isBroadcaster(tags.username)
    ? "OhMyDog"
    : beastieFaceEmotes[Math.floor(Math.random() * beastieFaceEmotes.length)];
  return `${beastieGreeting} @${tags["display-name"]}! ${beastieEmote}`;
};

export const determineMessageType = rawMessage => {
  const message = rawMessage.toLowerCase().slice(1);
  if (greetings.has(message)) return MESSAGE_TYPE.GREETING;
};

export const determineBeastieResponse = (tags, message) => {
  const messageType = determineMessageType(message);

  switch (messageType) {
    case MESSAGE_TYPE.GREETING:
      return sayBeastieGreeting(tags, message);
    default:
      return;
  }
};
