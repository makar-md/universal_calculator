/**
* Численное интегрироание методом Ньютона-Котесса
* Аналитический вариант
* @param f функция
* @param n количество шагов
* @param a граница решения уравнения
* @param b граница решения уравнения
*
* @returns число, резульат интегрирования
*/
export const IntegrationNewtonCotes = (f, a, b, n) => {
    
    let y = []                      // массив для значений y
    let start = Math.min(a, b)      // границы интегрирования
    let end = Math.max(a, b)        // границы интегрирования
    let h = (end - start) / n       // шаг
    
    // заполнение массива y
    for(let i = start; i <= end; i += h){
        y.push(f(i));
    }
    
    // вычисление коэффицентов
    let weights, denom
    if(n === 1) { weights = [1, 1]; denom = 2 }
    else if(n === 2) { weights = [1, 4, 1]; denom = 6 }
    else if(n === 3) { weights = [1, 3, 3, 1]; denom = 8 }
    else if(n === 4) { weights = [7, 32, 12, 32, 7]; denom = 90 }
    else if(n === 5) { weights = [19, 75, 50, 50, 75, 19]; denom = 288 }
    else if(n === 6) { weights = [41, 216, 27, 272, 27, 216, 41]; denom = 840 }
    else { weights = [1, 4, 1]; denom = 6 }
    
    // вычисление результата
    let sum = 0
    for(let i = 0; i < y.length; i++){
        sum += weights[i] * y[i]
    }
    let result = (end - start) * sum / denom;
    return result
};

/**
* Численное интегрироание методом Ньютона-Котесса
* Табличный вариант
* @param x массивы точек x
* @param y массив точек y
*
* @returns число, резульат интегрирования
*/
export const IntegrationNewtonCotesTable = (x, y) => {
    let h = x[1] - x[0];        // шаг
    let n = y.length -1;        // количество шагов

    // вычисление коэффицентов
    let weights, denom
    if(n === 1) { weights = [1, 1]; denom = 2 }
    else if(n === 2) { weights = [1, 4, 1]; denom = 6 }
    else if(n === 3) { weights = [1, 3, 3, 1]; denom = 8 }
    else if(n === 4) { weights = [7, 32, 12, 32, 7]; denom = 90 }
    else if(n === 5) { weights = [19, 75, 50, 50, 75, 19]; denom = 288 }
    else if(n === 6) { weights = [41, 216, 27, 272, 27, 216, 41]; denom = 840 }
    else { weights = [1, 4, 1]; denom = 6 }
    
    // вычисление результата
    let sum = 0
    for(let i = 0; i < y.length; i++){
        sum += weights[i] * y[i]
    }
    
    let result = (y[y.length -1 ] - y[0]) * sum / denom
    return result
};


