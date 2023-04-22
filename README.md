# Discord bot for notifications

## Environment Info
```
BOT_DEBUG=true
TZ="UTC" # Very important as all times are in UTC
DSCRD_BOT_TKN="token"
CONFIG_FILE="/path/to/config.json"
```

## The CONFIG_FILE
This document is to be stored alongside the bot, in a container environment this file will need to be created and placed in the location you point to with the environment variable.

This file should look like:
```json
[
    {
        "cron": "0 0 * * *",
        "channelId": "01234567890",
        "message": "Hello World"
    }
]
```

In this file you have a outermost array which can contain as many of these, as I call them `notification objects` as you want. Each object has 3 properties:
| Key Name | Description |
|---|---|
| cron | This is a typical Cron expression, any errors should be printed on first load |
| channelId | A channel which is on a server the provided Discord token has access to |
| message | Any text including supported Discord formatting |

### Contact
Aaron Renner <aaron@bananaz.tech>