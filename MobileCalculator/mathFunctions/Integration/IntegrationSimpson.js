/**
* Численное интегрироание методом Симпсона
* Аналитический вариант
* @param f функция
* @param n количество шагов
* @param a граница решения уравнения
* @param b граница решения уравнения
*
* @returns число, резульат интегрирования
*/
export const IntegrationSimpson = (f, a, b, n) => {
    let y = []                      // массив для значений y
    let start = Math.min(a, b)      // границы интегрирования
    let end = Math.max(a, b)        // границы интегрирования
    let h = (end - start) / n       // шаг

    // заполнение массива y
    for(let i = start; i <= end; i+=h){
        y.push(f(i));
    }
    
    //результат четных коэффицентов
    let even = 0;
    //результат нечетных коэффицентов
    let not_even = 0;

    // вычисление
    for(let i = 1; i < y.length - 1; i++){
        if (i % 2 === 0) {
            even += y[i];
        } else {
            not_even += y[i];
        }
    }
    
    // вычисление результата
    let result = (h / 3) * (y[0] + y[y.length - 1] + 2 * even + 4 * not_even)
    return result
};

/**
* Численное интегрироание методом Симпсона
* Табличный вариант
* @param x массив точек x
* @param y массив точек y
*
* @returns число, резульат интегрирования
*/
export const IntegrationSimpsonTable = (x,y) => {
    let h = x[1] - x[0]     // шаг
    let even = 0;           // результат четных коэффицентов
    let not_even = 0;       // результат нечетных коэффицентов

    // вычисление
    for(let i = 1; i < y.length - 1; i++){
        if (i % 2 === 0) {
            even += y[i];
        } else {
            not_even += y[i];
        }
    }

    // вычисление результата
    let result = (h / 3) * (y[0] + y[y.length - 1] + 2 * even + 4 * not_even)
    return result
};
