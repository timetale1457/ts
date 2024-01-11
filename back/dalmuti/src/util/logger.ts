import * as winston from 'winston';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import moment from 'moment';
import * as path from 'path';
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  });
  
export class Logger {
    private static instance: Logger = undefined;
    private readonly DEFAULT_LOG_PATAH = './logs';
    private fileName: string = 'MachiveAgent.log';
    private logLevel = 'info';  // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
    private logger: winston.Logger;
    private PROJECT_ROOT = path.join(__dirname, '..');

    private constructor() {}
    static getInstance() {
        if (!this.instance) {
            this.instance = new Logger();
        }

        return this.instance;
    }
   
    init(logPath: string) {
        if (logPath === undefined || logPath === null) {
            logPath = this.DEFAULT_LOG_PATAH
        }
        // winston.setLevels(winston.config.npm.levels);
        winston.addColors(winston.config.npm.colors);
        
        if (!fs.existsSync(logPath)) {
            mkdirp.sync(logPath);
        }

        this.logger = winston.createLogger({
            transports: [
                new (winston.transports.Console)({
                    level: this.logLevel,
                    format: combine(
                        timestamp({
                            format: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        }),
                        myFormat
                    )
                }),
                new (winston.transports.File)({
                    level: this.logLevel,
                    filename: logPath + '/' + this.fileName,
                    maxsize: 1024 * 1024 * 100,  // 100MB
                    maxFiles: 50, //로그 파일 최대 50개
                    format: combine(
                        timestamp({
                            format: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        }),
                        myFormat
                    ),
                    tailable: true //INFO: 최신 로그 파일의 이름이 항상 동일하게 유지됨 (직전 로그 파일은 가장 높은 번호의 파일)
                })
            ]
        });
    }

    info(...args: any[]){
        if(this.logger == null) return;
        this.logger.info(this.create_final_message(this.getLogString(args)));
    }


    warn(...args: any[]){
        if(this.logger == null) return;
        this.logger.warn(this.create_final_message(this.getLogString(args)));
    }

    error(...args: any[]){
        if(this.logger == null) return;
        this.logger.error(this.create_final_message(this.getLogString(args)));
    }

    debug(...args: any[]){
        if(this.logger == null) return;
        this.logger.debug(this.create_final_message(this.getLogString(args)));
    }

    private getLogString(args: any[]){
        let resultStr: string = '';
        for(let i=0;i<args.length;i++){
          //INFO: 객체 타입
            if(typeof(args[i]) === 'object'){
                resultStr += JSON.stringify(args[i]) + '\t';
            }
            else {
                resultStr += args[i] + '\t';
            }
        }
    
        return resultStr;
    }

    /**
     * Parses and returns info about the call stack at the given index.
     */
    get_stack_info (stack_index: number) {
        // get call stack, and analyze it
        // get all file, method, and line numbers
        var stacklist: string[] = (new Error()).stack.split('\n').slice(3);

        // stack trace format:
        // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
        // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
        var stack_reg: RegExp = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
        var stack_reg2: RegExp = /at\s+()(.*):(\d*):(\d*)/gi;

        var s: string = stacklist[stack_index] || stacklist[0];
        var sp: RegExpExecArray = stack_reg.exec(s) || stack_reg2.exec(s);

        if (sp && sp.length === 5) {
            return {
                method: sp[1],
                relative_path: path.relative(this.PROJECT_ROOT, sp[2]),
                line: sp[3],
                pos: sp[4],
                file: path.basename(sp[2]),
                stack: stacklist.join('\n')
            }
        }
    }

    //INFO: 호출한 함수 이름과 라인 번호가 표시됨
    create_final_message(message: string){
        let stack_info: object = this.get_stack_info(1);
        let final_message:string = `[${stack_info['file']}:${stack_info['line']}] ${message}`;
        return final_message;
    }
}