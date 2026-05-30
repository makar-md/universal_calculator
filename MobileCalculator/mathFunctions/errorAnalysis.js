export const compareEqualities = (exact1, approx1, exact2, approx2) => {
  const error1 = Math.abs(exact1 - approx1);
  const relativeError1 = error1 / Math.abs(exact1);
  
  const error2 = Math.abs(exact2 - approx2);
  const relativeError2 = error2 / Math.abs(exact2);
  
  const firstMoreAccurate = relativeError1 < relativeError2;
  
  return {
    first: {
      exact: exact1,
      approx: approx1,
      absoluteError: error1,
      relativeError: relativeError1,
      relativeErrorPercent: relativeError1 * 100
    },
    second: {
      exact: exact2,
      approx: approx2,
      absoluteError: error2,
      relativeError: relativeError2,
      relativeErrorPercent: relativeError2 * 100
    },
    moreAccurate: firstMoreAccurate ? "first" : "second",
    conclusion: firstMoreAccurate 
      ? `Первое равенство точнее (относительная погрешность ${(relativeError1 * 100).toFixed(6)}% < ${(relativeError2 * 100).toFixed(6)}%)`
      : `Второе равенство точнее (относительная погрешность ${(relativeError2 * 100).toFixed(6)}% < ${(relativeError1 * 100).toFixed(6)}%)`
  };
};

export const roundByRelativeError = (number, relativeErrorPercent) => {
  const relativeError = relativeErrorPercent / 100;
  const absoluteError = Math.abs(number) * relativeError;
  const order = Math.floor(Math.log10(absoluteError));
  const digitsToKeep = Math.max(0, -order);
  const rounded = number.toFixed(digitsToKeep);
  
  return {
    original: number,
    relativeErrorPercent: relativeErrorPercent,
    absoluteError: absoluteError,
    decimalPlaces: digitsToKeep,
    rounded: parseFloat(rounded),
    roundedStr: rounded
  };
};

export const roundByAbsoluteError = (number, absoluteError) => {
  const order = Math.floor(Math.log10(absoluteError));
  const digitsToKeep = Math.max(0, -order);
  const rounded = number.toFixed(digitsToKeep);
  const roundedError = Math.pow(10, order);
  
  return {
    original: number,
    absoluteError: absoluteError,
    decimalPlaces: digitsToKeep,
    rounded: parseFloat(rounded),
    roundedError: roundedError,
    resultStr: `${rounded} ± ${roundedError}`
  };
};

export const findLimitErrors = (number) => {
  const str = number.toString();
  let digitCount = 0;
  let decimalPos = str.indexOf('.');
  
  if (decimalPos === -1) {
    digitCount = str.length;
  } else {
    digitCount = str.length - 1;
  }
  
  const lastDigitOrder = -Math.floor(Math.log10(Math.abs(number))) + digitCount - 1;
  const absoluteError = Math.pow(10, -lastDigitOrder) / 2;
  const relativeError = absoluteError / Math.abs(number);
  
  return {
    number: number,
    absoluteError: absoluteError,
    relativeError: relativeError,
    relativeErrorPercent: relativeError * 100,
    absoluteErrorExp: absoluteError.toExponential(4),
    relativeErrorExp: (relativeError * 100).toFixed(6) + '%'
  };
};