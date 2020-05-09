export const command = "twitch";

export const aliases = new Set([]);

export const execute = ({ platform }) => {
  return platform === "twitch"
    ? `Join the Team Stream! ⠀⠀⠀⠀⠀⠀⠀ => https://twitch.tv/teamTALIMA`
    : `Join the Team Stream!\n=> https://twitch.tv/teamTALIMA`;
};
