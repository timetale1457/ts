export enum ErrorCode {
    EXCEPTION = 'EXCEPTION',
    BAD_REQUEST = 'BAD_REQUEST',
}
export const ErrorMessage = {
    [ErrorCode.EXCEPTION]: 'Exception 발생.',
    [ErrorCode.BAD_REQUEST]: '올바르지 않은 요청.',
}
export class ValhalaError{
    public static getErrorObject(errorCode:string, value?: any){
        let code = errorCode;        
        let message = ErrorMessage[code];
        if(message == undefined){
            code = ErrorCode.EXCEPTION;
            message = ErrorMessage[ErrorCode.EXCEPTION];
        }
        return {
            code,
            message,
            value
        }
    }
}