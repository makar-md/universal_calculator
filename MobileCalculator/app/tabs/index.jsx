import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../../mathFunctions/parseExpression";
import { iterationMethod } from "../../mathFunctions/LinearEquations/iterationMethod";
import { bisectionMethod } from "../../mathFunctions/LinearEquations/bisectionMethod";
import { NewtonMethod } from "../../mathFunctions/LinearEquations/NewtonMethod";
import { Link } from 'expo-router';
import "../../global.css";

export default function Index() {
  const [text, setText] = useState('');                              // состояние для хранения строки функции
  const [interval, setInterval] = useState('');                      // состояние для хранения интервала [a; b]
  const [accuracy, setAccuracy] = useState('');                      // состояние для хранения точности вычислений
  const [steps, setSteps] = useState([]);                            // состояние для хранения пошаговых данных вычислений
  const [result, setResult] = useState(null);                        // состояние для хранения результата (корень и количество итераций)
  const [method, setMethod] = useState(null);                        // состояние для хранения активного метода решения
  const [lambda, setLambda] = useState(null);                        // состояние для хранения параметра lambda (для метода итераций)

  /**
   * сбор и валидация данных из полей ввода
   */
  function getData() {
    const f = parseExpression(text);

    // Парсим интервал
    let a, b;
    if (interval.includes(';')) {
      [a, b] = interval.split(';').map(Number);
    } else if (interval.includes(',')) {
      [a, b] = interval.split(',').map(Number);
    } else {
      a = parseFloat(interval);
      b = a + 1;
    }

    let eps;
    try {
      eps = Function(`return ${accuracy.replace(/\^/g, '**')}`)();
    } catch (e) {
      eps = parseFloat(accuracy);
    }

    if (isNaN(a) || isNaN(b) || isNaN(eps)) {
      setSteps([]);
      setResult(null);
      alert("Пожалуйста, убедитесь, что все поля введены корректно!");
      return null;
    }

    const data = {
      f: f,
      a: a,
      b: b,
      eps: eps
    };
    return data;
  }

  /**
   * обработчик метода половинного деления (дихотомии)
   */
  const handleBisection = () => {
    setMethod("bisection");
    setLambda(null);

    try {
      const data = getData();
      if (!data) return;

      const res = bisectionMethod(data.f, data.a, data.b, data.eps);

      setSteps(res.steps);
      setResult({
        root: res.root,
        iterations: res.iterations
      });
    } catch (e) {
      alert("Ошибка: " + e.message);
      setSteps([]);
      setResult(null);
    }
  };

  /**
   * обработчик метода итераций
   */
  const handleIteration = () => {
    setMethod("iteration");
    setLambda(null);

    try {
      const data = getData();
      if (!data) return;

      const res = iterationMethod(data.f, data.a, data.b, data.eps);

      setSteps(res.steps);
      setResult({
        root: res.root,
        iterations: res.iterations
      });
      if (res.lambda) setLambda(res.lambda);

    } catch (e) {
      alert("Ошибка: " + e.message);
      setSteps([]);
      setResult(null);
    }
  };

  /**
   * обработчик метода Ньютона
   */
  const handleNewton = () => {
    setMethod("newton");
    setLambda(null);

    try {
      const data = getData();
      if (!data) return;

      const res = NewtonMethod(data.f, data.a, data.b, data.eps);

      setSteps(res.steps);
      setResult({
        root: res.root,
        iterations: res.iterations
      });

    } catch (e) {
      alert("Ошибка: " + e.message);
      setSteps([]);
      setResult(null);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View className="mt-6 mb-6">
            <Text className="text-[#8E8E93] text-sm">
              Numerical Methods
            </Text>
            <Text className="text-white text-5xl font-bold mt-1">
              Linear Equation
            </Text>
          </View>

          {/* Input Card */}
          <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
            <View className="px-5 py-4 border-b border-[#2C2C2E]">
              <Text className="text-[#8E8E93] text-sm mb-2">
                Функция f(x)
              </Text>
              <TextInput value={text} onChangeText={setText} placeholder="sin(x) + ln(x) + x^2" placeholderTextColor="#8E8E93" className="text-white text-lg" />
            </View>

            <View className="px-5 py-4 border-b border-[#2C2C2E]">
              <Text className="text-[#8E8E93] text-sm mb-2">
                Интервал [a;b]
              </Text>
              <TextInput value={interval} onChangeText={setInterval} placeholder="0;3" placeholderTextColor="#8E8E93" className="text-white text-lg" />
            </View>

            <View className="px-5 py-4">
              <Text className="text-[#8E8E93] text-sm mb-2">
                Точность ε
              </Text>
              <TextInput value={accuracy} onChangeText={setAccuracy} placeholder="0.001" placeholderTextColor="#8E8E93" className="text-white text-lg" />
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3 mb-6">
            <Pressable onPress={handleBisection} className={`flex-1 py-4 rounded-2xl items-center ${method === "bisection" ? "bg-[#0A84FF]" : "bg-[#2C2C2E]"}`} >
              <Text className="text-white font-semibold">
                Дихотомия
              </Text>
            </Pressable>

            <Pressable onPress={handleIteration} className={`flex-1 py-4 rounded-2xl items-center ${method === "iteration" ? "bg-[#0A84FF]" : "bg-[#2C2C2E]"}`} >
              <Text className="text-white font-semibold">
                Итерации
              </Text>
            </Pressable>

            <Pressable onPress={handleNewton} className={`flex-1 py-4 rounded-2xl items-center ${method === "newton" ? "bg-[#0A84FF]" : "bg-[#2C2C2E]"}`}>
              <Text className="text-white font-semibold">
                Ньютон
              </Text>
            </Pressable>
          </View>

          {/* Steps Table */}
          {method && steps.length > 0 && (
            <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6 border border-[#2C2C2E]">

              {/* Header */}
              <View className="px-5 py-4 bg-[#2C2C2E]">
                <Text className="text-white text-lg font-semibold text-center">
                  Пошаговые вычисления
                </Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerClassName="justify-center">
                <View className="flex-1">

                  {/* Заголовки для метода бисекции */}
                  {method === "bisection" && (
                    <View className="flex-row border-b border-[#2C2C2E] bg-[#252527]">
                      <Text className="text-[#8E8E93] text-sm p-3 min-w-20 text-center">
                        Шаг
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">
                        a
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">
                        b
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">
                        mid
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-32 text-center">
                        f(mid)
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-32 text-center">
                        Δ
                      </Text>
                    </View>
                  )}

                  {/* Заголовки для итераций */}
                  {method === "iteration" && (
                    <View className="flex-row border-b border-[#2C2C2E] bg-[#252527]">
                      <Text className="text-[#8E8E93] text-sm p-3 min-w-20 text-center">
                        Шаг
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">
                        xₙ
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-32 text-center">
                        f(xₙ)
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">
                        xₙ₊₁
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-32 text-center">
                        |xₙ₊₁ - xₙ|
                      </Text>
                    </View>
                  )}

                  {/* Заголовки для Ньютона */}
                  {method === "newton" && (
                    <View className="flex-row border-b border-[#2C2C2E] bg-[#252527]">
                      <Text className="text-[#8E8E93] text-sm p-3 min-w-20 text-center">
                        Шаг
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">
                        xₙ
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-32 text-center">
                        f(xₙ)
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-32 text-center">
                        f'(xₙ)
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">
                        xₙ₊₁
                      </Text>

                      <Text className="text-[#8E8E93] text-sm p-3 min-w-32 text-center">
                        |Δx|
                      </Text>
                    </View>
                  )}

                  {/* Строки */}
                  {steps.map((row, i) => (
                    <View key={i} className="flex-row border-b border-[#2C2C2E]">
                      {/* Bisection */}
                      {method === "bisection" && (
                        <>
                          <Text className="text-white text-sm p-3 min-w-20 text-center">
                            {row.step}
                          </Text>

                          <Text className="text-white text-sm p-3 min-w-28 text-center">
                            {row.a?.toFixed(6)}
                          </Text>

                          <Text className="text-white text-sm p-3 min-w-28 text-center">
                            {row.b?.toFixed(6)}
                          </Text>

                          <Text className="text-[#4F8CFF] text-sm p-3 min-w-28 text-center font-semibold">
                            {row.mid?.toFixed(6)}
                          </Text>

                          <Text className="text-[#30D158] text-sm p-3 min-w-32 text-center">
                            {row.fmid?.toExponential(4)}
                          </Text>

                          <Text className="text-[#FF9F0A] text-sm p-3 min-w-32 text-center">
                            {row.d?.toExponential(4) ||
                              (row.b - row.a).toExponential(4)}
                          </Text>
                        </>
                      )}

                      {/* Iteration */}
                      {method === "iteration" && (
                        <>
                          <Text className="text-white text-sm p-3 min-w-20 text-center">
                            {row.step}
                          </Text>

                          <Text className="text-white text-sm p-3 min-w-28 text-center">
                            {row.x?.toFixed(6)}
                          </Text>

                          <Text className="text-[#30D158] text-sm p-3 min-w-32 text-center">
                            {row.fx?.toExponential(4)}
                          </Text>

                          <Text className="text-[#4F8CFF] text-sm p-3 min-w-28 text-center font-semibold">
                            {row.xNext?.toFixed(6)}
                          </Text>

                          <Text className="text-[#FF9F0A] text-sm p-3 min-w-32 text-center">
                            {row.diff?.toExponential(4)}
                          </Text>
                        </>
                      )}

                      {/* Newton */}
                      {method === "newton" && (
                        <>
                          <Text className="text-white text-sm p-3 min-w-20 text-center">
                            {row.step}
                          </Text>

                          <Text className="text-white text-sm p-3 min-w-28 text-center">
                            {row.x?.toFixed(6)}
                          </Text>

                          <Text className="text-[#30D158] text-sm p-3 min-w-32 text-center">
                            {row.fx?.toExponential(4)}
                          </Text>

                          <Text className="text-[#FF375F] text-sm p-3 min-w-32 text-center">
                            {row.dfx?.toExponential(4)}
                          </Text>

                          <Text className="text-[#4F8CFF] text-sm p-3 min-w-28 text-center font-semibold">
                            {row.xNext?.toFixed(6)}
                          </Text>

                          <Text className="text-[#FF9F0A] text-sm p-3 min-w-32 text-center">
                            {row.diff?.toExponential(4)}
                          </Text>
                        </>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Result */}
          {result && (
            <View className="bg-[#1C1C1E] rounded-[28px] p-6 mb-6">
              <Text className="text-[#8E8E93] text-sm mb-2">
                РЕЗУЛЬТАТ
              </Text>

              <Text className="text-white text-4xl font-bold">
                x = {result.root.toFixed(8)}
              </Text>

              <View className="flex-row justify-between mt-4 pt-4 border-t border-[#2C2C2E]">
                <Text className="text-[#8E8E93]">
                  Метод: {method === "bisection" ? "Дихотомии" : method === "iteration" ? "Простых итераций" : "Ньютона"}
                </Text>
                <Text className="text-[#8E8E93]">
                  Итераций: {result.iterations}
                </Text>
              </View>

              {lambda && (
                <View className="mt-2">
                  <Text className="text-[#8E8E93] text-xs">
                    λ (lambda) = {lambda.toFixed(6)}
                  </Text>
                </View>
              )}

              <View className="mt-2">
                <Text className="text-[#8E8E93] text-xs">
                  f(x) = {text}
                </Text>
              </View>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}