# Discord Bot for Notifications
---
## Environment Info
```
BOT_DEBUG=true
TZ="UTC" # Very important as all times are in UTC
DSCRD_BOT_TK="token"
CONFIG_FILE="/path/to/config.json"
```
---
## The `CONFIG_FILE`
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
---
## Container Runtime
This section covers two scenerios of running the app, one in Docker and one in Kubernetes.

### Docker
See [docker-compose](docker-compose.yaml)

### Kubernetes
Create ConfigMap for the configuration yaml as such:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: bot-config
  namespace: bot-namespace
data:
  config.yaml: |
    [
      {
        "cron": "0 */2 * * *",
        "channelId": "790751594982801420",
        "message": "<@176355202687959051> Time to play pokemon"
      }
    ]
```

Within the container configuration section on a Deployment or StatefulSet:
```yaml
... (Deployment type - within spec)
containers:
- env:
  - name: CONFIG_FILE
    value: "/tmp/config.yaml"
  image: ghcr.io/bananaztechnology/discord-notification-bot:latest
  imagePullPolicy: Always
  name: notif-bot
  volumeMounts:
  - name: config-volume
    mountPath: /tmp
volumes:
- name: config-volume
  configMap:
    name: bot-config
```
---
## Contact
Aaron Renner <aaron@bananaz.tech>