import { Database } from "../database/database";
import { StringUtils } from "../utils/stringUtils";

export class Config {
    // Object data settings
    private TABLE_NAME: string;
    private DB_NAME: string;
    private db : Database;
    private TABLE_ORDER = `GameUuid, GameChannelId, GameCommand, GameRunning, EntriesTableName, CommandCooldown, StartTime, AnswersToGenerate, Answers, Answered, Projects`;
    // Object properties
    private configId: number;
    private entriesTableName?: string;
    private gameUuid?: string;
    private gameChannelId?: string;
    private gameCommand?: string;
    private gameRunning?: boolean;
    private commandCooldown?: number;
    private startTime?: number;
    private answersToGenerate?: number;
    private answers?: string[];
    private answered?: string[];
    private projects?: string[];

    public constructor (configId : number, dbName: string, tableName : string, db : Database) {
        this.configId = configId;
        this.TABLE_NAME = tableName;
        this.DB_NAME = dbName;
        this.db = db;
    }

    // Getters
    public getDBName() : string {
        return this.DB_NAME;
    }
    public getConfigId() : number {
        return this.configId
    }
    public getEntriesTableName() : string {
        return this.entriesTableName ? this.entriesTableName : this.getGameUuid();
    }
    public getGameUuid() : string {
        return this.gameUuid ? this.gameUuid : ""
    }
    public getGameChannelId() : string {
        return this.gameChannelId ? this.gameChannelId : ""
    }
    public getGameCommand() : string {
        return this.gameCommand ? this.gameCommand : ""
    }
    public isGameRunning() : boolean {
        return this.gameRunning ? this.gameRunning : false
    }
    public getCommandCooldown() : number {
        return this.commandCooldown ? this.commandCooldown : 0
    }
    public getStartTime() : number {
        return this.startTime ? this.startTime : 0
    }
    public getAnswersToGenerate() : number {
        return this.answersToGenerate ? this.answersToGenerate : 0
    }
    public getAnswers() : string[] {
        return this.answers ? this.answers : []
    }
    public getAnswered() : string[] {
        return this.answered ? this.answered : []
    }
    public getProjects() : string[] {
        return this.projects ? this.projects : []
    }

    // Setters
    public setGameUuid(uuid : string) : void {
        this.writeObject("GameUuid", uuid);
        this.gameUuid = uuid;
    }
    public setGameChannelId(channelId : string) : void {
        this.writeObject("GameChannelId", channelId);
        this.gameChannelId = channelId
    }
    public setGameCommand(command : string) : void {
        this.writeObject("GameCommand", command);
        this.gameCommand = command
    }
    public setGameRunning(running : boolean) : void {
        this.writeObject("GameRunning", running);
        this.gameRunning = running
    }
    public setCommandCooldown(cooldown : number) : void {
        this.writeObject("CommandCooldown", cooldown.toString());
        this.commandCooldown = cooldown
    }
    public setStartTime(startTime : number) : void {
        this.writeObject("StartTime", startTime);
        this.startTime = startTime
    }
    public setAnswers(answers : string[]) : void {
        this.writeObject("Answers", StringUtils.arrayToCsvString(answers));
        this.answers = answers
    }
    public setAnswered(answered : string[]) : void {
        this.writeObject("Answered", StringUtils.arrayToCsvString(answered));
        this.answered = answered
    }
    public setProjects(projects : string[]) : void {
        this.writeObject("Projects", StringUtils.arrayToCsvString(projects));
        this.projects = projects
    }

    // Updaters
    public addAnswered(answered : string) : void {
        if(!this.answered) this.answered = [];
        this.answered.unshift(answered);
        this.writeObject("Answered", StringUtils.arrayToCsvString(this.answered));
    }
    public addProjects(project : string) : void {
        if(!this.projects) this.projects = [];
        this.projects.unshift(project);
        this.writeObject("Projects", StringUtils.arrayToCsvString(this.projects));
    }

    private async writeObject(columnName : string, value : any) {
        //determine type
        let valueAsProperType;
        if(typeof value === "string")  valueAsProperType = `'${value}'`;
        else if(typeof value === "number") valueAsProperType = value;
        else if(typeof value === "boolean") valueAsProperType = value ? 1 : 0;
        //write
        this.db.updateFromTable(this.DB_NAME, this.TABLE_NAME, `${columnName} = ${valueAsProperType}`, `ConfigId = ${this.configId}`);
    }
    public async readObject() : Promise<Config> {
        let response = await this.db.selectFromTable(this.DB_NAME, this.TABLE_NAME, this.TABLE_ORDER, `ConfigId = ${this.configId}`);
        let responseFirstObj = response[0];
        this.gameUuid = responseFirstObj.GameUuid;
        this.gameChannelId = responseFirstObj.GameChannelId;
        this.gameCommand = responseFirstObj.GameCommand;
        this.gameRunning = responseFirstObj.GameRunning === 1 ? true : false;
        /// TODO: test output with null values
        this.entriesTableName = responseFirstObj.EntriesTableName;
        this.commandCooldown = parseInt(responseFirstObj.CommandCooldown);
        this.startTime = parseInt(responseFirstObj.StartTime);
        this.answers = StringUtils.csvStringToArray(responseFirstObj.Answers);
        this.answersToGenerate = parseInt(responseFirstObj.AnswersToGenerate);
        this.answered = StringUtils.csvStringToArray(responseFirstObj.Answered);
        this.projects = StringUtils.csvStringToArray(responseFirstObj.Projects);
        return this;
    }
  }
  