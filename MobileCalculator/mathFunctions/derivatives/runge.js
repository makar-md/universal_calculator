export const Runge = (func, y_0, h, a, b) => {
    let steps = [];
    let y = [y_0];
    let xValues = [];
    let start = Math.min(a, b);
    let end = Math.max(a, b);
    
    for (let x = start; x <= end + 0.000001; x += h) {
        xValues.push(x);
    }
    
    for (let i = 1; i < xValues.length; i++) {
        const x_prev = xValues[i - 1];
        const y_prev = y[i - 1];
        
        const r1 = h * func(x_prev, y_prev);
        const r2 = h * func(x_prev + h/2, y_prev + r1/2);
        const r3 = h * func(x_prev + h/2, y_prev + r2/2);
        const r4 = h * func(x_prev + h, y_prev + r3);
        
        const y_next = y_prev + (r1 + 2*r2 + 2*r3 + r4) / 6;
        y.push(y_next);
        
        steps.push({
            iteration: i,
            x: x_prev,
            y: y_prev,
            r1, r2, r3, r4
        });
    }
    
    return steps;
};