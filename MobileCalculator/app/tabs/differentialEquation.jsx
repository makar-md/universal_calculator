import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../../mathFunctions/parseExpression";
import { Eyler } from "../../mathFunctions/derivatives/eyler";
import { Runge } from "../../mathFunctions/derivatives/runge";
import "../../global.css";

export default function DifferentialEquations() {
  const [func, setFunc] = useState('');                     // состояние для ввода функции f(x, y)
  const [firstValue, setFirstValue] = useState('');         // состояние для начального условия y₀
  const [interval, setInterval] = useState('');             // состояние для интервала [a; b]
  const [steps, setSteps] = useState('');                   // состояние для количества шагов
  const [result, setResult] = useState(null);               // состояние для хранения результата вычислений
  const [stepsData, setStepsData] = useState([]);           // состояние для хранения пошаговых данных
  const [loading, setLoading] = useState(false);            // состояние загрузки (индикатор выполнения)
  const [activeMethod, setActiveMethod] = useState(null);   // состояние активного метода (подсветка кнопки)

  // список доступных методов решения
  const methods = [
    { id: 'eyler', name: 'Метод Эйлера' },
    { id: 'runge', name: 'Метод Рунге-Кутты 4-го порядка' },
  ];

  /**
  * Парсинг строки функции в функцию от двух переменных (x, y)
  * @param expr - строковое выражение (например: "x + y" или "-y")
  * @returns функция, принимающая (x, y) и возвращающая значение
  */
  function parseFunction(expr) {
    const parsed = parseExpression(expr);           // базовый парсер для одного аргумента
    return (x, y) => {
      // замена переменной y на её числовое значение в выражении
      const exprWithY = expr.replace(/y/g, `(${y})`);
      const tempFn = parseExpression(exprWithY);    // временная функция с подставленным y
      return tempFn(x);                             // вычисление значения при заданном x
    };
  }

  /**
  * Вычисление дифференциального уравнения выбранным методом
  * @param methodId - идентификатор метода ('eyler' или 'runge')
  * @returns объект с результатом (значение, аппроксимация, название метода)
  */
  function compute(methodId) {
    // валидация ввода функции
    if (!func.trim()) {
      throw new Error('Введите функцию f(x, y)');
    }
    // валидация начального значения
    if (!firstValue.trim()) {
      throw new Error('Введите начальное значение y₀');
    }
    // валидация интервала
    if (!interval.trim()) {
      throw new Error('Введите интервал [a; b]');
    }
    // валидация количества шагов
    if (!steps.trim()) {
      throw new Error('Введите количество шагов');
    }

    const f = parseFunction(func);                    // преобразование строки в функцию
    
    const y0 = parseFloat(firstValue);                // начальное значение
    if (isNaN(y0)) {
      throw new Error('Начальное значение должно быть числом');
    }
    
    // парсинг интервала [a; b] (поддерживаются разделители ; и ,)
    let a, b;
    if (interval.includes(';')) {
      [a, b] = interval.split(';').map(Number);
    } else if (interval.includes(',')) {
      [a, b] = interval.split(',').map(Number);
    } else {
      a = parseFloat(interval);
      b = a + 1;
    }
    
    if (isNaN(a) || isNaN(b)) {
      throw new Error('Интервал должен быть в формате: a;b (например: 0;1)');
    }

    // парсинг количества шагов
    const n = parseInt(steps, 10);
    if (isNaN(n) || n <= 0) {
      throw new Error('Количество шагов должно быть положительным целым числом');
    }
    
    // вычисление шага h
    const h = (Math.max(a, b) - Math.min(a, b)) / n;
    const start = Math.min(a, b);                    // левая граница
    const end = Math.max(a, b);                      // правая граница
    
    // метод Эйлера
    if (methodId === 'eyler') {
      const res = Eyler(f, y0, h, start, end);       // вызов метода Эйлера
      
      if (!res) {
        throw new Error('Метод Эйлера не вернул корректные данные');
      }
      
      setStepsData(res);                             // сохранение пошаговых данных
      
      // последнее значение y
      const lastY = res[res.length - 1].y;
      return {
        value: lastY,
        approximation: `y(${end}) ≈ ${lastY.toFixed(8)}`,
        method: 'Эйлера'
      };
      
    // метод Рунге-Кутты 4-го порядка
    } else if (methodId === 'runge') {
      const stepsArray = Runge(f, y0, h, start, end); // вызов метода Рунге-Кутты
      
      if (!stepsArray || !Array.isArray(stepsArray)) {
        throw new Error('Метод Рунге-Кутты не вернул корректные данные');
      }
      
      // вычисление последнего значения y из пошаговых данных
      let lastY = y0;
      for (let i = 0; i < stepsArray.length; i++) {
        const step = stepsArray[i];
        lastY = step.y + (step.r1 + 2*step.r2 + 2*step.r3 + step.r4) / 6;
      }
      
      setStepsData(stepsArray);                      // сохранение пошаговых данных
      
      return {
        value: lastY,
        approximation: `y(${end}) ≈ ${lastY.toFixed(8)}`,
        method: 'Рунге-Кутты'
      };
    }
    
    return null;
  }

  /**
  * Обработчик нажатия кнопки вычисления
  * @param methodId - идентификатор выбранного метода
  */
  async function handleCalculation(methodId) {
    try {
      setLoading(true);                              
      setActiveMethod(methodId);                     
      setStepsData([]);                              
      setResult(null);                               
      
      const res = compute(methodId);                 // вычисление
      setResult(res);                                // сохранение результата
      
    } catch (e) {
      console.error('Ошибка:', e);
      alert("Ошибка метода: " + e.message);
      setResult(null);
      setStepsData([]);
    } finally {
      setLoading(false);                             
    }
  }

  /**
  * Очистка всех полей и результатов
  */
  function clearAll() {
    setFunc('');                                     // очистка функции
    setFirstValue('');                               // очистка начального значения
    setInterval('');                                 // очистка интервала
    setSteps('');                                    // очистка количества шагов
    setResult(null);                                 // очистка результата
    setStepsData([]);                                // очистка пошаговых данных
    setActiveMethod(null);                           // сброс активного метода
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
            
            {/* Header */}
            <View className="mt-4 mb-8">
              <Text className="text-zinc-500 text-base">
                Numerical Methods
              </Text>
              <Text className="text-white text-5xl font-bold mt-1">
                Differential equations
              </Text>
            </View>

            {/* Input Section */}
            <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
              <View className="px-5 py-4 border-b border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Функция f(x, y)
                </Text>
                <TextInput value={func} onChangeText={setFunc} placeholder="x + y" placeholderTextColor="#8E8E93" className="text-white text-lg" />
              </View>
              
              <View className="px-5 py-4 border-b border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Начальное значение y(0)
                </Text>
                <TextInput value={firstValue} onChangeText={setFirstValue} placeholder="1" placeholderTextColor="#8E8E93" keyboardType="numeric"className="text-white text-lg" />
              </View>

              <View className="px-5 py-4 border-b border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Интервал [a; b]
                </Text>
                <TextInput value={interval} onChangeText={setInterval} placeholder="0;1" placeholderTextColor="#8E8E93" className="text-white text-lg"/>
              </View>

              <View className="px-5 py-4">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Количество шагов
                </Text>
                <TextInput value={steps} onChangeText={setSteps} keyboardType="numeric" placeholder="100" placeholderTextColor="#8E8E93" className="text-white text-lg" />
              </View>
            </View>
          
            {/* Methods */}
            <Text className="text-[#8E8E93] text-sm mb-3 ml-1">
              МЕТОД
            </Text>

            <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
              {methods.map((method, index) => (
                <Pressable key={method.id} onPress={() => handleCalculation(method.id)}>
                  {({ pressed }) => (
                    <View className={`px-5 py-5 flex-row items-center justify-between ${index !== methods.length - 1 ? "border-b border-[#2C2C2E]" : ""}`}
                      style={{ backgroundColor: activeMethod === method.id ? "#2C2C2E" : pressed ? "#252527" : "#1C1C1E"}} >
                      <View>
                        <Text className="text-white text-lg font-medium">
                          {method.name}
                        </Text>
                        <Text className="text-[#8E8E93] text-sm mt-1">
                          {method.id === 'eyler' && 'Простой, но менее точный'}
                          {method.id === 'runge' && 'Высокая точность O(h⁴)'}
                        </Text>
                      </View>
                      <Text className="text-[#8E8E93] text-2xl">
                        ›
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            {/* Кнопка очистки */}
            <Pressable onPress={clearAll} className="mb-6">
              <View className="bg-[#2C2C2E] py-4 rounded-2xl">
                <Text className="text-white text-center font-semibold text-lg">
                  ОЧИСТИТЬ
                </Text>
              </View>
            </Pressable>

            
            {/* Result */}
            {result && (
              <View className="bg-[#1C1C1E] rounded-[32px] p-8 mb-6">
                <Text className="text-[#8E8E93] text-sm text-center">
                  Результат ({result.method})
                </Text>
                <Text className="text-white text-4xl font-bold mt-3 text-center">
                  {result.approximation}
                </Text>
                <Text className="text-[#30D158] text-lg mt-4 text-center">
                  Значение: {result.value.toFixed(8)}
                </Text>
              </View>
            )}

            {/* Steps Table - для метода Рунге-Кутты */}
            {activeMethod === 'runge' && stepsData && stepsData.length > 0 && (
                <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
                    <View className="px-5 py-4 bg-[#2C2C2E]">
                    <Text className="text-white text-lg font-semibold text-center">
                        Пошаговые вычисления (Метод Рунге-Кутты)
                    </Text>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerClassName="justify-center">
                    <View className="flex-1">
                        <View className="flex-row border-b border-[#2C2C2E] bg-[#252527] justify-between">
                            <Text className="text-[#8E8E93] text-sm p-3 min-w-20 text-center">Шаг</Text>
                            <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">x</Text>
                            <Text className="text-[#8E8E93] text-sm p-3 min-w-28 text-center">y</Text>
                            <Text className="text-[#8E8E93] text-sm p-3 min-w-24 text-center">k₁</Text>
                            <Text className="text-[#8E8E93] text-sm p-3 min-w-24 text-center">k₂</Text>
                            <Text className="text-[#8E8E93] text-sm p-3 min-w-24 text-center">k₃</Text>
                            <Text className="text-[#8E8E93] text-sm p-3 min-w-24 text-center">k₄</Text>
                        </View>
                        
                        {stepsData.map((step, idx) => (
                        <View key={idx} className="flex-row border-b border-[#2C2C2E]">
                            <Text className="text-white text-sm p-3 min-w-20 text-center">{step.iteration}</Text>
                            <Text className="text-white text-sm p-3 min-w-28 text-center">{step.x?.toFixed(6)}</Text>
                            <Text className="text-white text-sm p-3 min-w-28 text-center">{step.y?.toFixed(6)}</Text>
                            <Text className="text-[#30D158] text-sm p-3 min-w-24 text-center">{step.r1?.toFixed(6)}</Text>
                            <Text className="text-[#30D158] text-sm p-3 min-w-24 text-center">{step.r2?.toFixed(6)}</Text>
                            <Text className="text-[#30D158] text-sm p-3 min-w-24 text-center">{step.r3?.toFixed(6)}</Text>
                            <Text className="text-[#30D158] text-sm p-3 min-w-24 text-center">{step.r4?.toFixed(6)}</Text>
                        </View>
                        ))}
                    </View>
                    </ScrollView>
                </View>
            )}

            {/* Steps Table - для метода Эйлера */}
            {activeMethod === 'eyler' && stepsData && (
              <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">

                <View className="px-5 py-4 bg-[#2C2C2E]">
                  <Text className="text-white text-lg font-semibold text-center">
                    Пошаговые вычисления (Метод Эйлера)
                  </Text>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerClassName="justify-center">
                  <View>
                    <View className="flex-row border-b border-[#2C2C2E] bg-[#252527]">
                      <Text className="text-[#8E8E93] text-sm p-3 text-center">Шаг</Text>
                      <Text className="text-[#8E8E93] text-sm px-15 text-center">x</Text>
                      <Text className="text-[#8E8E93] text-sm p-3 text-center">y</Text>
                    </View>
                    
                    {stepsData.map((step, idx) => (
                      <View key={idx} className="flex-row border-b border-[#2C2C2E]">
                        <Text className="text-white text-sm p-3 text-center">{step.iteration}</Text>
                        <Text className="text-white text-sm p-3 text-center">{step.x?.toFixed(6)}</Text>
                        <Text className="text-white text-sm p-3 text-center">{step.y?.toFixed(6)}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Loading */}
            {loading && (
              <View className="absolute inset-0 bg-black/50 justify-center items-center">
                <View className="bg-[#1C1C1E] rounded-[28px] p-8 items-center">
                  <ActivityIndicator size="large" color="#0A84FF"/>
                  <Text className="text-white mt-4">
                    Вычисление уравнения...
                  </Text>
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}