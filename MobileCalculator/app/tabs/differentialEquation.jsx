import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../../mathFunctions/parseExpression";
import { Eyler } from "../../mathFunctions/derivatives/eyler";
import { Runge } from "../../mathFunctions/derivatives/runge";
import "../../global.css";

export default function DifferentialEquations() {
  const [func, setFunc] = useState('');
  const [firstValue, setFirstValue] = useState('');
  const [interval, setInterval] = useState('');
  const [steps, setSteps] = useState('');

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);

  const methods = [
    { id: 'eyler', name: 'Метод Эйлера' },
    { id: 'runge', name: 'Метод Рунге-Кутты 4-го порядка' },
  ];

  function parseFunction(expr) {
    const parsed = parseExpression(expr);
    return (x, y) => {
        const exprWithY = expr.replace(/y/g, `(${y})`);
        const tempFn = parseExpression(exprWithY);
        return tempFn(x);
    };
  }

  function compute(methodId) {
    if (!func.trim()) {
      throw new Error('Введите функцию f(x, y)');
    }
    if (!firstValue.trim()) {
      throw new Error('Введите начальное значение y₀');
    }
    if (!interval.trim()) {
      throw new Error('Введите интервал [a; b]');
    }
    if (!steps.trim()) {
      throw new Error('Введите количество шагов');
    }

    const f = parseFunction(func);
    
    const y0 = parseFloat(firstValue);
    if (isNaN(y0)) {
      throw new Error('Начальное значение должно быть числом');
    }
    
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

    const n = parseInt(steps, 10);
    if (isNaN(n) || n <= 0) {
      throw new Error('Количество шагов должно быть положительным целым числом');
    }
    
    const h = (Math.max(a, b) - Math.min(a, b)) / n;
    const start = Math.min(a, b);
    const end = Math.max(a, b);
    
    if (methodId === 'eyler') {
      const res = Eyler(f, y0, h, start, end);
      
      if (!res ) {
        throw new Error('Метод Эйлера не вернул корректные данные');
      }
      
      setStepsData(res);
      
      const lastY = res[res.length - 1].y;
      return {
        value: lastY,
        approximation: `y(${end}) ≈ ${lastY.toFixed(8)}`,
        method: 'Эйлера'
      };
      
    } else if (methodId === 'runge') {
      const stepsArray = Runge(f, y0, h, start, end);
      
      if (!stepsArray || !Array.isArray(stepsArray)) {
        throw new Error('Метод Рунге-Кутты не вернул корректные данные');
      }
      
      let lastY = y0;
      for (let i = 0; i < stepsArray.length; i++) {
        const step = stepsArray[i];
        lastY = step.y + (step.r1 + 2*step.r2 + 2*step.r3 + step.r4) / 6;
      }
      
      setStepsData(stepsArray)
      
      return {
        value: lastY,
        approximation: `y(${end}) ≈ ${lastY.toFixed(8)}`,
        method: 'Рунге-Кутты'
      };
    }
    
    return null;
  }

  async function handleCalculation(methodId) {
    try {
      setLoading(true);
      setActiveMethod(methodId);
      setStepsData([]);
      setResult(null);
      
      const res = compute(methodId);
      setResult(res);
      
    } catch (e) {
      console.error('Ошибка:', e);
      alert("Ошибка метода: " + e.message);
      setResult(null);
      setStepsData([]);
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setFunc('');
    setFirstValue('');
    setInterval('');
    setSteps('');
    setResult(null);
    setStepsData([]);
    setActiveMethod(null);
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
                <TextInput 
                  value={func} 
                  onChangeText={setFunc} 
                  placeholder="x + y" 
                  placeholderTextColor="#8E8E93" 
                  className="text-white text-lg" 
                />
              </View>
              
              <View className="px-5 py-4 border-b border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Начальное значение y₀
                </Text>
                <TextInput 
                  value={firstValue} 
                  onChangeText={setFirstValue} 
                  placeholder="y(0) = 1" 
                  placeholderTextColor="#8E8E93" 
                  keyboardType="numeric"
                  className="text-white text-lg" 
                />
              </View>

              <View className="px-5 py-4 border-b border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Интервал [a; b]
                </Text>
                <TextInput 
                  value={interval} 
                  onChangeText={setInterval} 
                  placeholder="0;1" 
                  placeholderTextColor="#8E8E93" 
                  className="text-white text-lg"
                />
              </View>

              <View className="px-5 py-4">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Количество шагов
                </Text>
                <TextInput 
                  value={steps} 
                  onChangeText={setSteps} 
                  keyboardType="numeric" 
                  placeholder="100" 
                  placeholderTextColor="#8E8E93" 
                  className="text-white text-lg" 
                />
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
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex justify-center">
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
                {console.log(activeMethod)}
                {console.log(stepsData)}

                <View className="px-5 py-4 bg-[#2C2C2E]">
                  <Text className="text-white text-lg font-semibold text-center">
                    Пошаговые вычисления (Метод Эйлера)
                  </Text>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={true} className="justify-center">
                  <View>
                    <View className="flex-row border-b border-[#2C2C2E] bg-[#252527]">
                      <Text className="text-[#8E8E93] text-sm p-3 w-20 text-center">Шаг</Text>
                      <Text className="text-[#8E8E93] text-sm p-3 w-28 text-center">x</Text>
                      <Text className="text-[#8E8E93] text-sm p-3 w-28 text-center">y</Text>
                    </View>
                    
                    {stepsData.map((step, idx) => (
                      <View key={idx} className="flex-row border-b border-[#2C2C2E]">
                        <Text className="text-white text-sm p-3 w-20 text-center">{step.iteration}</Text>
                        <Text className="text-white text-sm p-3 w-28 text-center">{step.x?.toFixed(6)}</Text>
                        <Text className="text-white text-sm p-3 w-28 text-center">{step.y?.toFixed(6)}</Text>
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