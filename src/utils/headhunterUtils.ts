import { RowDataPacket } from "mysql2";
import { Config } from "../classes/config";
import { Entry } from "../classes/entry";
import { Database } from "../database/database";

export class HeadhunterUtils {

  public static async getPlayerLastEntry(userId : string, config: Config, db : Database) : Promise<Date> {
    let result = await db.selectFromTable(config.getDBName(), config.getEntriesTableName(), "Created", `UserId = '${userId}'`, undefined, "Created DESC", 1);
    if(result.length == 0) return new Date(0);
    return new Date(result[0].Created * 1000);
  }

  public static async getLeaderboard(config : Config, db : Database, limit : number) : Promise<RowDataPacket[]> {
    let result = 
      await db.selectFromTable(
        config.getDBName(), 
        config.getEntriesTableName(),
        "UserId, Sum(Winner) as Wins", 
        undefined,
        "UserId",
        "Wins DESC",
        limit
      );
    return result;
  }
}