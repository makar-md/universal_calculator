// mathFunctions/NewtonMethod.js
export const NewtonMethod = (f, a, b, eps) => {
  let start = Math.min(a, b);
  let end = Math.max(a, b);
  let x = (start + end) / 2;
  
  // Численное дифференцирование
  const derivative = (x) => {
    const h = 1e-7;
    return (f(x + h) - f(x)) / h;
  };
  
  let stepArray = [];
  let stepCount = 0;
  
  while (true) {
    const fx = f(x);
    const dfx = derivative(x);
    
    if (Math.abs(dfx) < 1e-12) {
      throw new Error("Производная близка к нулю. Метод Ньютона не сходится");
    }
    
    const xNext = x - fx / dfx;
    const diff = Math.abs(xNext - x);
    
    stepCount++;
    
    stepArray.push({
      step: stepCount,
      x: x,
      fx: fx,
      dfx: dfx,
      xNext: xNext,
      diff: diff
    });
    
    if (diff < eps) break;
    
    x = xNext;
    
    if (!isFinite(xNext)) {
      throw new Error("Метод расходится");
    }
    
    if (stepCount > 1000) {
      throw new Error("Превышено максимальное количество итераций");
    }
  }
  
  return {
    steps: stepArray,
    root: x,
    iterations: stepCount
  };
};