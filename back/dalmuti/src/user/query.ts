import moment from 'moment';
import { Encrypt } from '../utils/encrypt';

export class UserQuery {
    static insertUser(userId: number, name: string, tel: string, email: string) {
        
    }
    static insertLoginHistory(userId: number, loginId: string, ip: string): string {
        let qry =
        `insert into tb_login_history (
            user_id, login_id, create_time, code, ip, insert_id, update_id
        )
        values (
            ${userId}, '${loginId}', '${moment().format('YYYYMMDDHHmmssSSS')}', '010', '${ip}', 'system', 'system'
        );`;
        return qry;
    }
}