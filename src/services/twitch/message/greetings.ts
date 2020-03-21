import { beastieFaceEmotes } from "../../../utils/values";
import { isBroadcaster } from "../../../utils";

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

export const sayBeastieGreeting = (tags, message) => {
  let beastieGreeting = "Hello";
  if (message.toLowerCase().substring(1, 3) === "hi") beastieGreeting = "Hi";
  else if (message.toLowerCase().substring(1, 4) === "hey")
    beastieGreeting = "Hey";

  const beastieEmote = isBroadcaster(tags.username)
    ? "OhMyDog"
    : beastieFaceEmotes[Math.floor(Math.random() * beastieFaceEmotes.length)];
  return `${beastieGreeting} ${tags["display-name"]}! ${beastieEmote}`;
};
