export const iterationMethod = (f, a, b, eps) => {
  let x = (a + b) / 2; // старт
  const lambda = 0.1;  // маленький шаг

  let steps = [];
  let stepCount = 0;

  while (true) {
    const fx = f(x);
    const xNext = x - lambda * fx;
    const diff = Math.abs(xNext - x);

    if (!isFinite(xNext)) {
      throw new Error("Метод расходится");
    }

    steps.push({
      step: stepCount,
      x: x,
      fx: fx,
      xNext: xNext,
      diff: diff
    });

    if (diff < eps) break;

    x = xNext;
    stepCount++;

    if (stepCount > 1000) {
      throw new Error("Слишком много итераций");
    }
  }

  return {
    steps,
    root: x,
    iterations: stepCount
  };
};