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