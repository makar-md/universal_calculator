import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../../mathFunctions/parseExpression";
import { iterationMethod } from "../../mathFunctions/iterationMethod";
import { bisectionMethod } from "../../mathFunctions/bisectionMethod";
import { Link } from 'expo-router';
import "../../global.css";
import Integrals from './integrals';

export default function Index() {
  const [text, setText] = useState('');
  const [interval, setInterval] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [expr, setExpr] = useState(null);
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState(null);

  function getData(){
    const f = parseExpression(text);
    setExpr(() => f);

    const [a, b] = interval.split(';').map(Number);
    const eps = Function(`return ${accuracy.replace("^", "**")}`)();
    if (isNaN(a) || isNaN(b) || isNaN(eps)) {
      setSteps([]);
      setResult(null);
      alert("Пожалуйста, убедитесь, что все поля введены корректно!");
      return null;
    }
    const data = {
      f:f,
      a:a,
      b:b,
      eps:eps
    };
    return data;
  }

  const handleBisection = () => {
    setMethod("bisection");

    try {
      const data = getData()

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

  const handleIteration = () => {
    setMethod("iteration");

    try {
      const data = getData();

      const res = iterationMethod(data.f, data.a, data.b, data.eps);

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
    <SafeAreaView className="flex-1 bg-zinc-900">

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="mt-6 mb-6">
          <Text className="text-[#8E8E93] text-sm">
            Numerical Methods
          </Text>

          <Text className="text-white text-5xl font-bold mt-1">
            The linear equation
          </Text>
        </View>

        {/* Input Card */}
        <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">

          <View className="px-5 py-4 border-b border-[#2C2C2E]">
            <Text className="text-[#8E8E93] text-sm mb-2">
              Функция
            </Text>

            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="sin(x) + ln(x) + x^2"
              placeholderTextColor="#8E8E93"
              className="text-white text-lg"
            />
          </View>

          <View className="px-5 py-4 border-b border-[#2C2C2E]">
            <Text className="text-[#8E8E93] text-sm mb-2">
              Интервал (a;b)
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
              Точность ε
            </Text>

            <TextInput
              value={accuracy}
              onChangeText={setAccuracy}
              placeholder="0.001"
              placeholderTextColor="#8E8E93"
              className="text-white text-lg"
            />
          </View>

        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mb-6">

          <Pressable
            onPress={handleBisection}
            className="flex-1 bg-[#0A84FF] py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-semibold">
              Дихотомия
            </Text>
          </Pressable>

          <Pressable
            onPress={handleIteration}
            className="flex-1 bg-[#2C2C2E] py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-semibold">
              Итерации
            </Text>
          </Pressable>

        </View>

        {/* Table Header */}
        {method && (
          <View className="bg-[#1C1C1E] rounded-t-[24px] px-3 py-3 flex-row">

            {method === "bisection" && (
              <>
                <Text className="text-[#8E8E93] flex-1">k</Text>
                <Text className="text-[#8E8E93] flex-1">a</Text>
                <Text className="text-[#8E8E93] flex-1">b</Text>
                <Text className="text-[#8E8E93] flex-1">mid</Text>
                <Text className="text-[#8E8E93] flex-1">f(mid)</Text>
              </>
            )}

            {method === "iteration" && (
              <>
                <Text className="text-[#8E8E93] flex-1">k</Text>
                <Text className="text-[#8E8E93] flex-1">x</Text>
                <Text className="text-[#8E8E93] flex-1">xₙₑₓₜ</Text>
                <Text className="text-[#8E8E93] flex-1">Δ</Text>
              </>
            )}

          </View>
        )}

        {/* Steps */}
        <View className="bg-[#1C1C1E] rounded-b-[24px] overflow-hidden mb-6">

          {steps.map((row, i) => (
            <View
              key={i}
              className="flex-row px-3 py-3 border-b border-[#2C2C2E]"
            >

              {method === "bisection" && (
                <>
                  <Text className="text-white flex-1">
                    {row.step}
                  </Text>

                  <Text className="text-white flex-1">
                    {row.a.toFixed(3)}
                  </Text>

                  <Text className="text-white flex-1">
                    {row.b.toFixed(3)}
                  </Text>

                  <Text className="text-white flex-1">
                    {row.mid.toFixed(3)}
                  </Text>

                  <Text className="text-white flex-1">
                    {row.fmid.toFixed(3)}
                  </Text>
                </>
              )}

              {method === "iteration" && (
                <>
                  <Text className="text-white flex-1">
                    {row.step}
                  </Text>

                  <Text className="text-white flex-1">
                    {row.x.toFixed(3)}
                  </Text>

                  <Text className="text-white flex-1">
                    {row.xNext.toFixed(3)}
                  </Text>

                  <Text className="text-white flex-1">
                    {row.diff.toFixed(3)}
                  </Text>
                </>
              )}

            </View>
          ))}

        </View>

        {/* Result */}
        {result && (
          <View className="bg-[#1C1C1E] rounded-[28px] p-6">

            <Text className="text-[#8E8E93] text-sm">
              Result
            </Text>

            <Text className="text-white text-4xl font-bold mt-2">
              {result.root.toFixed(5)}
            </Text>

            <Text className="text-[#8E8E93] mt-2">
              Iterations: {result.iterations}
            </Text>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);
}