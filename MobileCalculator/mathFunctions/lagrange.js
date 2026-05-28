// mathFunctions/lagrange.js
import { simplify } from "mathjs";

// Численное вычисление
export const LagrangePolynomial = (x, y) => {
    return (t) => {
        let result = 0;

        for (let i = 0; i < x.length; i++) {
            let li = 1;

            for (let j = 0; j < x.length; j++) {
                if (j !== i) {
                    li *= (t - x[j]) / (x[i] - x[j]);
                }
            }

            result += y[i] * li;
        }

        return result;
    };
};

// Красивый математический полином
export const LagrangePolynomialString = (x, y) => {
    let expression = "";

    for (let i = 0; i < x.length; i++) {
        let term = `${y[i]}`;

        for (let j = 0; j < x.length; j++) {
            if (j !== i) {
                term += ` * ((x - ${x[j]}) / (${x[i] - x[j]}))`;
            }
        }

        expression += expression ? ` + (${term})` : `(${term})`;
    }

    return simplify(expression).toString();
};

// Расчет погрешности интерполяции
export const LagrangeError = (x, y, x0, actualValue = null) => {
    // Если передано точное значение функции, считаем фактическую погрешность
    if (actualValue !== null) {
        const interpolatedValue = LagrangePolynomial(x, y)(x0);
        return Math.abs(actualValue - interpolatedValue);
    }
    
    // Иначе оцениваем погрешность по формуле Рунге
    // (приближенная оценка, используя разные наборы узлов)
    
    if (x.length < 3) {
        return { type: "warning", message: "Недостаточно точек для оценки погрешности (минимум 3)" };
    }
    
    try {
        // Используем все точки
        const valueAll = LagrangePolynomial(x, y)(x0);
        
        // Используем все точки кроме последней
        const xReduced = x.slice(0, -1);
        const yReduced = y.slice(0, -1);
        const valueReduced = LagrangePolynomial(xReduced, yReduced)(x0);
        
        // Оценка погрешности по Рунге
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

// Расчет максимальной теоретической погрешности (требует производную)
export const LagrangeMaxError = (x, y, maxDerivative, x0) => {
    // Остаточный член: R_n(x) = f^(n+1)(ξ)/(n+1)! * Π(x - x_i)
    const n = x.length - 1;
    
    // Вычисляем произведение (x - x_i)
    let product = 1;
    for (let i = 0; i <= n; i++) {
        product *= Math.abs(x0 - x[i]);
    }
    
    // Максимальная погрешность
    const maxError = (maxDerivative / factorial(n + 1)) * product;
    
    return maxError;
};

const factorial = (num) => {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
};