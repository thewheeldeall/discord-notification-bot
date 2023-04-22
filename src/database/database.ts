import mysql, { createPool, OkPacket, Pool, RowDataPacket } from 'mysql2'

export class Database {

  private db? : Pool;

  public constructor(host : string, port: number, username : string, password : string, connectionSize : number) {
    try {
      this.db = createPool({
        connectionLimit: connectionSize,
        host: host,
        port: port,
        user: username,
        password: password
      })
    } catch (error : any) {
      console.log(error);
    }
  }

  public async createDatabase (databaseName : string) : Promise<boolean> {
    const queryString = `CREATE DATABASE ${databaseName}`;
    let response = await this.queryAndReturn(queryString);
    return this.successfulQuery(response);
  }

  public async checkIfDatabaseExists (databaseName : string) : Promise<boolean> {
    const queryString = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}'`;
    let response = await this.queryAndReturn(queryString);
    let singleResponse = response[0]["SCHEMA_NAME"];
    if(singleResponse == databaseName) return true; 
    return false;
  }

  public async checkIfTableExists (databaseName : string, tableName : string) : Promise<boolean> {
    const queryString = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${databaseName}' AND TABLE_NAME = '${tableName}'`;
    let response = await this.queryAndReturn(queryString);
    let singleResponse = response[0]["TABLE_NAME"];
    if(singleResponse == tableName) return true;
    return false;
  }

  public async createTable (databaseName : string, tableName : string, tableColumns : string) : Promise<boolean> {
    const queryString = `CREATE TABLE ${databaseName}.${tableName} (${tableColumns})`;
    let response = await this.queryAndReturn(queryString);
    return this.successfulQuery(response);
  }

  public async insertIntoTable (databaseName : string, tableName : string, tableColumns : string, tableValues : string) : Promise<boolean> {
    const queryString = `INSERT INTO ${databaseName}.${tableName} (${tableColumns}) VALUES (${tableValues})`;
    let response = await this.queryAndReturn(queryString);
    console.log(`Inserted in DB: ${queryString} with response ${JSON.stringify(response)}`)
    return this.successfulQuery(response);
  }

  public async selectFromTable (databaseName : string, tableName : string, tableColumns : string, whereClause? : string, groupBy? : string, orderBy? : string, limit? : number) : Promise<RowDataPacket[]> {
    const queryString = `
      SELECT ${tableColumns} 
      FROM ${databaseName}.${tableName}
      ${whereClause ? ' WHERE ' + whereClause : ''}
      ${groupBy ? ' GROUP BY ' + groupBy : ''}
      ${orderBy ? ' ORDER BY ' + orderBy : ''}
      ${limit ? ' LIMIT ' + limit : ''}
    `;
    let response = await this.queryAndReturn(queryString);
    console.log(`Selected from DB: ${JSON.stringify(response)}`)
    return response;
  }

  public async updateFromTable (databaseName : string, tableName : string, tableColumns : string, whereClause : string) : Promise<boolean> {
    const queryString = `UPDATE ${databaseName}.${tableName} SET ${tableColumns} WHERE ${whereClause}`;
    let response = await this.queryAndReturn(queryString);
    console.log(`Updated in DB: ${queryString} with response ${JSON.stringify(response)}`)
    return this.successfulQuery(response);
  }

  public async query(queryString : string) : Promise<RowDataPacket[]> {
    let response = await this.queryAndReturn(queryString);
    console.log(`Queried DB: ${queryString} with response ${JSON.stringify(response)}`)
    return response;
  }

  private async queryAndReturn(queryString : string) : Promise<mysql.RowDataPacket[]> {
    if(this.db === undefined) {
      console.log(`Failed to query database: Database not initialized`);
      return [];
    }
    let result : RowDataPacket[] = [];
    try {
      let response = await this.db.promise().query(queryString);
      result = <RowDataPacket[]> response[0];
    } catch(err : any) {
      console.log(`Failed to query database: ${JSON.stringify(err.sqlMessage)}`);
    }
    return result;
  }

  private successfulQuery(response : any) : boolean {
    if(response === undefined) return false;
    if(response.affectedRows === undefined) return false;
    if(response.affectedRows > 0) return true;
    return false
  }
}