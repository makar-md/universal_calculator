/**
* Численное решение систем линейных уравнений методом простых итераций
* Аналитический вариант
* @param matrix матрица коэффициентов системы
* @param b вектор правой части
* @param eps точность вычисления
* @param maxIter максимальное количество итераций
*
* @returns объект, содержащий массив шагов, решение, количество итераций и норму матрицы
*/
export const iterationSystem = (matrix, b, eps, maxIter = 1000) => {
  const n = matrix.length;                  // размерность системы
  let x = new Array(n).fill(0);             // текущее приближение (начальное)
  let xPrev = new Array(n).fill(0);         // предыдущее приближение
  let steps = [];                           // массив для хранения шагов
  let iterations = 0;                       // счетчик итераций
  
  const B = Array(n).fill().map(() => Array(n).fill(0));  // матрица B
  const c = new Array(n);                                 // вектор c
  
  // копирование матрицы и вектора
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        B[i][j] = matrix[i][j];
    }
    c[i] = b[i];
  }
  
  // вычисление нормы матрицы B (максимум суммы по строкам)
  let normB = 0;
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += Math.abs(B[i][j]);
    }
    normB = Math.max(normB, rowSum);
  }
  
  // сохранение начального приближения
  steps.push({
    iteration: 0,
    x: [...x],
    error: null,
    normB: normB
  });
  
  // основной итерационный процесс
  while (iterations < maxIter) {
    // сохранение предыдущего приближения
    for (let i = 0; i < n; i++) {
      xPrev[i] = x[i];
    }
    
    // вычисление нового приближения по формуле x = B*x + c
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += B[i][j] * xPrev[j];
      }
      x[i] = sum + c[i];
    }
    
    iterations++;
    
    // вычисление погрешности как максимальной разницы между приближениями
    let error = 0;
    for (let i = 0; i < n; i++) {
      error = Math.max(error, Math.abs(x[i] - xPrev[i]));
    }
    
    // сохранение данных текущего шага
    steps.push({
      iteration: iterations,
      x: [...x],
      error: error
    });
    
    // проверка достижения заданной точности
    if (error < eps) break;
  }
  
  return {
    steps: steps,                         
    solution: x,                          
    iterations: iterations,               
    normB: normB                          
  };
};

/**
* Создание системы из строк уравнений
* Аналитический вариант
* @param equations массив строк уравнений
*
* @returns объект, содержащий матрицу коэффициентов и вектор правой части
*/
export const createSystemFromEquations = (equations) => {
  const n = equations.length;                                 // количество уравнений
  const matrix = Array(n).fill().map(() => Array(n).fill(0)); // матрица коэффициентов
  const b = new Array(n);                                     // вектор правой части
  
  // парсинг каждого уравнения
  for (let i = 0; i < n; i++) {
    const { coefficients, b: freeTerm } = parseEquation(equations[i], n);
    for (let j = 0; j < n; j++) {
      matrix[i][j] = coefficients[j];
    }
    b[i] = freeTerm;
  }
  
  return { matrix, b };
};

export const parseEquation = (eq, n) => {
  let equation = eq.replace(/\s/g, '');
  let [left, right] = equation.split('=');
  const b = parseFloat(right);
  const coefficients = new Array(n).fill(0);
  
  const terms = left.match(/[+-]?[^+-]+/g);
  
  for (let term of terms) {
    if (term === '') continue;
    
    if (term.includes('x')) {
      const match = term.match(/([+-]?\d*\.?\d*)(x\d+)/);
      if (match) {
        let coeff = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1]);
        const varIndex = parseInt(match[2].substring(1)) - 1;
        coefficients[varIndex] += coeff;
      }
    }
  }
  
  return { coefficients, b };
};