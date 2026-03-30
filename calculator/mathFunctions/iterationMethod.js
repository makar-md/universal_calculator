export const iterationMethod = (f, a, b, eps) => {
  let x = (a + b) / 2;
  let lambda = 0.1; 

  let stepArray = [];
  let stepCount = 0;

  while (true) {
    const fx = f(x);
    const xNext = x - lambda * fx;

    stepCount++;

    stepArray.push({
      step: stepCount,
      x: x,
      fx: fx,
      xNext: xNext,
      diff: Math.abs(xNext - x)
    });

    if (Math.abs(xNext - x) < eps) {
      return {
        steps: stepArray,
        root: xNext,
        iterations: stepCount
      };
    }

    x = xNext;

    if (stepCount > 1000) break;
  }

  return {
    steps: stepArray,
    root: x,
    iterations: stepCount
  };
};