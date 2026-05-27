import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { parseExpression } from "../../mathFunctions/parseExpression";
import { IntegrationSquare } from "../../mathFunctions/IntegrationSquare";
import { IntegrationTrapeze } from "../../mathFunctions/IntegrationTrapeze";
import { IntegrationSimpson } from "../../mathFunctions/IntegrationSimpson";
import { IntegrationNewtonCotes } from "../../mathFunctions/integrationNewtonCotes";
import "../../global.css";

export default function Integrals() {
  const [func, setFunc] = useState('');
  const [interval, setInterval] = useState('');
  const [steps, setSteps] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);
  const [table, setTable] = useState(false);
  const [points, setPoints] = useState([
    { x: "", y: "", id: 0 },
    { x: "", y: "", id: 1 },
    { x: "", y: "", id: 2 }
  ]);
  const [xValue, setXValue] = useState("");

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
        } catch (error) {
          alert("Ошибка при вычислении: " + error.message);
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
    };


  function handleSquare(f, a, b, n) { return IntegrationSquare(f, a, b, n); }
  function handleTrapeze(f, a, b, n) { return IntegrationTrapeze(f, a, b, n); }
  function handleSimpson(f, a, b, n) { return IntegrationSimpson(f, a, b, n); }
  function handleNewtonCotes(f, a, b, n) { return IntegrationNewtonCotes(f, a, b, n); }

  return (
  <SafeAreaProvider>
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5" >
          {/* Header */}
          <View className="mt-4 mb-8">
            <Text className="text-zinc-500 text-base">
              Numerical Methods
            </Text>

            <Text className="text-white text-5xl font-bold mt-1">
              integrals
            </Text>
          </View>

          <Pressable onPress={() => setTable(!table)}
            className="w-full h-20 rounded-3xl px-5 flex-row mb-6 items-center justify-between bg-[#1C1C1E]">
            
            <View>
              <Text className="text-white text-xl font-bold">
                {table ? "Table" : "Analytic"}
              </Text>
            </View>

            <View className={`w-16 h-9 rounded-full px-1 justify-center ${table ? "bg-blue-500" : "bg-zinc-500"}`} >
              <View className={` w-7 h-7 rounded-full bg-white ${table ? "ml-auto" : "ml-0"} `}/>
            </View>
          </Pressable>

          {/* Inputs */}
          {!table && (
            <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">

              <View className="px-5 py-4 border-b border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Функция
                </Text>

                <TextInput value={func} onChangeText={setFunc} placeholder="sin(x)+ln(x)+x²" placeholderTextColor="#8E8E93" className="text-white text-lg" />
              </View>

              <View className="px-5 py-4 border-b border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Интервал
                </Text>

                <TextInput value={interval} onChangeText={setInterval} placeholder="0;3" placeholderTextColor="#8E8E93" className="text-white text-lg"/>
              </View>

              <View className="px-5 py-4">
                <Text className="text-[#8E8E93] text-sm mb-2">
                  Количество шагов
                </Text>

                <TextInput value={steps} onChangeText={setSteps} keyboardType="numeric" placeholder="100" placeholderTextColor="#8E8E93" className="text-white text-lg" />
              </View>

            </View>
          )}

          {table && (
            <>
           <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-2">
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

            <Pressable onPress={clearAll} className="flex-1 mb-6 ">
              <View className="bg-[#1C1C1E]  py-4 rounded-2xl">
                <Text className="text-white text-center font-semibold text-lg">
                  ОЧИСТИТЬ
                </Text>
              </View>
            </Pressable>
            </>
          )}
          

          {/* Methods */}
          <Text className="text-[#8E8E93] text-sm mb-3 ml-1">
            МЕТОД
          </Text>

          <View className="bg-[#1C1C1E] rounded-[28px] overflow-hidden mb-6">

            {methods.map((method, index) => (
              <Pressable key={method.id} onPress={() => handleCalculation(method.handler, method.id)}>
                {({ pressed }) => (
                  <View
                    className={` px-5 py-5 flex-row items-center justify-between
                      ${ index !== methods.length - 1 ? "border-b border-[#2C2C2E]": ""}`}
                    style={{ backgroundColor: activeMethod === method.id ? "#2C2C2E" : pressed ? "#252527" : "#1C1C1E",}}>
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
                {typeof result === "number" ? result.toFixed(8) : result}
              </Text>

            </View>
          )}

          {/* Loading */}
          {loading && (
            <View className="absolute inset-0 bg-black/30 justify-center items-center">

              <View className="bg-[#1C1C1E] rounded-[28px] p-8 items-center">

                <ActivityIndicator size="large" color="#0A84FF"/>

                <Text className="text-white mt-4">
                  Вычисление...
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