import * as express from 'express'
import { ErrorCode, ValhalaError } from '../error';
import { Logger } from '../utils/logger';
import { Common } from '../utils/common';
import { Ctrl } from './control';
import { ValhalaCtrl } from '../control';

export class Index {
    private router: express.Router = express.Router();
    private logger: Logger = Logger.getInstance();
    private ctrl: Ctrl = ValhalaCtrl.getInstance().getUserCtrl();
    constructor(){
        this.setRoute();
    }
    private setRoute() {
        this.router.get('/duplicate/id/:loginId',  async (req:express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                res.status(200).json();
                return;
            } catch (error) {
                res.status(500).json(ValhalaError.getErrorObject(error.message));
                return;
            }
        });
        this.router.get('/duplicate/email/:email',  async (req:express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                res.status(200).json();
                return;
            } catch (error) {
                res.status(500).json(ValhalaError.getErrorObject(error.message));
                return;
            }
        });
        this.router.post('/regist', async (req:express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                let body = req.body;
                if(Common.hasOwnProperty(body, ["name", "tel", "email", "loginId", "password"]) == false) {
                    res.status(400).json(ErrorCode.BAD_REQUEST);
                    return;
                }
                let name: string = body['name'];
                let tel: string = body['tel'];
                let email: string = body['email'];
                let loginId: string = body['loginId'];
                let password: string = body['password'];
                this.ctrl.registUser(name, tel, email, loginId, password);
                res.sendStatus(200);
                return;
            } catch (error) {
                res.status(500).json(ValhalaError.getErrorObject(error.message));
                return;
            }
        });
        this.router.post('/login', async (req:express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                res.sendStatus(200);
                return;
            } catch (error) {
                res.status(500).json(ValhalaError.getErrorObject(error.message));
                return;
            }
        });
    }
    getRoute(): express.Router {
        return this.router;
    }
}