export const IntegrationTrapeze = (f, a, b, n) => {
    console.log('Полученные параметры:', { f: typeof f, a, b, n });
    let start = Math.min(a, b);
    let end = Math.max(a, b);
    let h = (end - start) / n;
    
    let arr = [];
    for(let i = start; i <= end; i += h) {  // <= чтобы включить последнюю точку
        arr.push(f(i));
    }
    
    // Метод трапеций: (h/2) * (y0 + 2*y1 + 2*y2 + ... + 2*yn-1 + yn)
    let sum = 0;
    for(let i = 1; i < arr.length - 1; i++) {
        sum += arr[i];  // Суммируем внутренние точки
    }
    
    let result = (h / 2) * (arr[0] + 2 * sum + arr[arr.length - 1]);
    return result;
};