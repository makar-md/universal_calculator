/**
* Численное решение линейных уравнений методом простых итераций
* Аналитический вариант
* @param f   функция
* @param a   граница решения уравнения
* @param b   граница решения уравнения
* @param eps точность
*
* @returns объект, содержащий массив шагов, найденный корень, количество итераций и параметр lambda
*/
export const iterationMethod = (f, a, b, eps) => {
  let x0 = (a + b) / 2;             // начальное приближение (середина интервала)
  
  // Вычисляем производную для подбора lambda
  const derivative = (x) => {
    const h = 1e-7;                 
    return (f(x + h) - f(x)) / h;
  };
  
  const df0 = derivative(x0);       // значение производной в начальной точке
  
  // Подбираем параметр lambda для обеспечения сходимости
  let lambda;
  if (Math.abs(df0) > 1e-10) {
    lambda = 1 / df0;               // оптимальный шаг для квадратичной сходимости
  } else {
    lambda = 0.1;                   // запасной вариант при малой производной
  }
  
  // Проверка условия сходимости |1 - λ*f'(x)| < 1
  const phiDerivative = Math.abs(1 - lambda * df0);
  if (phiDerivative >= 1) {
    console.warn(`Условие сходимости может не выполняться: |φ'(x)| = ${phiDerivative}`);
  }
  
  let x = x0;                         // текущее приближение
  let stepArray = [];                 // массив для хранения шагов вычисления
  let stepCount = 0;                  // счетчик итераций
  
  while (true) {
    const fx = f(x);                  // значение функции в текущей точке
    const xNext = x - lambda * fx;    // следующее приближение по формуле итераций
    const diff = Math.abs(xNext - x); // погрешность на текущей итерации
    
    stepCount++;
    
    // сохраняем данные текущего шага
    stepArray.push({
      step: stepCount,
      x: x,
      fx: fx,
      xNext: xNext,
      diff: diff
    });
    
    if (diff < eps) break;          // достигнута требуемая точность
    
    x = xNext;                      // переход к следующему приближению
    
    if (!isFinite(xNext)) {
      throw new Error("Метод расходится");
    }
    
    if (stepCount > 1000) {
      throw new Error("Превышено максимальное количество итераций");
    }
  }
  
  return {
    steps: stepArray,               // массив всех шагов вычисления
    root: x,                        // найденный корень
    iterations: stepCount,          // количество выполненных итераций
    lambda: lambda                  // использованный параметр релаксации
  };
};