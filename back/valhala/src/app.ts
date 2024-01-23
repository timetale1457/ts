import express from 'express';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { Logger } from './utils/logger';
import { NodePostgres } from './utils/postgres';
import path from 'path';
import * as fs from 'fs';
import { ValhalaCtrl } from './control';
import { Encrypt } from './utils/encrypt';
interface IDbInitGroup {
    create_table: IDbInitItem[],
    built_in: IDbInitItem[],
    comment: IDbInitItem[],
}
interface IDbInitItem {
    name: string,
    query: string[]
}
class Valhala {
    private logger: Logger = Logger.getInstance();
    private app: express.Express;
    private server: http.Server;
    private io: Server;
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.app.use(cors());
        this.io = new Server(this.server, {
            cors: {
              origin: ["http://localhost:3000", "http://172.18.10.86:3000"], // 둘 다 허용
              methods: ["GET", "POST"]
            }
        });
    }
    private async initializeDb(config: object) {
        try {
            this.logger.info(`initializeDb() Start [dbconfig:${JSON.stringify(config)}]`);
            let host: string = config['host'];
            let port: number = config['port'];
            let masterId: string = config['master_id'];
            let masterPw: string = config['master_pw'];
            let dbName: string = config['db_name'];
            let user: string = config['user'];
            let pass: string = config['pass'];
            await NodePostgres.getInstance().initialize(host, port, masterId, masterPw, 'postgres');
            await this.createDbUser(user, pass);
            await this.createDb(user, dbName);
            await NodePostgres.getInstance().initialize(host, port, user, pass, dbName);
            await this.initializeTable();
        } catch(error) {
            this.logger.error(`initializeDb() Error [${error.message}]`);
        }
    }
    private async createDbUser(user: string, pass: string) {
        try {
            this.logger.info(`createDbUser() Start`);
            let res = await NodePostgres.getInstance().query(`select COUNT(*) from PG_SHADOW WHERE usename = '${user}';`);
            if (res === undefined)
                return;
            let cnt = Number.parseInt(res['rows'][0]['count']);
            if (cnt > 0)
                return;
            await NodePostgres.getInstance().query(`CREATE USER ${user} with CREATEDB PASSWORD '${pass}';`);
        } catch (error) {
            this.logger.error(`createDbUser() Error [${error.message}]`);
        }
    }
    private async createDb(user: string, dbName: string) {
        try {
            this.logger.info(`createDb() Start [dbName: ${dbName}]`);
            let initDb = await this.getExistsDb(dbName);
            if (initDb == true) {
                this.logger.info(`createDb() Stop [already create db]`);
                return;
            }
            await this.createDbQry(user, dbName); 
        } catch(error) {
            this.logger.error(`createDb() Error [${error.message}]`);
        }
    }
    private async getExistsDb(dbName: string): Promise<boolean> {
        try {
            this.logger.info(`getExistsDb() Start`);
            let res = await NodePostgres.getInstance().query(`select datname from pg_database`);
            let data =  res['rows'];
            let index = data.findIndex(item => item['datname'] == dbName);
            if(index == -1)
                return false;
            return true;
        } catch(error) {
            this.logger.error(`getExistsDb() Error [${error.message}]`);
            return false;
        }
    }
    private async createDbQry(user: string, dbName: string) {
        try {
            this.logger.info(`createDbQry() Start`);
            await NodePostgres.getInstance().query(`create database ${dbName} with owner ${user} encoding = 'UTF8' template template0 lc_collate = 'C' tablespace=pg_default`);
        } catch(error) {
            this.logger.error(`createDbQry() Error [${error.message}]`);
        }
    }
    private async initializeTable() {
        try {
            this.logger.info(`initializeTable() Start`);
            let qry: Object = require(path.join(process.cwd(), './config/dbInit.json'));
            let initModel: IDbInitGroup = qry['dalmuti'];
            await this.qryDbInitJson(initModel.create_table);
            await this.qryDbInitJson(initModel.built_in);
            await this.qryDbInitJson(initModel.comment);
        } catch (error) {
            this.logger.error(`initializeTable() Error [${error.message}]`);
        }
    }
    private async qryDbInitJson(initDataList: IDbInitItem[]) {
        try {
            this.logger.info(`qryDbInitJson() Start`);
            for (let index = 0; index < initDataList.length; index++) {
                const element = initDataList[index];
                let query = element.query.join(' ');
                this.logger.info(`${query}`);
                await NodePostgres.getInstance().query(query).catch(err => this.logger.error(`qryDbInitJson() Error [${err.message}]`));
            }
        } catch(error) {
            this.logger.error(`qryDbInitJson() Error [${error.message}]`);
        }
    }
    public serverStart() {
        this.initLogger();
        this.logger.info('======================================================================');
        this.server.listen(4000, () => {
            console.log('Server is running on http://localhost:4000/');
        });
        let config = this.load_config();
        Encrypt.setSecretKey(config['server']['secretKey']);
        this.initializeDb(config['db']);
        ValhalaCtrl.getInstance();
    }
    private load_config():object{
        let config:any;
        let confFilePath: string = path.join(process.cwd(), './config/config.json');
        if (fs.existsSync(confFilePath)) {
            let strConfig = fs.readFileSync(confFilePath, 'utf8');
            config = JSON.parse(strConfig.trim());
            return config;
        }
        return config;
    }
    private initLogger() {
        this.logger = Logger.getInstance();
        let logPath = path.join(process.cwd(), './logs');
        this.logger.init(logPath);
    }
}

new Valhala().serverStart();