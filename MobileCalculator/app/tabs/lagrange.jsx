import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions, Alert} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-gifted-charts";
import {LagrangePolynomial, LagrangePolynomialString, LagrangeError} from "../../mathFunctions/lagrange";
import "../../global.css";

export default function Lagrange() {
  const { width } = Dimensions.get("window");

  const [chartData, setChartData] = useState({
    curveData: [],
    originalPoints: [],
  });

  const [showChart, setShowChart] = useState(false);

  const [points, setPoints] = useState([
    { x: "", y: "", id: 0 },
    { x: "", y: "", id: 1 },
    { x: "", y: "", id: 2 },
  ]);

  const [xValue, setXValue] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [polynomialString, setPolynomialString] = useState("");

  const [error, setError] = useState(null);

  const [actualValue, setActualValue] = useState("");

  // Добавление точки
  const addPoint = () => {
    const newId = points.length;

    setPoints([
      ...points,
      {
        x: "",
        y: "",
        id: newId,
      },
    ]);
  };

  // Удаление точки
  const removePoint = (id) => {
    if (points.length <= 2) {
      Alert.alert("Ошибка", "Минимум 2 точки");
      return;
    }

    setPoints(points.filter((point) => point.id !== id));
  };

  // Обновление точки
  const updatePoint = (id, field, value) => {
    setPoints(
      points.map((point) =>
        point.id === id
          ? {
              ...point,
              [field]: value,
            }
          : point
      )
    );
  };

  // Генерация данных графика
  const generateChartData = (lagrangeFunc, xValues, yValues) => {
    try {
      const minX = Math.min(...xValues) - 1;
      const maxX = Math.max(...xValues) + 1;

      const step = (maxX - minX) / 120;

      const curveData = [];

      for (let x = minX; x <= maxX; x += step) {
        const y = lagrangeFunc(x);

        if (!isNaN(y) && isFinite(y)) {
          curveData.push({
            value: y,
            label: x.toFixed(1),
            x,
            hideDataPoint: true,
          });
        }
      }

      const originalPoints = xValues.map((x, index) => ({
        value: yValues[index],
        x,
        label: x.toFixed(1),

        dataPointColor: "#FF9F0A",
        dataPointRadius: 6,

        showDataPoint: true,
        hideDataPoint: false,
      }));

      return {
        curveData,
        originalPoints,
      };
    } catch (error) {
      console.error("Ошибка графика:", error);

      return {
        curveData: [],
        originalPoints: [],
      };
    }
  };

  // Вычисление
  const calculateLagrange = () => {
    const xValues = [];
    const yValues = [];

    for (let point of points) {
      if (point.x === "" || point.y === "") {
        Alert.alert("Ошибка", "Заполните все поля");
        return;
      }

      const x = parseFloat(point.x);
      const y = parseFloat(point.y);

      if (isNaN(x) || isNaN(y)) {
        Alert.alert("Ошибка", "Введите корректные числа");
        return;
      }

      xValues.push(x);
      yValues.push(y);
    }

    const uniqueX = [...new Set(xValues)];

    if (uniqueX.length !== xValues.length) {
      Alert.alert("Ошибка", "X должны быть уникальными");
      return;
    }

    if (xValue === "") {
      Alert.alert("Ошибка", "Введите x");
      return;
    }

    const xInterp = parseFloat(xValue);

    if (isNaN(xInterp)) {
      Alert.alert("Ошибка", "Некорректный x");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const lagrangeFunc = LagrangePolynomial(xValues, yValues);

        const interpolatedValue = lagrangeFunc(xInterp);

        const polynomialStr = LagrangePolynomialString(
          xValues,
          yValues
        );

        setResult(interpolatedValue);

        setPolynomialString(polynomialStr);

        // График
        const { curveData, originalPoints } =
          generateChartData(
            lagrangeFunc,
            xValues,
            yValues
          );

        setChartData({
          curveData,
          originalPoints,
        });

        setShowChart(true);

        // Погрешность
        if (actualValue.trim() !== "") {
          const actualVal = parseFloat(actualValue);

          if (!isNaN(actualVal)) {
            const errorValue = Math.abs(
              actualVal - interpolatedValue
            );

            setError({
              type: "actual",
              value: errorValue,
              message: `Фактическая погрешность`,
            });
          }
        } else {
          const errorEstimate = LagrangeError(
            xValues,
            yValues,
            xInterp
          );

          setError(errorEstimate);
        }
      } catch (error) {
        Alert.alert(
          "Ошибка вычисления",
          error.message
        );

        setError(null);
      } finally {
        setLoading(false);
      }
    }, 150);
  };

  // Очистка
  const clearAll = () => {
    setPoints([
      { x: "", y: "", id: 0 },
      { x: "", y: "", id: 1 },
      { x: "", y: "", id: 2 },
    ]);

    setXValue("");

    setResult(null);

    setPolynomialString("");

    setError(null);

    setActualValue("");

    setShowChart(false);

    setChartData({
      curveData: [],
      originalPoints: [],
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <KeyboardAvoidingView behavior={ Platform.OS === "ios" ? "padding": "height"} className="flex-1">
          <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="mt-4 mb-8">
              <Text className="text-zinc-500 text-base">
                Numerical Methods
              </Text>

              <Text className="text-white text-5xl font-bold mt-1">
                Lagrange
              </Text>
            </View>

            {/* Таблица */}
            <View className="bg-[#1C1C1E] rounded-[30px] p-5 mb-6 border border-[#2C2C2E]">
              <Text className="text-[#8E8E93] text-sm mb-5 tracking-[2px]">
                ТОЧКИ
              </Text>

              {points.map((point, index) => (
                <View key={point.id} className="flex-row items-center mb-4">
                  <TextInput
                    value={point.x}
                    onChangeText={(value) =>
                      updatePoint(point.id,"x",value)}
                    placeholder={`x${index}`}
                    placeholderTextColor="#777"
                    keyboardType="numeric"
                    className="flex-1 bg-[#2C2C2E] rounded-2xl px-4 py-4 text-white"
                  />

                  <TextInput
                    value={point.y}
                    onChangeText={(value) =>
                      updatePoint(point.id,"y",value)}
                    placeholder={`y${index}`}
                    placeholderTextColor="#777"
                    keyboardType="numeric"
                    className="flex-1 bg-[#2C2C2E] rounded-2xl px-4 py-4 text-white ml-3"
                  />

                  <Pressable
                    onPress={() =>
                      removePoint(point.id)
                    }
                    className="ml-3"
                  >
                    <Text className="text-red-500 text-3xl">
                      −
                    </Text>
                  </Pressable>
                </View>
              ))}

              <Pressable onPress={addPoint}>
                <View className="border border-dashed border-[#0A84FF] rounded-2xl py-4 items-center mt-2">
                  <Text className="text-[#0A84FF] text-lg">
                    + Добавить точку
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Интерполяция */}
            <View className="bg-[#1C1C1E] rounded-[30px] p-5 mb-6 border border-[#2C2C2E]">
              <Text className="text-[#8E8E93] text-sm mb-3 tracking-[2px]">
                ИНТЕРПОЛЯЦИЯ
              </Text>

              <TextInput
                value={xValue}
                onChangeText={setXValue}
                placeholder="Введите x"
                placeholderTextColor="#777"
                keyboardType="numeric"
                className="bg-[#2C2C2E] rounded-2xl px-4 py-4 text-white text-lg mb-5"
              />

              <Text className="text-[#8E8E93] text-sm mb-3 tracking-[2px]">
                ТОЧНОЕ ЗНАЧЕНИЕ (опционально)
              </Text>

              <TextInput
                value={actualValue}
                onChangeText={setActualValue}
                placeholder="f(x)"
                placeholderTextColor="#777"
                keyboardType="numeric"
                className="bg-[#2C2C2E] rounded-2xl px-4 py-4 text-white text-lg"
              />
            </View>

            {/* Кнопки */}
            <View className="flex-row gap-4 mb-6">
              <Pressable
                className="flex-1"
                onPress={calculateLagrange}
              >
                <View className="bg-[#0A84FF] rounded-2xl py-5">
                  <Text className="text-white text-center font-bold text-lg">
                    ВЫЧИСЛИТЬ
                  </Text>
                </View>
              </Pressable>

              <Pressable
                className="flex-1"
                onPress={clearAll}
              >
                <View className="bg-[#2C2C2E] rounded-2xl py-5">
                  <Text className="text-white text-center font-bold text-lg">
                    ОЧИСТИТЬ
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Результат */}
            {result !== null && (
              <View className="mb-6">
                <View className="bg-[#1C1C1E] rounded-[32px] p-8 items-center border border-[#2C2C2E]">
                  <Text className="text-[#8E8E93] text-sm mb-3 tracking-[2px]">
                    РЕЗУЛЬТАТ
                  </Text>

                  <Text className="text-white text-4xl font-bold text-center">
                    f({xValue}) ={" "}
                    {result.toFixed(8)}
                  </Text>
                </View>
              </View>
            )}

            {/* Погрешность */}
            {error && (
              <View className="bg-[#1C1C1E] rounded-[32px] p-6 mb-6 border border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-3 tracking-[2px]">
                  ПОГРЕШНОСТЬ
                </Text>

                <Text className="text-[#FF9F0A] text-2xl font-bold">
                  {error.value?.toExponential?.(6)}
                </Text>

                <Text className="text-[#8E8E93] mt-2">
                  {error.message}
                </Text>
              </View>
            )}

            {/* Полином */}
            {polynomialString && (
              <View className="bg-[#1C1C1E] rounded-[32px] p-6 mb-6 border border-[#2C2C2E]">
                <Text className="text-[#8E8E93] text-sm mb-4 tracking-[2px]">
                  ПОЛИНОМ ЛАГРАНЖА
                </Text>

                <ScrollView horizontal>
                  <Text className="text-white text-sm font-mono">
                    P(x) = {polynomialString}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* График */}
            {showChart &&
              chartData?.curveData?.length > 0 && (
                <View className="mb-10">
                  <View
                    className="bg-[#1C1C1E] rounded-[32px] p-6 border border-[#2C2C2E]"
                    style={{
                      shadowColor: "#000",
                      shadowOpacity: 0.25,
                      shadowRadius: 20,
                      shadowOffset: {width: 0,height: 10,},
                      elevation: 10,
                    }}
                  >
                    <Text className="text-[#8E8E93] text-sm mb-5 text-center tracking-[2px]">
                      ГРАФИК ПОЛИНОМА
                    </Text>

                    <View
                      style={{alignItems: "center",}}>
                      <LineChart
                        areaChart
                        curved
                        data={[
                          ...chartData.curveData,
                          ...chartData.originalPoints,
                        ]}
                        width={width - 80}
                        height={280}
                        color="#4F8CFF"
                        thickness={3}
                        startFillColor="#4F8CFF"
                        endFillColor="#4F8CFF"
                        startOpacity={0.35}
                        endOpacity={0.03}
                        spacing={12}
                        initialSpacing={10}
                        hideRules={false}
                        rulesColor="rgba(255,255,255,0.06)"
                        rulesType="solid"
                        yAxisColor="#3A3A3C"
                        xAxisColor="#3A3A3C"
                        yAxisTextStyle={{
                          color: "#8E8E93",
                          fontSize: 11,
                        }}
                        xAxisLabelTextStyle={{
                          color: "#8E8E93",
                          fontSize: 11,
                        }}
                        noOfSections={5}
                        maxValue={
                          Math.max(
                            ...chartData.curveData.map((d) => d.value),
                            ...chartData.originalPoints.map((d) => d.value)) * 1.15
                        }
                        minValue={
                          Math.min(
                            ...chartData.curveData.map((d) => d.value),
                            ...chartData.originalPoints.map((d) => d.value)) * 1.15
                        }
                        isAnimated
                        animationDuration={1200}
                        showVerticalLines={false}
                        pointerConfig={{
                          activatePointersOnLongPress: true,
                          pointerStripHeight: 280,
                          pointerStripColor:"#4F8CFF",
                          pointerStripWidth: 1,
                          pointerColor:"#4F8CFF",
                          radius: 6,
                          pointerLabelWidth: 120,
                          pointerLabelHeight: 70,

                          autoAdjustPointerLabelPosition: true,

                          pointerLabelComponent:
                            (items) => {
                              return (
                                <View
                                  className="bg-[#2C2C2E] rounded-2xl px-4 py-3 border border-[#3A3A3C]"
                                  style={{
                                    shadowColor:"#000",
                                    shadowOpacity:0.2,
                                    shadowRadius: 10,
                                    elevation: 5,}}
                                >
                                  <Text className="text-[#8E8E93] text-xs">
                                    x ={" "} {items[0]?.x?.toFixed(3)}
                                  </Text>

                                  <Text className="text-white text-sm font-bold mt-1">
                                    y ={" "} {items[0]?.value?.toFixed(6)}
                                  </Text>
                                </View>
                              );
                            },
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}

            {/* Loading */}
            {loading && (
              <View className="absolute inset-0 bg-black/60 justify-center items-center">
                <View className="bg-[#1C1C1E] rounded-[32px] p-8 items-center border border-[#2C2C2E]">
                  <ActivityIndicator size="large" color="#0A84FF"/>

                  <Text className="text-white mt-4 text-lg">
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