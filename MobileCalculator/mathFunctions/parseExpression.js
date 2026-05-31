import { create, all } from 'mathjs'

const math = create(all)

/**
* Парсинг математического выражения в функцию
* Аналитический вариант
* @param expr строковое выражение (например: "x^2 + 2*x + 1")
*
* @returns функция, вычисляющая значение выражения при заданном x
*/
export const parseExpression = (expr) => {
  // подготовка строки выражения
  const prepared = expr
    .toLowerCase()                    // приведение к нижнему регистру
    .replace(/ln/g, "Math.log")       // замена натурального логарифма
    .replace(/sin/g, "Math.sin")      // замена синуса
    .replace(/cos/g, "Math.cos")      // замена косинуса
    .replace(/tan/g, "Math.tan")      // замена тангенса
    .replace(/\^/g, "**");            // замена степени на оператор JavaScript

  // возврат функции, вычисляющей значение
  return (x) => {
    try {
      // создание и вызов функции с параметром x
      return Function("x", `return ${prepared}`)(x);
    } catch (e) {
      throw new Error("Ошибка парсинга функции");
    }
  };
};