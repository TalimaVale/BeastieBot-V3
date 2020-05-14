export const command = "rawr";

export const aliases = new Set([]);

export const execute = ({ platform }) => {
  return platform === "twitch"
    ? "teamta1RAWR teamta1RAWR"
    : "<:teamta1RAWR:704871701992702013>";
};
