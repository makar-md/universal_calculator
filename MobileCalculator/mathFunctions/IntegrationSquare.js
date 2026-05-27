export const IntegrationSquare = (f, a, b, n) => {
    console.log('Полученные параметры:', { f: typeof f, a, b, n });
    let arr = []
    let start = Math.min(a,b)
    let end = Math.max(a,b)
    let h = (end - start)/n
    for(let i = start; i < end; i+=h){
        arr.push(f(i));
    }
    let eps = 0;
    for(let item of arr){
        eps += item;
    }

    let result = h * eps;
    return result
};

export const IntegrationSquareTable = (x, y) => {
    let eps = 0;
    let h = x[1] - x[0]
    for(let item of y){
        eps += item;
    }

    let result = h * eps;
    return result
};