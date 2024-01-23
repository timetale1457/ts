import { PoolClient } from "pg";
import { Logger } from "../utils/logger";
import { NodePostgres } from "../utils/postgres";

export class Ctrl {
    private logger: Logger = Logger.getInstance();
    public constructor() {
    }
    public registUser(name: string, tel: string, email: string, loginId: string, password: string) {
        try {
            //쿼리
        } catch (error) {
            
        }
    }
    public async tsExample() {
        let tsClient: PoolClient = await NodePostgres.getInstance().getClient();
        let errCode:string = undefined;
        try {
            await NodePostgres.getInstance().tsQuery(tsClient, 'BEGIN');
            await tsClient.query('COMMIT');
        } catch (error) {
            await tsClient.query('ROLLBACK');
            this.logger.error(`tsExample() [msg:${error.message}]`);
            errCode = error.message;
        } finally {
            tsClient.release();
            if(errCode != undefined) {
                throw new Error(errCode);
            }
        }
    }
}