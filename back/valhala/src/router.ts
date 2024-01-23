import * as express from 'express';
import { Logger } from './utils/logger';
import * as bodyParser from 'body-parser';
import * as user from './user/index'

export class Index{
    private logger: Logger = Logger.getInstance();
    private app: express.Application;
    private router: express.Router;
    private user: user.Index;
    constructor() {
    }
    public initRouter(app: express.Application,router: express.Router,config:any) {
        this.app = app;    
        this.router = router;
        this.setCommonConfig();
        this.setCommonRoute('/api');
        this.setMiddlewareRoute();
    }
    private setCommonConfig() {
        this.app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Access-Control-Allow-Headers, ');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    
            next();
        });
        this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if ( err !== undefined ){
                this.logger.error(err.message, err.stack);
                res.status(503).send("ServerInternalError");
            } else{
                res.status(503).send("ServerInternalError");
            }
        });
    }
    private setCommonRoute(baseUrl: string) {
        // 모든 요청에 대해 인증 로직 처리
        this.app.use('/', (req, res, next) => {
            next();
        });
        console.log('baseUrl: ' + baseUrl);
        this.app.use(baseUrl ,this.router);
        //router 추가
        this.app.use(baseUrl +'/user',new user.Index().getRoute());
        //this.app.use(baseUrl +'/log',new log.Index().getRoute());
    }
    private setMiddlewareRoute() {
        this.app.use('*', (req, res) => {
            res.status(404).send('URI is not exists');
        });
    }
}