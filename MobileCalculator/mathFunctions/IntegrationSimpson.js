export const IntegrationSimpson = (f, a, b, n) => {
    console.log('Полученные параметры:', { f: typeof f, a, b, n });
    let y = []
    let start = Math.min(a,b)
    let end = Math.max(a,b)
    let h = (end - start)/n
    for(let i = start; i <= end; i+=h){
        y.push(f(i));
    }
    
    let even = 0;
    let not_even = 0;

     for(let i = 1; i < y.length - 1; i++){
        if (i % 2 === 0) {
            even += y[i];
        } else {
            not_even += y[i];
        }
    }
    
    let result = (h / 3) * (y[0] + y[y.length - 1] + 2 * even + 4 * not_even)
    return result
};