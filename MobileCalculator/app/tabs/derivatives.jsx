import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { differentiationFirst, differentiationSecond} from "../../mathFunctions/derivatives/differentiation";
import "../../global.css";

export default function derivatives() {
  const [points, setPoints] = useState([
    { x: "", y: "", id: 0 },
    { x: "", y: "", id: 1 },
    { x: "", y: "", id: 2 },
    { x: "", y: "", id: 3 }
  ]);
  const [error, setError] = useState(null);
  const [firstResult, setFirstResult] = useState(null);
  const [secondResult, setSecondResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addPoint = () => {
    const newId = points.length;
    setPoints([...points, { x: "", y: "", id: newId }]);
  };

  const removePoint = (id) => {
    if (points.length > 2) {
      setPoints(points.filter(point => point.id !== id));
    } else {
      alert("Должно быть минимум 2 точки");
    }
  };

  const updatePoint = (id, field, value) => {
    setPoints(points.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ));
  };


  const calculateDerivatives = () => {
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
    
    setLoading(true);
    
    setTimeout(() => {
      try {
        const first = differentiationFirst(xValues, yValues)
        const second = differentiationSecond(xValues, yValues)
        
        setFirstResult(first);
        setSecondResult(second);
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
    setFirstResult(null);
    setSecondResult(null);
    setError(null);
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
                    Первая производная
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