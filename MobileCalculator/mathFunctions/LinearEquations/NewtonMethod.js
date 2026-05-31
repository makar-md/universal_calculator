/**
* Численное решение линейных уравнений методом Ньютона (касательных)
* Аналитический вариант
* @param f   функция
* @param a   граница решения уравнения
* @param b   граница решения уравнения
* @param eps точность
*
* @returns объект, содержащий массив шагов, найденный корень и количество итераций
*/
export const NewtonMethod = (f, a, b, eps) => {
  let start = Math.min(a, b);       // левая граница интервала
  let end = Math.max(a, b);         // правая граница интервала
  let x = (start + end) / 2;        // начальное приближение (середина интервала)
  
  // Численное дифференцирование
  const derivative = (x) => {
    const h = 1e-7;                 
    return (f(x + h) - f(x)) / h;
  };
  
  let stepArray = [];               // массив для хранения шагов вычисления
  let stepCount = 0;                // счетчик итераций
  
  while (true) {
    const fx = f(x);                // значение функции в текущей точке
    const dfx = derivative(x);      // значение производной в текущей точке
    
    // проверка: производная не должна быть равна нулю
    if (Math.abs(dfx) < 1e-12) {
      throw new Error("Производная близка к нулю. Метод Ньютона не сходится");
    }
    
    const xNext = x - fx / dfx;       // следующее приближение по формуле Ньютона
    const diff = Math.abs(xNext - x); // погрешность на текущей итерации
    
    stepCount++;
    
    // сохраняем данные текущего шага
    stepArray.push({
      step: stepCount,
      x: x,
      fx: fx,
      dfx: dfx,
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
    steps: stepArray,               
    root: x,                        
    iterations: stepCount           
  };
};