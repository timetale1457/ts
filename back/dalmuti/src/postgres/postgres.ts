import {Pool,PoolClient} from 'pg'
import { Logger } from '../util/logger';
let logger = Logger.getInstance();
export class NodePostgres {
    private static instance:NodePostgres = undefined;
    private pool:Pool;
    private constructor(){
    }
    public static getInstance():NodePostgres {
        if(this.instance == undefined) {
            this.instance = new NodePostgres();
        }
        return this.instance;
    }
    public async initialize(host:string, port:number, user:string, password:string, database:string){
        try {
            this.pool = new Pool({
                host: host,
                port: port,
                user: user,
                password: password,
                database: database
            });
        } catch (error) {
            console.error(error);
            throw new Error('NodePostgres createPool() error');
        }
    }
    public async getClient(): Promise<PoolClient> {
        try {
            let client = await this.pool.connect();
            return client;
        } catch (error) {
            console.error(error);
            throw new Error('NodePostgres getClient() error');
        }
    }
    public async tsQuery(client:PoolClient, sql:string){
        try {
            let res = await client.query(sql);
            return res;
        } catch (error) {
            logger.error(`tsQuery Error [msg:${error.message}] [qry:${sql}]`);
            throw new Error('NodePostgres query() error');
        }
    }
    public async query(sql: string) {
        try {
            let res = await this.pool.query(sql);
            return res;
        } catch (error) {
            logger.error(`query Error [msg:${error.message}] [qry:${sql}]`);
            throw new Error("NodePostgres query() error");
        }
    }
}