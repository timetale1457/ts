import moment from 'moment';
import { Encrypt } from '../utils/encrypt';

export class UserQuery {
    static insertUser(userId: number, name: string, tel: string, email: string) {
        return `
        insert into tb_user (
            user_id, unique_id, name, tel, email, remarks, enabled, deleted, built_in, insert_id, insert_date, update_id, update_date
        )
        values (
            ${userId}, '${Encrypt.encryptAES256(email)}', '${name}', '${tel}', '${email}', '', 1, 0, 0, 'system', '${moment().format('YYYYMMDDHHmmssSSS')}', 'system', '${moment().format('YYYYMMDDHHmmssSSS')}'
        )   
        `        
    }
    static insertLoginAccount(userId: number, loginId: string, password: string) {
        return `
        insert into tb_user (
            user_id, login_id, password, login_fail_count, remarks, enabled, deleted, built_in, insert_id, insert_date, update_id, update_date
        )
        values (
            ${userId}, '${loginId}', '${Encrypt.encryptAES256(password)}', 0, '', 1, 0, 0, 'system', '${moment().format('YYYYMMDDHHmmssSSS')}', 'system', '${moment().format('YYYYMMDDHHmmssSSS')}'
        )
        `
    }
    static insertLoginHistory(userId: number, loginId: string, ip: string): string {
        return `
        insert into tb_login_history (
            user_id, login_id, create_time, code, ip, insert_id, update_id
        )
        values (
            ${userId}, '${loginId}', '${moment().format('YYYYMMDDHHmmssSSS')}', '010', '${ip}', 'system', 'system'
        );`;
    }
}