/**
* Численное интегрироание методом Прямоугольников
* Аналитический вариант
* @param f функция
* @param n количество шагов
* @param a граница решения уравнения
* @param b граница решения уравнения
*
* @returns число, резульат интегрирования
*/
export const IntegrationSquare = (f, a, b, n) => {
    let y = []
    let start = Math.min(a,b)
    let end = Math.max(a,b)
    let h = (end - start)/n
    for(let i = start; i < end; i+=h){
        y.push(f(i));
    }
    let eps = 0;
    for(let i = 0; i < y.length; i++){
        eps += y[i];
    }

    let result = h * eps;
    return result
};


/**
* Численное интегрироание методом Прямоугольников
* Табличный вариант
* @param x массив точек x
* @param y массив точек y
*
* @returns число, резульат интегрирования
*/
export const IntegrationSquareTable = (x, y) => {
    let eps = 0;            // сумма всех элементов
    let h = x[1] - x[0]     // шаг

    // сумирование
    for(let item of y){
        eps += item;
    }

    // результат
    let result = h * eps;
    return result
};