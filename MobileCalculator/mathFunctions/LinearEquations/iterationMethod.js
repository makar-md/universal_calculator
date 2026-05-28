// mathFunctions/iterationMethod.js
export const iterationMethod = (f, a, b, eps) => {
  let x0 = (a + b) / 2;
  
  // Вычисляем производную для подбора lambda
  const derivative = (x) => {
    const h = 1e-7;
    return (f(x + h) - f(x)) / h;
  };
  
  const df0 = derivative(x0);
  
  // Подбираем lambda
  let lambda;
  if (Math.abs(df0) > 1e-10) {
    lambda = 1 / df0;
  } else {
    lambda = 0.1;
  }
  
  // Проверка сходимости
  const phiDerivative = Math.abs(1 - lambda * df0);
  if (phiDerivative >= 1) {
    console.warn(`Условие сходимости может не выполняться: |φ'(x)| = ${phiDerivative}`);
  }
  
  let x = x0;
  let stepArray = [];
  let stepCount = 0;
  
  while (true) {
    const fx = f(x);
    const xNext = x - lambda * fx;
    const diff = Math.abs(xNext - x);
    
    stepCount++;
    
    stepArray.push({
      step: stepCount,
      x: x,
      fx: fx,
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
    iterations: stepCount,
    lambda: lambda
  };
};