## DF Headhunters game

### Environment Info
```
BOT_DEBUG=true
TZ="UTC" # Very important as all times are in UTC
DB_PORT="3306"
DB_CONN_SIZE="10"
DB_HOST="aar.dev"
DB_USER="userName"
DB_PWD="a@@dddfefwerfwr"
DB_NAME="deadfellaz"
CONFIG_TABLE_NAME="gameConfigs"
CONFIG_ID="1"
DSCRD_BOT_TK="BOT.TOKEN.CODE"
USER_API_URL="https://proxy.bananaz.tech/api/users"
USER_API_KEY="key"
```

### Database Info
```sql
CREATE DATABASE IF NOT EXISTS `deadfellaz`;
```

```sql
CREATE TABLE IF NOT EXISTS `deadfellaz`.`gameConfigs` (
    ConfigId INT NOT NULL AUTO_INCREMENT,
    GameUuid VARCHAR(255) NOT NULL,
    GameChannelId VARCHAR(255) NOT NULL,
    GameCommand VARCHAR(255) NOT NULL,
    GameRunning BOOLEAN NOT NULL DEFAULT FALSE,
    EntriesTableName VARCHAR(255) NOT NULL,
    CommandCooldown INT, -- In Seconds --
    StartTime BIGINT NOT NULL,
    AnswersToGenerate INT NOT NULL,
    Answers VARCHAR(255) NOT NULL,
    Projects VARCHAR(255) NOT NULL,
    Answered VARCHAR(255),
    Notes VARCHAR(255),
    PRIMARY KEY (ConfigId))
```

```sql
CREATE TABLE IF NOT EXISTS `deadfellaz`.`headhuntersV2Entries` (
    Id INT NOT NULL AUTO_INCREMENT,
    UserId VARCHAR(255) NOT NULL,
    GameUuid VARCHAR(255) NOT NULL,
    Answer VARCHAR(255) NOT NULL,
    Created BIGINT NOT NULL,
    Wallet VARCHAR(255),
    Winner BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (Id))
```

### Contact
Aaron Renner <aaron@bananaz.tech>