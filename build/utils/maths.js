export function decimalStringToBigInt(decimalStr, precision) {
    const [integerPart, fractionalPart] = decimalStr.split(".");
    const combined = integerPart + (fractionalPart || "");
    const bigIntValue = BigInt(combined);
    return (bigIntValue *
        BigInt(10) **
            BigInt(precision - (fractionalPart ? fractionalPart.length : 0)));
}
