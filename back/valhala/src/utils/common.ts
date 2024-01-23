import { Logger } from "./logger";

let logger = Logger.getInstance();
export class Common {
    static containsString(arr: string[], str: string): boolean {
        let result = arr.includes(str)
        let result2 = arr.includes(str);
        return result || result2;
      }
    static isEnumValue(value: string, enumType: any): boolean {
        return Object.values(enumType).includes(value);
    }
    static FindScriptChar(checkedStr: string) : boolean {
        try {
            logger.info(`FindScriptChar() Start`);
            const regExp = /[<>()#&{}\[\]]/g;
            let idx = checkedStr.search(regExp);
            if(idx == -1)
                return false;
            return true;
        } catch(error) {
            logger.error(`FindScriptChar() Error [${error.message}]`);
            return true;
        }
    }
    static hasOwnProperty(obj:object, checkList:Array<string>) {
        let keys = new Array;
        checkList.map(key => {
            var res = Object.keys(obj).some(v => v == key);
            if (res == false) {
                keys.push(key);
            }
        });
        if (keys.length > 0) {
            console.log("hasOwnProperty error=", keys);  //확인용
            return false;
        }
        return true;
    }
    static isValueInEnum(value: string, enumeration: any): boolean {
        return Object.values(enumeration).includes(value);
    }
}