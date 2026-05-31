/**
* Численное интегрироание методом Трапеций
* Аналитический вариант
* @param f функция
* @param n количество шагов
* @param a граница решения уравнения
* @param b граница решения уравнения
*
* @returns число, резульат интегрирования
*/
export const IntegrationTrapeze = (f, a, b, n) => {
    let start = Math.min(a, b);     // границы интегрирования
    let end = Math.max(a, b);       // границы интегрирования
    let h = (end - start) / n;      // шаг
    
    let y = [];                   // значения y
    for(let i = start; i <= end; i += h) { 
        y.push(f(i));
    }
    
    // Метод трапеций: (h/2) * (y0 + 2*y1 + 2*y2 + ... + 2*yn-1 + yn)
    let sum = 0;
    for(let i = 1; i < y.length - 1; i++) {
        sum += y[i];  // Суммируем внутренние точки
    }
    
    let result = (h / 2) * (y[0] + 2 * sum + y[y.length - 1]);
    return result;
};

/**
* Численное интегрироание методом Трапеций
* Табличный вариант
* @param x массив точек x
* @param y массив точек y
*
* @returns число, резульат интегрирования
*/
export const IntegrationTrapezeTable = (x, y) => {
    let h = x[1] - x[0];        // шаг
    
    // Метод трапеций: (h/2) * (y0 + 2*y1 + 2*y2 + ... + 2*yn-1 + yn)
    let sum = 0;
    for(let i = 1; i < y.length - 1; i++) {
        sum += y[i];  // Суммируем внутренние точки
    }
    
    let result = (h / 2) * (y[0] + 2 * sum + y[y.length - 1]);
    return result;
};