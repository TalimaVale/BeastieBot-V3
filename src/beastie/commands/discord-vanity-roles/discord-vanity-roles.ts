import { CommandModule } from "..";
import CommandContext from "../utils/commandContext";
import { Message, GuildMember } from "discord.js";

const execute = async (context: CommandContext): Promise<string> => {
  if (context.platform !== "discord") {
    return `${context.displayName}, the !tags command can only be used in a Direct Message on Discord.`;
  }

  const {
    message,
    member
  }: {
    message: Message;
    member: GuildMember;
  } = context.meta;

  if (context.whisper === false) {
    return `${message.author} Sorry, the \`!tags\` command can only be used if you send it via a Direct Message.`;
  }

  try {
    const [change = null, roleName = null] = context.parameters;
    let role = null;
    let hasRole = false;

    const SPECIAL_PREFIX = `★ `;
    const tagRoles = Array.from(
      member.guild.roles.cache,
      ([id, role]) => role
    ).filter(role => role.name.startsWith(SPECIAL_PREFIX));
    const existingTags = Array.from(
      member.roles.cache,
      ([id, role]) => role
    ).filter(role => role.name.startsWith(SPECIAL_PREFIX));

    switch (change) {
      case "add":
      case "remove":
        if (roleName === null)
          return `${message.author} Please provide a tag role name. Example: \`!tags ${change} "Example Tag"\``;
        role = tagRoles.find(
          role => role.name === `${SPECIAL_PREFIX}${roleName}`
        );
        hasRole =
          role === undefined
            ? false
            : existingTags.some(_role => _role.name === role.name);

        if (role === undefined) {
          return `${
            message.author
          } Sorry, \`${roleName}\` is not a tag I can do anything with. Perhaps you mispelled it?\n\nMaybe you meant one of these:\n\`\`\`\n${tagRoles
            .filter(role => {
              switch (change) {
                case "add":
                  return !existingTags.some(_role => _role.name === role.name);
                case "remove":
                  return existingTags.some(_role => _role.name === role.name);
              }
            })
            .map(role => {
              return `!tags ${change} "${role.name.slice(
                SPECIAL_PREFIX.length
              )}"`;
            })
            .join("\n")}\`\`\``;
        }
        break;
    }
    switch (change) {
      case "add": {
        if (hasRole)
          return `${message.author} You already have the \`${roleName}\` tag on our Discord server.`;
        await member.roles.add(role);
        return `${message.author} Added the \`${roleName}\` tag to you on our Discord server.`;
      }
      case "remove": {
        if (!hasRole)
          return `${message.author} You didn't have the \`${roleName}\` tag on our Discord server.`;
        await member.roles.remove(role);
        return `${message.author} Removed the \`${roleName}\` tag to you on our Discord server.`;
      }
      case null:
        return `${message.author} You have these tags: ${existingTags
          .map(role => `\`${role.name.slice(SPECIAL_PREFIX.length)}\``)
          .join("")}\n\nHere's what you can add or remove:\n\`\`\`${tagRoles
          .map(role => {
            const hasRole = existingTags.some(
              _role => _role.name === role.name
            );
            const change = hasRole ? "remove" : "add";
            return `!tags ${change} "${role.name.slice(
              SPECIAL_PREFIX.length
            )}"`;
          })
          .join("\n")}\`\`\``;
      default: {
        return `${message.author} Malformed command syntax. Correct usage: \`!tags add "Tag To Remove"\`, \`!tags remove "Tag To Remove"\` or \`!tags\`.`;
      }
    }
  } catch (error) {
    // console.log(error);
    return;
  }
};

export default new CommandModule(
  "tags",
  new Set([]),
  execute,
  context => context.platform === "discord" && context.whisper === true
);
