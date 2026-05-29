// mathFunctions/iterationSystem.js
export const iterationSystem = (matrix, b, eps, maxIter = 1000) => {
  const n = matrix.length;
  let x = new Array(n).fill(0);
  let xPrev = new Array(n).fill(0);
  let steps = [];
  let iterations = 0;
  
  const B = Array(n).fill().map(() => Array(n).fill(0));
  const c = new Array(n);
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        B[i][j] = matrix[i][j];
    }

    c[i] = b[i];
    }
  
  let normB = 0;
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += Math.abs(B[i][j]);
    }
    normB = Math.max(normB, rowSum);
  }
  
  steps.push({
    iteration: 0,
    x: [...x],
    error: null,
    normB: normB
  });
  
  while (iterations < maxIter) {
    for (let i = 0; i < n; i++) {
      xPrev[i] = x[i];
    }
    
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += B[i][j] * xPrev[j];
      }
      x[i] = sum + c[i];
    }
    
    iterations++;
    
    let error = 0;
    for (let i = 0; i < n; i++) {
      error = Math.max(error, Math.abs(x[i] - xPrev[i]));
    }
    
    steps.push({
      iteration: iterations,
      x: [...x],
      error: error
    });
    
    if (error < eps) break;
  }
  
  return {
    steps: steps,
    solution: x,
    iterations: iterations,
    normB: normB
  };
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

export const createSystemFromEquations = (equations) => {
  const n = equations.length;
  const matrix = Array(n).fill().map(() => Array(n).fill(0));
  const b = new Array(n);
  
  for (let i = 0; i < n; i++) {
    const { coefficients, b: freeTerm } = parseEquation(equations[i], n);
    for (let j = 0; j < n; j++) {
      matrix[i][j] = coefficients[j];
    }
    b[i] = freeTerm;
  }
  
  return { matrix, b };
};