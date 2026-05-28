import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { LagrangePolynomial, LagrangePolynomialString, LagrangeMaxError, LagrangeError } from "../../mathFunctions/lagrange";
import "../../global.css";

export default function Lagrange() {
  const [points, setPoints] = useState([
    { x: "", y: "", id: 0 },
    { x: "", y: "", id: 1 },
    { x: "", y: "", id: 2 }
  ]);
  const [xValue, setXValue] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polynomialString, setPolynomialString] = useState("");
  const [error, setError] = useState(null);
  const [actualValue, setActualValue] = useState(""); // Для точного значения функции

  // Добавление новой точки
  const addPoint = () => {
    const newId = points.length;
    setPoints([...points, { x: "", y: "", id: newId }]);
  };

  // Удаление точки
  const removePoint = (id) => {
    if (points.length > 2) {
      setPoints(points.filter(point => point.id !== id));
    } else {
      alert("Должно быть минимум 2 точки");
    }
  };

  // Обновление значения точки
  const updatePoint = (id, field, value) => {
    setPoints(points.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ));
  };

  // Вычисление полинома Лагранжа
  const calculateLagrange = () => {
    // Проверка на заполненность
    const xValues = [];
    const yValues = [];
    
    for (let point of points) {
      if (point.x === "" || point.y === "") {
        alert("Заполните все значения x и y");
        return;
      }
      
      const x = parseFloat(point.x);
      const y = parseFloat(point.y);
      
      if (isNaN(x) || isNaN(y)) {
        alert("Введите корректные числа");
        return;
      }
      
      xValues.push(x);
      yValues.push(y);
    }
    
    // Проверка на уникальность x
    const uniqueX = [...new Set(xValues)];
    if (uniqueX.length !== xValues.length) {
      alert("Значения x должны быть уникальными");
      return;
    }
    
    if (xValue === "") {
      alert("Введите значение x для интерполяции");
      return;
    }
    
    const xInterp = parseFloat(xValue);
    if (isNaN(xInterp)) {
      alert("Введите корректное значение x");
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      try {
        // Получаем функцию полинома
        const lagrangeFunc = LagrangePolynomial(xValues, yValues);
        
        // Вычисляем значение
        const interpolatedValue = lagrangeFunc(xInterp);
        
        // Получаем строковое представление полинома
        const polynomialStr = LagrangePolynomialString(xValues, yValues);
        
        setResult(interpolatedValue);
        setPolynomialString(polynomialStr);
        
        // Расчет погрешности
        let actualVal = null;
        if (actualValue.trim() !== "") {
          actualVal = parseFloat(actualValue);
          if (!isNaN(actualVal)) {
            const errorValue = Math.abs(actualVal - interpolatedValue);
            setError({
              type: "actual",
              value: errorValue,
              message: `Фактическая погрешность: ${errorValue.toExponential(6)}`
            });
          } else {
            // Оценка погрешности без точного значения
            const errorEstimate = LagrangeError(xValues, yValues, xInterp);
            setError(errorEstimate);
          }
        } else {
          // Оценка погрешности без точного значения
          const errorEstimate = LagrangeError(xValues, yValues, xInterp);
          setError(errorEstimate);
        }
        
      } catch (error) {
        alert("Ошибка при вычислении: " + error.message);
        setError(null);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const clearAll = () => {
    setPoints([
      { x: "", y: "", id: 0 },
      { x: "", y: "", id: 1 },
      { x: "", y: "", id: 2 }
    ]);
    setXValue("");
    setResult(null);
    setPolynomialString("");
    setError(null);
    setActualValue("");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
            
            {/* Header */}
            <View className="mt-4 mb-6">
              <Text className="text-zinc-500 text-base">
                Numerical Methods
              </Text>
              <Text className="text-white text-5xl font-bold mt-1">
                Lagrange
              </Text>
            </View>

            {/* Таблица точек */}
            <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
              <View className="px-5 py-4">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  ТАБЛИЦА ТОЧЕК
                </Text>
                
                {/* Заголовки таблицы */}
                <View className="flex-row mb-3 mt-2">
                  <View className="flex-1">
                    <Text className="text-[#8E8E93] text-sm">x</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-[#8E8E93] text-sm">y</Text>
                  </View>
                  <View className="w-10" />
                </View>
                
                {/* Строки таблицы */}
                {points.map((point, index) => (
                  <View key={point.id} className="flex-row items-center mb-3">
                    <View className="flex-1">
                      <TextInput
                        value={point.x}
                        onChangeText={(value) => updatePoint(point.id, "x", value)}
                        keyboardType="numeric"
                        placeholder={`x${index}`}
                        placeholderTextColor="#8E8E93"
                        className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white"
                      />
                    </View>
                    
                    <View className="flex-1 ml-3">
                      <TextInput
                        value={point.y}
                        onChangeText={(value) => updatePoint(point.id, "y", value)}
                        keyboardType="numeric"
                        placeholder={`y${index}`}
                        placeholderTextColor="#8E8E93"
                        className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white"
                      />
                    </View>
                    
                    <Pressable onPress={() => removePoint(point.id)} className="w-10 ml-2">
                      <Text className="text-red-500 text-2xl text-center">−</Text>
                    </Pressable>
                  </View>
                ))}
                
                {/* Кнопка добавления */}
                <Pressable onPress={addPoint} className="mt-2">
                  <View className="flex-row items-center justify-center py-3 rounded-xl border border-dashed border-[#0A84FF]">
                    <Text className="text-[#0A84FF] text-lg mr-2">+</Text>
                    <Text className="text-[#0A84FF]">Добавить точку</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Значение x для интерполяции */}
            <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
              <View className="px-5 py-4 border-b border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  ЗНАЧЕНИЕ ДЛЯ ИНТЕРПОЛЯЦИИ
                </Text>
                
                <TextInput
                  value={xValue}
                  onChangeText={setXValue}
                  keyboardType="numeric"
                  placeholder="Введите x"
                  placeholderTextColor="#8E8E93"
                  className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white text-lg"
                />
              </View>

              <View className="px-5 py-4">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  ТОЧНОЕ ЗНАЧЕНИЕ (опционально, для погрешности)
                </Text>
                
                <TextInput
                  value={actualValue}
                  onChangeText={setActualValue}
                  keyboardType="numeric"
                  placeholder="f(x) = ? (оставьте пустым для оценки)"
                  placeholderTextColor="#8E8E93"
                  className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white text-lg"
                />
              </View>
            </View>

            {/* Кнопки управления */}
            <View className="flex-row gap-4 mb-6">
              <Pressable onPress={calculateLagrange} className="flex-1">
                <View className="bg-[#0A84FF] py-4 rounded-2xl">
                  <Text className="text-white text-center font-semibold text-lg">
                    ВЫЧИСЛИТЬ
                  </Text>
                </View>
              </Pressable>
              
              <Pressable onPress={clearAll} className="flex-1">
                <View className="bg-[#2C2C2E] py-4 rounded-2xl">
                  <Text className="text-white text-center font-semibold text-lg">
                    ОЧИСТИТЬ
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Результат */}
            {result !== null && (
              <View className="mb-6">
                <View className="bg-[#1C1C1E] rounded-[32px] p-8 items-center mb-4">
                  <Text className="text-[#8E8E93] text-sm mb-2">
                    РЕЗУЛЬТАТ ИНТЕРПОЛЯЦИИ
                  </Text>
                  <Text className="text-white text-5xl font-bold">
                    f({xValue}) = {result.toFixed(8)}
                  </Text>
                </View>
                
                {/* Погрешность */}
                {error && (
                  <View className={`rounded-[32px] p-6 mb-4 ${
                    error.type === "warning" ? "bg-[#FF9F0A]/20 border border-[#FF9F0A]" : 
                    error.type === "error" ? "bg-[#FF3B30]/20 border border-[#FF3B30]" : 
                    "bg-[#1C1C1E]"
                  }`}>
                    <Text className="text-[#8E8E93] text-sm mb-2">
                      ПОГРЕШНОСТЬ ИНТЕРПОЛЯЦИИ
                    </Text>
                    
                    {error.type === "actual" && (
                      <>
                        <Text className="text-white text-2xl font-bold">
                          Δ = {error.value.toExponential(8)}
                        </Text>
                        <Text className="text-[#8E8E93] text-sm mt-2">
                          Фактическая погрешность (|точное - приближенное|)
                        </Text>
                      </>
                    )}
                    
                    {error.type === "estimate" && (
                      <>
                        <Text className="text-[#FF9F0A] text-2xl font-bold">
                          ≈ {error.value.toExponential(6)}
                        </Text>
                        <Text className="text-[#8E8E93] text-sm mt-2">
                          {error.message}
                        </Text>
                        <Text className="text-[#8E8E93] text-xs mt-2">
                          * Для точной погрешности введите точное значение f(x)
                        </Text>
                      </>
                    )}
                    
                    {error.type === "warning" && (
                      <Text className="text-[#FF9F0A] text-base">
                        ⚠️ {error.message}
                      </Text>
                    )}
                    
                    {error.type === "error" && (
                      <Text className="text-[#FF3B30] text-base">
                        ❌ {error.message}
                      </Text>
                    )}
                  </View>
                )}
                
                {polynomialString && (
                  <View className="bg-[#1C1C1E] rounded-[32px] p-6">
                    <Text className="text-[#8E8E93] text-sm mb-3">
                      ПОЛИНОМ ЛАГРАНЖА
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                      <Text className="text-white text-sm font-mono">
                        P(x) = {polynomialString}
                      </Text>
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            {/* Loading */}
            {loading && (
              <View className="absolute inset-0 bg-black/50 justify-center items-center">
                <View className="bg-[#1C1C1E] rounded-[28px] p-8 items-center">
                  <ActivityIndicator size="large" color="#0A84FF" />
                  <Text className="text-white mt-4">Вычисление полинома...</Text>
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}