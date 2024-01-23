import * as user from "./user/control";
import { Encrypt } from "./utils/encrypt";
import { Logger } from "./utils/logger";
import { NodePostgres } from "./utils/postgres";


export class ValhalaCtrl {
    private logger: Logger = Logger.getInstance();
    private static instance = undefined;
    private userCtrl: user.Ctrl = new user.Ctrl();
    private constructor() {
    }
    public static getInstance(): ValhalaCtrl {
        if(this.instance != undefined)
            return this.instance;
        return this.instance = new ValhalaCtrl();
    }
    public getUserCtrl(): user.Ctrl {
        return this.userCtrl;
    }
}