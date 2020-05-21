import { CommandModule } from "../index";

const execute = async (): Promise<string> => {
  return `teamTALIMA is an educational development gaming community! We live stream development of our projects on Twitch. We hang out in Discord to talk GameDev, WebDev, CompSci, Business and Minecraft Server Creation ;) Talima is also active on YouTube and Instagram.`;
};

const cmdModule = new CommandModule(
  "about",
  new Set(["aboutus", "aboutteam", "abouttheteam", "aboutteamtalima"]),
  execute
);

cmdModule.rateLimit = 1000 * 60 * 10;
export default cmdModule;
