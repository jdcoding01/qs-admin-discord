> # qs-admin-discord
> ## Part of the `qs-admin` ecosystem, this bot enables a vast amount of admin actions to be performed from your Discord server, thus enabling faster Staff response times and efficiency by reducing the need to load in city to do everything, this is a complete Discord tool intended to work with the `qs-adminmenu`.

# Installation 

> ## Note: Make sure to have latest [Node.js](https://nodejs.org) installed

## `Step 1:` In your Windows/Linux server's terminal execute `git clone https://github.com/jdcoding01/qs-admin-discord`

## `Step 2:` Execute `npm install`

## `Step 3:` Set up a [Discord Application](https://discord.com/developers/applications) as a `Bot`, copy the `token` and set it on ` .env` file, make sure to invite the bot to your server

## `Step 4:` Run the bot: `ts-node src/index.ts`

# Commands

`/register` `args: [log_channel]` - Registers guild in the built-in `.sqlite` database for logging

`/ban` `args: [discord_id/@user, reason, duration]` - Bans player

`/kick` `args: [discord_id/@user, reason]` - Kicks player

`/warn` `args: [discord_id@user, reason]` - Warns player

`/giveitem` `args: [discord_id/@user, item_name, amount]` - Gives item to player, supports direct DB integration instead of doing it through FiveM inventory 


# Permission Management
`/setpermission`
```
args: [
    action: kick, ban, ..., // action to give permission for
    target: discord_id/@user/@role // member, role to give permission to
]
```
NOTE: If this command is executed with a target that already has the specified permission, it will remove the permission and inform of it to the command executor