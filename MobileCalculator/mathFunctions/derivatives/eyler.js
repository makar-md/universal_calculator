export const Eyler = (func, y_0, h, a, b) =>{
    let y = []
    let xValues =[]
    let start =  Math.min(a, b)
    let end =  Math.max(a, b)
    for(let i = start; i <= end; i+=h){
        xValues.push(i)
    }

    y[0] = y_0 

    for (let i = 1; i < xValues.length; i++) {
        const x_prev = xValues[i - 1];
        const y_prev = y[i - 1];
        const derivative = func(x_prev, y_prev);  
        y[i] = y_prev + h * derivative;
    }

    return {
        xValues: xValues,
        yValues: y,
    };
}