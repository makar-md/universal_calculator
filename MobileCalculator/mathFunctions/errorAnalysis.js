/**
* Сравнение точности двух приближённых равенств
* Аналитический вариант
* @param exact1 точное значение первого числа
* @param approx1 приближённое значение первого числа
* @param exact2 точное значение второго числа
* @param approx2 приближённое значение второго числа
*
* @returns объект, содержащий погрешности обоих равенств и вывод о точности
*/
export const compareEqualities = (exact1, approx1, exact2, approx2) => {
  // абсолютная погрешность первого равенства
  const error1 = Math.abs(exact1 - approx1);
  // относительная погрешность первого равенства
  const relativeError1 = error1 / Math.abs(exact1);
  
  // абсолютная погрешность второго равенства
  const error2 = Math.abs(exact2 - approx2);
  // относительная погрешность второго равенства
  const relativeError2 = error2 / Math.abs(exact2);
  
  // определение, какое равенство точнее (меньше относительная погрешность)
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

/**
* Округление числа по заданной относительной погрешности
* Аналитический вариант
* @param number исходное число
* @param relativeErrorPercent относительная погрешность в процентах
*
* @returns объект, содержащий исходное число, погрешности и округлённый результат
*/
export const roundByRelativeError = (number, relativeErrorPercent) => {
  const relativeError = relativeErrorPercent / 100;       // перевод в доли
  const absoluteError = Math.abs(number) * relativeError; // абсолютная погрешность
  const order = Math.floor(Math.log10(absoluteError));    // порядок погрешности
  const digitsToKeep = Math.max(0, -order);               // количество знаков после запятой
  const rounded = number.toFixed(digitsToKeep);           // округление
  
  return {
    original: number,
    relativeErrorPercent: relativeErrorPercent,
    absoluteError: absoluteError,
    decimalPlaces: digitsToKeep,
    rounded: parseFloat(rounded),
    roundedStr: rounded
  };
};

/**
* Округление числа по заданной абсолютной погрешности
* Аналитический вариант
* @param number исходное число
* @param absoluteError абсолютная погрешность
*
* @returns объект, содержащий исходное число, погрешности и округлённый результат
*/
export const roundByAbsoluteError = (number, absoluteError) => {
  const order = Math.floor(Math.log10(absoluteError));    // порядок погрешности
  const digitsToKeep = Math.max(0, -order);               // количество знаков после запятой
  const rounded = number.toFixed(digitsToKeep);           // округление числа
  const roundedError = Math.pow(10, order);               // округлённая погрешность
  
  return {
    original: number,
    absoluteError: absoluteError,
    decimalPlaces: digitsToKeep,
    rounded: parseFloat(rounded),
    roundedError: roundedError,
    resultStr: `${rounded} ± ${roundedError}`
  };
};

/**
* Нахождение предельных абсолютной и относительной погрешностей
* Аналитический вариант
* @param number приближённое число, все цифры которого верные
*
* @returns объект, содержащий число, предельные погрешности и их представления
*/
export const findLimitErrors = (number) => {
  const str = number.toString();                       // строковое представление числа
  let digitCount = 0;                                  // количество значащих цифр
  let decimalPos = str.indexOf('.');                   // позиция десятичной точки
  
  // подсчёт количества значащих цифр
  if (decimalPos === -1) {
    digitCount = str.length;                           // целое число
  } else {
    digitCount = str.length - 1;                       // число с дробной частью
  }
  
  // порядок последнего верного разряда
  const lastDigitOrder = -Math.floor(Math.log10(Math.abs(number))) + digitCount - 1;
  // предельная абсолютная погрешность (половина единицы последнего разряда)
  const absoluteError = Math.pow(10, -lastDigitOrder) / 2;
  // предельная относительная погрешность
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