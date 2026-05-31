import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { iterationSystem, createSystemFromEquations } from "../../mathFunctions/systemEquastion/systemEquastion";
import "../../global.css";

export default function SystemIteration() {
  const [equations, setEquations] = useState(['', '', '', '']);
  const [eps, setEps] = useState('0.001');
  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateEquation = (index, value) => {
    const newEquations = [...equations];
    newEquations[index] = value;
    setEquations(newEquations);
  };

  const handleSolve = () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        for (let i = 0; i < equations.length; i++) {
          if (!equations[i].trim()) {
            throw new Error(`Уравнение ${i + 1} не заполнено`);
          }
          if (!equations[i].includes('=')) {
            throw new Error(`Уравнение ${i + 1} не содержит знак =`);
          }
        }
        
        const epsVal = parseFloat(eps);
        if (isNaN(epsVal) || epsVal <= 0) {
          throw new Error('Введите корректную точность');
        }
        
        const { matrix, b } = createSystemFromEquations(equations);
        
        const res = iterationSystem(matrix, b, epsVal);
        
        setStepsData(res.steps);
        setResult({
          solution: res.solution,
          iterations: res.iterations,
          normB: res.normB,
          condition: res.condition
        });
        
      } catch (error) {
        alert("Ошибка: " + error.message);
        setResult(null);
        setStepsData([]);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const clearAll = () => {
    setEquations(['', '', '', '']);
    setEps('0.001');
    setResult(null);
    setStepsData([]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
            
            <View className="mt-4 mb-8">
              <Text className="text-zinc-500 text-base">
                Numerical Methods
              </Text>
              <Text className="text-white text-4xl font-bold mt-1">
                System of linear equations
              </Text>
              <Text className="text-[#8E8E93] text-base mt-1">
                Метод простой итерации
              </Text>
            </View>

            <Text className="text-[#8E8E93] text-sm mb-2 ml-1">
              ВВЕДИТЕ 4 УРАВНЕНИЯ
            </Text>

            {equations.map((eq, idx) => (
              <View key={idx} className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-3">
                <View className="px-5 py-4">
                  <Text className="text-[#8E8E93] text-xs mb-2">
                    Уравнение {idx + 1}
                  </Text>
                  <TextInput 
                    value={eq} 
                    onChangeText={(text) => updateEquation(idx, text)} 
                    placeholder="2x1 - 3x2 + x3 - x4 = 5" 
                    placeholderTextColor="#8E8E93" 
                    className="text-white text-base font-mono" 
                  />
                </View>
              </View>
            ))}

            <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mt-2 mb-4">
              <View className="px-5 py-4">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  ТОЧНОСТЬ ε
                </Text>
                <TextInput 
                  value={eps} 
                  onChangeText={setEps} 
                  keyboardType="numeric"
                  placeholder="0.001" 
                  placeholderTextColor="#8E8E93" 
                  className="bg-[#2C2C2E] rounded-xl px-4 py-3 text-white text-lg" 
                />
              </View>
            </View>

            <View className="flex-row gap-4 mb-6">
              <Pressable onPress={handleSolve} className="flex-1">
                <View className="bg-[#0A84FF] py-4 rounded-2xl">
                  <Text className="text-white text-center font-semibold text-lg">
                    РЕШИТЬ
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


            {result && (
              <View className="bg-[#1C1C1E] rounded-[32px] p-6 mb-6">
                <Text className="text-[#8E8E93] text-sm text-center mb-3">
                  РЕШЕНИЕ СИСТЕМЫ
                </Text>
                
                <View className="bg-[#2C2C2E] rounded-xl p-3 mb-4">
                  <Text className="text-[#8E8E93] text-xs mb-1">ПРОВЕРКА НОРМЫ МАТРИЦЫ B</Text>
                  <Text className="text-white text-base">||B|| = {result.normB?.toFixed(6)}</Text>
                  <Text className={`text-sm mt-1 ${result.normB < 1 ? "text-[#30D158]" : "text-[#FF9F0A]"}`}>
                    {result.normB < 1 ? "✓ Условие сходимости выполнено" : "⚠ Норма >= 1, метод может расходиться"}
                  </Text>
                </View>
                
                {result.solution.map((val, idx) => (
                  <View key={idx} className="flex-row justify-between py-2 border-b border-[#2C2C2E]">
                    <Text className="text-white text-lg">x{idx + 1} =</Text>
                    <Text className="text-[#30D158] text-lg font-bold">{val.toFixed(8)}</Text>
                  </View>
                ))}
                
                <View className="mt-4 pt-3 border-t border-[#2C2C2E]">
                  <Text className="text-[#8E8E93] text-sm">
                    Итераций: {result.iterations}
                  </Text>
                </View>
              </View>
            )}

            {stepsData.length > 0 && (
              <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">
                <View className="px-5 py-4 bg-[#2C2C2E]">
                  <Text className="text-white text-lg font-semibold text-center">
                    Пошаговые вычисления
                  </Text>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View>
                    <View className="flex-row border-b border-[#2C2C2E] bg-[#252527]">
                      <Text className="text-[#8E8E93] text-sm p-3 w-20 text-center">Шаг</Text>
                      <Text className="text-[#8E8E93] text-sm p-3 w-28 text-center">x₁</Text>
                      <Text className="text-[#8E8E93] text-sm p-3 w-28 text-center">x₂</Text>
                      <Text className="text-[#8E8E93] text-sm p-3 w-28 text-center">x₃</Text>
                      <Text className="text-[#8E8E93] text-sm p-3 w-28 text-center">x₄</Text>
                      <Text className="text-[#8E8E93] text-sm p-3 w-24 text-center">Δ</Text>
                    </View>
                    
                    {stepsData.slice(1, 21).map((step, idx) => (
                      <View key={idx} className="flex-row border-b border-[#2C2C2E]">
                        <Text className="text-white text-sm p-3 w-20 text-center">{step.iteration}</Text>
                        <Text className="text-white text-sm p-3 w-28 text-center">{step.x[0]?.toFixed(6)}</Text>
                        <Text className="text-white text-sm p-3 w-28 text-center">{step.x[1]?.toFixed(6)}</Text>
                        <Text className="text-white text-sm p-3 w-28 text-center">{step.x[2]?.toFixed(6)}</Text>
                        <Text className="text-white text-sm p-3 w-28 text-center">{step.x[3]?.toFixed(6)}</Text>
                        <Text className="text-[#30D158] text-sm p-3 w-24 text-center">{step.error?.toExponential(4)}</Text>
                      </View>
                    ))}
                    
                    {stepsData.length > 21 && (
                      <View className="p-3">
                        <Text className="text-[#8E8E93] text-center">
                          ... и ещё {stepsData.length - 21} итераций
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}

            {loading && (
              <View className="absolute inset-0 bg-black/50 justify-center items-center">
                <View className="bg-[#1C1C1E] rounded-[28px] p-8 items-center">
                  <ActivityIndicator size="large" color="#0A84FF"/>
                  <Text className="text-white mt-4">Решение системы...</Text>
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}