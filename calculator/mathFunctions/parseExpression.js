import { create, all } from 'mathjs'

const math = create(all)

export function parseExpression(expr) {
  let compiled

  try {
    compiled = math.compile(expr)
  } catch (e) {
    throw new Error('Неверное выражение')
  }

  return (x) => {
    try {
      const result = compiled.evaluate({ x })

      if (!isFinite(result)) {
        throw new Error('Ошибка вычисления')
      }

      return result
    } catch (e) {
      throw new Error('Ошибка вычисления')
    }
  }
}