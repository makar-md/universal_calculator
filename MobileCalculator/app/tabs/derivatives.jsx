import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { differentiationFirst, differentiationSecond} from "../../mathFunctions/derivatives/differentiation";
import "../../global.css";

export default function derivatives() {
  // состояние массива точек (x, y) с уникальными id
  const [points, setPoints] = useState([
    { x: "", y: "", id: 0 },
    { x: "", y: "", id: 1 },
    { x: "", y: "", id: 2 },
    { x: "", y: "", id: 3 }
  ]);
  
  const [error, setError] = useState(null);             // состояние для хранения ошибок
  const [firstResult, setFirstResult] = useState(null);   // результат для первой производной
  const [secondResult, setSecondResult] = useState(null); // результат для второй производной
  const [loading, setLoading] = useState(false);          // состояние загрузки

  /**
  * Добавление новой точки в таблицу
  * Присваивает новый id = длине массива
  */
  const addPoint = () => {
    const newId = points.length;                      // новый id
    setPoints([...points, { x: "", y: "", id: newId }]); // добавление точки
  };

  /**
  * Удаление точки по id
  * @param id - идентификатор удаляемой точки
  */
  const removePoint = (id) => {
    if (points.length > 4) {                              // проверка: должно остаться минимум 4 точки
      setPoints(points.filter(point => point.id !== id)); 
    } else {
      alert("Должно быть минимум 4 точки для формул дифференцирования");
    }
  };

  /**
  * Обновление значения x или y у точки
  * @param id - идентификатор точки
  * @param field - поле для обновления ("x" или "y")
  * @param value - новое значение
  */
  const updatePoint = (id, field, value) => {
    setPoints(points.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ));
  };

  /**
  * Вычисление производных по введённым точкам
  * Проверяет корректность ввода, вызывает функции дифференцирования
  */
  const calculateDerivatives = () => {
    const xValues = [];                               // массив для x координат
    const yValues = [];                               // массив для y координат
    
    // сбор и валидация введённых данных
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
    
    // проверка на 4 точки (формулы работают только для 4 узлов)
    if (xValues.length !== 4) {
      alert("Для численного дифференцирования нужно ровно 4 точки");
      return;
    }
    
    // проверка на равноотстоящие узлы (шаг h должен быть одинаковым)
    const h = xValues[1] - xValues[0];                // вычисление шага
    for (let i = 2; i < xValues.length; i++) {
      if (Math.abs((xValues[i] - xValues[i-1]) - h) > 1e-10) {
        alert("Узлы должны быть равноотстоящими (шаг h должен быть одинаковым)");
        return;
      }
    }
    
    setLoading(true);                                 // включение индикатора загрузки
    
    // имитация асинхронного вычисления
    setTimeout(() => {
      try {
        // вычисление первой и второй производных
        const first = differentiationFirst(xValues, yValues);
        const second = differentiationSecond(xValues, yValues);
        
        setFirstResult(first);                        // сохранение результата первой производной
        setSecondResult(second);                      // сохранение результата второй производной
        setError(null);                               // сброс ошибки
      } catch (error) {
        alert("Ошибка при вычислении: " + error.message);
        setError(error.message);                      // сохранение ошибки
        setFirstResult(null);                         // сброс результата
        setSecondResult(null);                        // сброс результата
      } finally {
        setLoading(false);                            // выключение индикатора загрузки
      }
    }, 100);
  };

  /**
  * Очистка всех полей и результатов
  * Сбрасывает точки к начальным 4 пустым строкам
  */
  const clearAll = () => {
    setPoints([                                        // сброс точек к начальному состоянию
      { x: "", y: "", id: 0 },
      { x: "", y: "", id: 1 },
      { x: "", y: "", id: 2 },
      { x: "", y: "", id: 3 }
    ]);
    setFirstResult(null);                             // сброс результата первой производной
    setSecondResult(null);                            // сброс результата второй производной
    setError(null);                                   // сброс ошибки
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
                Derivatives
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


            {/* Кнопки управления */}
            <View className="flex-row gap-4 mb-6">
              <Pressable onPress={calculateDerivatives} className="flex-1">
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
            {firstResult !== null && (
              <View className="mb-6">
                <View className="bg-[#1C1C1E] rounded-[32px] p-8 items-start mb-4">
                  <Text className="text-[#8E8E93] text-lg mb-2">
                    Первая производная
                  </Text>

                  {firstResult.derivatives.map((val, idx) => (
                    <View key={idx} className="flex-row justify-between py-2 border-b border-zinc-700">
                        <Text className="text-white text-xl font-bold">f'(x{idx}) = {val.toFixed(8)}</Text>
                        <Text className="text-white text-xl font-bold">
                            ± {firstResult.error_coefficients[idx]?.toExponential(4)} · f ⁱᵛ( ξ )
                        </Text>
                    </View>
                   ))}
                </View>
              </View>
            )}

            {secondResult !== null && (
              <View className="mb-6">
                <View className="bg-[#1C1C1E] rounded-[32px] p-8 items-start mb-4">
                  <Text className="text-[#8E8E93] text-lg mb-2">
                    Вторая производная
                  </Text>

                  {secondResult.derivatives.map((val, idx) => (
                    <View key={idx} className="flex-row justify-between py-2 border-b border-zinc-700">
                        <Text className="text-white text-xl font-bold">f'(x{idx}) = {val.toFixed(8)}</Text>
                        <Text className="text-white text-xl font-bold">
                            ± {secondResult.error_coefficients[idx]?.toExponential(4)} · f ⁱᵛ( ξ )
                        </Text>
                    </View>
                   ))}
                </View>
              </View>
            )}

            {/* Loading */}
            {loading && (
              <View className="absolute inset-0 bg-black/50 justify-center items-center">
                <View className="bg-[#1C1C1E] rounded-[28px] p-8 items-center">
                  <ActivityIndicator size="large" color="#0A84FF" />
                  <Text className="text-white mt-4">Вычисление производной...</Text>
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}