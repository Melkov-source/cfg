import mysql, {Pool, PoolOptions, QueryResult} from "mysql2";
import {IService, Services, ServiceType} from "../services.js";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

export interface IDatabaseConnectionHandler {
    getSql(name: string): string;

    query(query: string, values?: any): Promise<void>;
    queryWithResults<TResult extends QueryResult>(query: any, values?: any): Promise<TResult>
}

const loadSqlQueriesFromFolder = (folderPath: string): Record<string, string> => {
    const queries: Record<string, string> = {};

    const readFiles = (dir: string) => {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                readFiles(fullPath); // Рекурсивный вызов для папок
            } else {
                const queryName = path
                    .relative(folderPath, fullPath)
                    .replace(path.extname(fullPath), '')
                    .replace(/\\/g, '/');

                const query = fs.readFileSync(fullPath, 'utf8');
                queries[queryName] = query;
            }
        });
    };

    readFiles(folderPath);

    return queries;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Database implements IService, IDatabaseConnectionHandler {
    public readonly type: ServiceType = ServiceType.DATABASE;

    private readonly _connectionsPool: Pool;

    private readonly _sql: Record<string, string>;

    public constructor(options: PoolOptions) {
        this._connectionsPool = mysql.createPool(options);

        this.createTables();

        const sqlPath = path.join(__dirname, '../../../sql');
        this._sql = loadSqlQueriesFromFolder(sqlPath);

        Services.add(this);
    }

    public getSql(name: string): string {
        return this._sql[name];
    }

    public query(query: string, values?: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._connectionsPool.getConnection((callback_error_connection, connection) => {
                if (callback_error_connection) {
                    console.error('Error getting connection from pool: ' + callback_error_connection.stack);
                    return;
                }

                const callback_query = (callback_error_query: any) => {
                    this._connectionsPool.releaseConnection(connection);

                    if (callback_error_query) {

                        console.error('Error executing query: ' + callback_error_query.stack);

                        reject(callback_error_query);
                        return;
                    }

                    resolve();
                };

                if (values) {
                    connection.query(query, values, callback_query.bind(this));
                } else {
                    connection.query(query, callback_query.bind(this));
                }
            });
        });
    }

    public queryWithResults<TResult extends QueryResult>(query: any, values?: any): Promise<TResult> {
        return new Promise<TResult>((resolve, reject) => {
            this._connectionsPool.getConnection((callback_error_connection, connection) => {
                if (callback_error_connection) {
                    console.error('Error getting connection from pool: ' + callback_error_connection.stack);
                    return;
                }

                const callback_query = (callback_error_query: any, result: any) => {
                    this._connectionsPool.releaseConnection(connection);

                    if (callback_error_query) {
                        reject(callback_error_query);
                        return;
                    }

                    resolve(result);
                };

                if (values) {
                    connection.query<TResult>(query, values, callback_query.bind(this));
                } else {
                    connection.query<TResult>(query, callback_query.bind(this));
                }
            });
        });
    }

    private createTables() {
    }
}