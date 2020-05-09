export const command = "discord";

export const aliases = new Set([]);

export const execute = ({ platform }) => {
  return platform === "twitch"
    ? `Join the Team Discord Guild! ⠀⠀⠀ => https://discord.gg/eZtrhh7`
    : `Join the Team Discord Guild!\n=> https://discord.gg/eZtrhh7`;
};
