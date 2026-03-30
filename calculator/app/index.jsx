import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../mathFunctions/parseExpression";
import { iterationMethod } from "../mathFunctions/iterationMethod";
import { bisectionMethod } from "../mathFunctions/bisectionMethod";
import "../global.css";

export default function Index() {
  const [text, setText] = useState('');
  const [interval, setInterval] = useState('');
  const [accuracy, setAccuracy] = useState('');

  const [expr, setExpr] = useState(null);
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState(null); 

  const handleBisection = () => {
    setMethod("bisection");

    try {
      const f = parseExpression(text);
      setExpr(() => f);

      const [a, b] = interval.split(';').map(Number);
      const eps = parseFloat(accuracy);

      if (isNaN(a) || isNaN(b) || isNaN(eps)) {
        setSteps([]);
        setResult(null);
        return;
      }

      const res = bisectionMethod(f, a, b, eps);

      setSteps(res.steps);
      setResult({
        root: res.root,
        iterations: res.iterations
      });

    } catch (e) {
      console.log(e.message);
      setSteps([]);
      setResult(null);
    }
  };

  const handleIteration = () => {
    setMethod("iteration");

    try {
      const f = parseExpression(text);
      setExpr(() => f);

      const [a, b] = interval.split(';').map(Number);
      const eps = parseFloat(accuracy);

      if (isNaN(a) || isNaN(b) || isNaN(eps)) {
        setSteps([]);
        setResult(null);
        return;
      }

      const res = iterationMethod(f, a, b, eps);

      setSteps(res.steps);
      setResult({
        root: res.root,
        iterations: res.iterations
      });

    } catch (e) {
      console.log(e.message);
      setSteps([]);
      setResult(null);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <View className="flex flex-col mx-auto w-11/12 gap-4">

          <Text className="font-bold text-xl text-zinc-900">
            Введите выражение
          </Text>

          <TextInput value={text} onChangeText={setText} placeholder="sin(x) + ln(x) + x^2"
            className="border border-zinc-900 px-2 py-1 rounded-xl placeholder:text-zinc-500"/>

          <View className="flex flex-row gap-4">
            <TextInput value={interval} onChangeText={setInterval} placeholder="0;3"
              className="border border-zinc-900 px-2 py-1 rounded-xl flex-1 placeholder:text-zinc-500" />

            <TextInput value={accuracy} onChangeText={setAccuracy} placeholder="0.001"
              className="border border-zinc-900 px-2 py-1 rounded-xl flex-1 placeholder:text-zinc-500"/>
          </View>

          <View className="flex flex-row gap-4 justify-center">
            <Pressable onPress={handleBisection} className="bg-orange-500 px-3 py-1 rounded-xl">
              <Text className="text-white font-bold">Дихотомия</Text>
            </Pressable>

            <Pressable onPress={handleIteration} className="bg-orange-500 px-3 py-1 rounded-xl">
              <Text className="text-white font-bold">Итерации</Text>
            </Pressable>
          </View>

          {/* ТАБЛИЦА */}
          <ScrollView className="h-96 border rounded-xl">

            <View className="flex flex-row bg-orange-500">
              {method === "bisection" && (
                <>
                  <Text className="flex-1 text-white p-1">k</Text>
                  <Text className="flex-1 text-white p-1">a</Text>
                  <Text className="flex-1 text-white p-1">b</Text>
                  <Text className="flex-1 text-white p-1">d</Text>
                  <Text className="flex-1 text-white p-1">mid</Text>
                  <Text className="flex-1 text-white p-1">f(a)</Text>
                  <Text className="flex-1 text-white p-1">f(b)</Text>
                  <Text className="flex-1 text-white p-1">f(mid)</Text>
                </>
              )}

              {method === "iteration" && (
                <>
                  <Text className="flex-1 text-white p-1">k</Text>
                  <Text className="flex-1 text-white p-1">x</Text>
                  <Text className="flex-1 text-white p-1">f(x)</Text>
                  <Text className="flex-1 text-white p-1">x_next</Text>
                  <Text className="flex-1 text-white p-1">Δ</Text>
                </>
              )}
            </View>

            {steps.map((row, i) => (
              <View key={i} className="flex flex-row border-b">

                {method === "bisection" && (
                  <>
                    <Text className="flex-1 p-1">{row.step}</Text>
                    <Text className="flex-1 p-1">{row.a.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.b.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.d.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.mid.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.fa.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.fb.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.fmid.toFixed(4)}</Text>
                  </>
                )}

                {method === "iteration" && (
                  <>
                    <Text className="flex-1 p-1">{row.step}</Text>
                    <Text className="flex-1 p-1">{row.x.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.fx.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.xNext.toFixed(4)}</Text>
                    <Text className="flex-1 p-1">{row.diff.toFixed(4)}</Text>
                  </>
                )}

              </View>
            ))}

          </ScrollView>

          {result && (
            <View className="p-3 bg-green-100 rounded-xl">
              <Text className="text-green-800 font-bold">
                Корень ≈ {result.root.toFixed(4)}
              </Text>
              <Text>Итераций: {result.iterations}</Text>
            </View>
          )}

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}