export const bisectionMethod = (f, a, b, eps) => {
  let fa = f(a);
  let fb = f(b);

  if (fa * fb > 0) {
    throw new Error("f(a) * f(b) > 0");
  }

  let left = a;
  let right = b;
  let mid = left;

  let stepArray = [];
  let stepCount = 0;

  while ((right - left) / 2 > eps) {
    mid = (left + right) / 2;
    const fmid = f(mid);
    stepCount++;

    stepArray.push({
      step: stepCount,
      a: left,
      b: right,
      d: Math.abs(right - left),
      mid: mid,
      fa: fa,
      fb: fb,
      fmid: fmid
    });

    if (fa * fmid <= 0) {
      right = mid;
      fb = fmid;
    } else {
      left = mid;
      fa = fmid;
    }

    if (stepCount > 1000) break;
  }

  return {
    steps: stepArray,
    root: mid,
    iterations: stepCount
  };
};