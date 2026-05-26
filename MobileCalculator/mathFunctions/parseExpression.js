import { create, all } from 'mathjs'

const math = create(all)

export const parseExpression = (expr) => {
  const prepared = expr
    .toLowerCase()
    .replace(/ln/g, "Math.log")
    .replace(/sin/g, "Math.sin")
    .replace(/cos/g, "Math.cos")
    .replace(/tan/g, "Math.tan")
    .replace(/\^/g, "**");

  return (x) => {
    try {
      return Function("x", `return ${prepared}`)(x);
    } catch (e) {
      throw new Error("Ошибка парсинга функции");
    }
  };
};