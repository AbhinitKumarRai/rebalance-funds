export class CustomError extends Error {
    code;
    constructor(code, message) {
        message = message || ERROR_CODE_DESCRIPTION[code];
        super(message);
        this.code = code;
    }
    IsType(code) {
        return this.code === code;
    }
}
export const ERROR_CODE = {
    INTRINSIC_GAS_TOO_LOW: 10000,
    INSUFFICIENT_FUNDS: 10001,
    DEPOSIT_FAILED: 10002,
    WITHDRAW_FAILED: 10003,
    APPROVE_TXN_FAILED: 10004,
    INTERNAL_SERVER_ERROR: 500,
};
export const ERROR_CODE_DESCRIPTION = {
    10000: "intrinsic gas too low",
    10001: "Insufficient funds",
    10002: "Deposit Failed",
    10003: "Withdraw Failed",
    10004: "Approve txn failed",
    500: "Internal server error",
};
export const generateError = (code, message) => {
    return new CustomError(code, message);
};
