export function decimalStringToBigInt(
  decimalStr: string,
  precision: number
): bigint {
  const [integerPart, fractionalPart] = decimalStr.split(".");
  const combined = integerPart + (fractionalPart || "");
  const bigIntValue = BigInt(combined);
  return (
    bigIntValue *
    BigInt(10) **
      BigInt(precision - (fractionalPart ? fractionalPart.length : 0))
  );
}

// Function to convert BigInt to a number
export function convertBigIntToNumber(bigIntValue: BigInt): number {
  const scaleFactor = BigInt(1e18);
  const scaledFloatValue = Number(bigIntValue) / Number(scaleFactor);
  return scaledFloatValue;
}
