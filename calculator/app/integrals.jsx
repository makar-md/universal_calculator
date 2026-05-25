import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../mathFunctions/parseExpression";
import { IntegrationSquare } from "../mathFunctions/IntegrationSquare";
import { IntegrationTrapeze } from "../mathFunctions/IntegrationTrapeze";
import { IntegrationSimpson } from "../mathFunctions/IntegrationSimpson";
import { IntegrationNewtonCotes } from "../mathFunctions/integrationNewtonCotes";
import "../global.css";

export default function Integrals() {
  const [func, setFunc] = useState('');
  const [interval, setInterval] = useState('');
  const [steps, setSteps] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);

  const methods = [
    { id: 'newton', name: 'Ньютон-Котес', handler: handleNewtonCotes, color: '#8B5CF6' },
    { id: 'square', name: 'Прямоугольники', handler: handleSquare, color: '#EC4899' },
    { id: 'trapeze', name: 'Трапеции', handler: handleTrapeze, color: '#06B6D4' },
    { id: 'simpson', name: 'Симпсон', handler: handleSimpson, color: '#10B981' },
  ];

  function getData() {
    const f = parseExpression(func);
    const [a, b] = interval.split(';').map(Number);
    const stepCount = Function(`return ${steps.replace("^", "**")}`)();
    
    if (isNaN(a) || isNaN(b) || isNaN(stepCount)) {
      alert("Пожалуйста, убедитесь, что все поля введены корректно!");
      return null;
    }
    return { f, a, b, n: stepCount };
  }

  async function handleCalculation(handler, methodId) {
    try {
      setLoading(true);
      setActiveMethod(methodId);
      const data = getData();
      if (!data) return;
      const res = handler(data.f, data.a, data.b, data.n);
      setResult(res);
    } catch (e) {
      alert("Ошибка метода: " + e.message);
    } finally {
      setLoading(false);
      setTimeout(() => setActiveMethod(null), 300);
    }
  }

  function handleSquare(f, a, b, n) { return IntegrationSquare(f, a, b, n); }
  function handleTrapeze(f, a, b, n) { return IntegrationTrapeze(f, a, b, n); }
  function handleSimpson(f, a, b, n) { return IntegrationSimpson(f, a, b, n); }
  function handleNewtonCotes(f, a, b, n) { return IntegrationNewtonCotes(f, a, b, n); }

  return (
  <SafeAreaProvider>
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <View className="mt-4 mb-8">
            <Text className="text-zinc-500 text-base">
              Numerical Methods
            </Text>

            <Text className="text-white text-5xl font-bold mt-1">
              Интегралы
            </Text>
          </View>

          {/* Inputs */}
          <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">

            <View className="px-5 py-4 border-b border-[#2C2C2E]">
              <Text className="text-[#8E8E93] text-sm mb-2">
                Функция
              </Text>

              <TextInput
                value={func}
                onChangeText={setFunc}
                placeholder="sin(x)+ln(x)+x²"
                placeholderTextColor="#8E8E93"
                className="text-white text-lg"
              />
            </View>

            <View className="px-5 py-4 border-b border-[#2C2C2E]">
              <Text className="text-[#8E8E93] text-sm mb-2">
                Интервал
              </Text>

              <TextInput
                value={interval}
                onChangeText={setInterval}
                placeholder="0;3"
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
              <Pressable
                key={method.id}
                onPress={() =>
                  handleCalculation(method.handler, method.id)
                }
              >
                {({ pressed }) => (
                  <View
                    className={`
                      px-5
                      py-5
                      flex-row
                      items-center
                      justify-between
                      ${
                        index !== methods.length - 1
                          ? "border-b border-[#2C2C2E]"
                          : ""
                      }
                    `}
                    style={{
                      backgroundColor:
                        activeMethod === method.id
                          ? "#2C2C2E"
                          : pressed
                          ? "#252527"
                          : "#1C1C1E",
                    }}
                  >
                    <View>
                      <Text className="text-white text-lg font-medium">
                        {method.name}
                      </Text>

                      <Text className="text-[#8E8E93] text-sm mt-1">
                        {method.id === "newton" &&
                          "Высокий порядок точности"}

                        {method.id === "square" &&
                          "Простой базовый метод"}

                        {method.id === "trapeze" &&
                          "Хороший баланс скорости"}

                        {method.id === "simpson" &&
                          "Максимальная точность"}
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

          {/* Result */}
          {result !== null && (
            <View className="bg-[#1C1C1E] rounded-[32px] p-8 items-center mb-6">

              <Text className="text-[#8E8E93] text-sm">
                Результат
              </Text>

              <Text className="text-white text-5xl font-bold mt-3">
                {typeof result === "number"
                  ? result.toFixed(8)
                  : result}
              </Text>

            </View>
          )}

          {/* Loading */}
          {loading && (
            <View className="absolute inset-0 bg-black/30 justify-center items-center">

              <View className="bg-[#1C1C1E] rounded-[28px] p-8 items-center">

                <ActivityIndicator
                  size="large"
                  color="#0A84FF"
                />

                <Text className="text-white mt-4">
                  Вычисление...
                </Text>

              </View>

            </View>
          )}

          {/* Footer */}
          <View className="bg-[#1C1C1E] rounded-[24px] p-5">

            <Text className="text-[#8E8E93] text-sm mb-2">
              Поддерживаемые функции
            </Text>

            <Text className="text-white leading-6">
              sin(x), cos(x), tan(x), ln(x), exp(x), x², x³, xⁿ
            </Text>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </SafeAreaProvider>
);
}