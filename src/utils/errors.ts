export class CustomError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode, message?: string) {
    message = message || ERROR_CODE_DESCRIPTION[code];
    super(message);
    this.code = code;
  }

  IsType(code: ErrorCode): boolean {
    return this.code === code;
  }
}

export const ERROR_CODE = {
  INTRINSIC_GAS_TOO_LOW: 10000,
  INSUFFICIENT_FUNDS: 10001,
  DEPOSIT_FAILED: 10002,
  WITHDRAW_FAILED: 10003,
  APPROVE_TXN_FAILED: 10004,
  ANOTHER_TRANSACTION_ALREADY_IN_PROCESS: 10005,
  EXCEEDS_BLOCK_GAS_LIMIT: 10006,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type ErrorCode = typeof ERROR_CODE[keyof typeof ERROR_CODE];

export const ERROR_CODE_DESCRIPTION: { [key in ErrorCode]: string } = {
  10000: "intrinsic gas too low",
  10001: "Insufficient funds",
  10002: "Deposit Failed",
  10003: "Withdraw Failed",
  10004: "approve txn request failed",
  10005: "Another transaction is already in process",
  10006: "Exceeds block gas limit",
  500: "Internal server error",
};

export const generateError = (code: ErrorCode, message?: string) => {
  return new CustomError(code, message);
};

export function handleError(err, genericerrorCode): ErrorCode {
  if ((err as any).error) {
    const errorDetails = (err as any).error;

    if (errorDetails.message.includes("intrinsic gas too low")) {
      return ERROR_CODE.INTRINSIC_GAS_TOO_LOW;
    } else if (errorDetails.message.includes("insufficient funds")) {
      return ERROR_CODE.INSUFFICIENT_FUNDS;
    } else if (
      errorDetails.message.includes("transaction would cause overdraft")
    ) {
      return ERROR_CODE.ANOTHER_TRANSACTION_ALREADY_IN_PROCESS;
    } else if (errorDetails.message.includes("exceeds block gas limit")) {
      return ERROR_CODE.EXCEEDS_BLOCK_GAS_LIMIT;
    } else {
      return genericerrorCode;
    }
  }
  return ERROR_CODE.INTERNAL_SERVER_ERROR;
}
