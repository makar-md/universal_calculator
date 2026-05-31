import { simplify } from "mathjs";

/**
* Построение интерполяционного полинома Лагранжа
* Численное вычисление
* @param x массив узлов интерполяции
* @param y массив значений функции в узлах
*
* @returns функция, вычисляющая значение полинома в заданной точке
*/
export const LagrangePolynomial = (x, y) => {
    return (t) => {
        let result = 0;                       // накопление суммы

        // перебор всех узлов интерполяции
        for (let i = 0; i < x.length; i++) {
            let li = 1;                       // базисный полином L_i(t)

            // вычисление базисного полинома
            for (let j = 0; j < x.length; j++) {
                if (j !== i) {
                    li *= (t - x[j]) / (x[i] - x[j]);
                }
            }

            result += y[i] * li;              // добавление слагаемого к сумме
        }

        return result;
    };
};

/**
* Построение интерполяционного полинома Лагранжа
* Символьное представление
* @param x массив узлов интерполяции
* @param y массив значений функции в узлах
*
* @returns строка с упрощённым выражением полинома
*/
export const LagrangePolynomialString = (x, y) => {
    let expression = "";                      // накопление строки полинома

    // перебор всех узлов интерполяции
    for (let i = 0; i < x.length; i++) {
        let term = `${y[i]}`;                 // начальное значение терма

        // формирование множителей для текущего базисного полинома
        for (let j = 0; j < x.length; j++) {
            if (j !== i) {
                term += ` * ((x - ${x[j]}) / (${x[i] - x[j]}))`;
            }
        }

        // добавление терма к общему выражению
        expression += expression ? ` + (${term})` : `(${term})`;
    }

    // упрощение выражения с помощью mathjs
    return simplify(expression).toString();
};

/**
* Оценка погрешности интерполяции методом Лагранжа
* Аналитический вариант
* @param x массив узлов интерполяции
* @param y массив значений функции в узлах
* @param x0 точка, в которой вычисляется погрешность
* @param actualValue точное значение функции (опционально)
*
* @returns фактическая погрешность или оценка погрешности по Рунге
*/
export const LagrangeError = (x, y, x0, actualValue = null) => {
    // если передано точное значение, считаем фактическую погрешность
    if (actualValue !== null) {
        const interpolatedValue = LagrangePolynomial(x, y)(x0);
        return Math.abs(actualValue - interpolatedValue);
    }
    
    // проверка: для оценки погрешности нужно минимум 3 точки
    if (x.length < 3) {
        return { type: "warning", message: "Недостаточно точек для оценки погрешности (минимум 3)" };
    }
    
    try {
        // значение полинома, построенного по всем точкам
        const valueAll = LagrangePolynomial(x, y)(x0);
        
        // значение полинома, построенного по всем точкам, кроме последней
        const xReduced = x.slice(0, -1);
        const yReduced = y.slice(0, -1);
        const valueReduced = LagrangePolynomial(xReduced, yReduced)(x0);
        
        // оценка погрешности по Рунге (разность между двумя приближениями)
        const error = Math.abs(valueAll - valueReduced);
        
        return {
            type: "estimate",
            value: error,
            message: `Оценка погрешности (по Рунге): ${error.toExponential(4)}`
        };
    } catch (e) {
        return { type: "error", message: "Не удалось оценить погрешность" };
    }
};
