import { Tabs } from 'expo-router';
import { Platform, useWindowDimensions, View, Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function TabLayout() {
  const { width } = useWindowDimensions();

  const hideOnWebMobile = Platform.OS === "web" && width > 768
  return (
    <Tabs
        screenOptions={{
          tabBarStyle: [
            {
              backgroundColor: "#27272a",
              height: Platform.OS === "android" ? 80 : 60,
              gap: 3,
              display: "flex",
              borderWidth:0,
              borderBlockColor:"#27272a"
            },
            hideOnWebMobile && { display: "none" },
          ],
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          headerShown: false,
          tabBarActiveTintColor: "#ff6900",
        }}>
        <Tabs.Screen name="index"
          options={{ title: 'Home', tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name="function-variant" size={18} color="#ffffff" />
            ),
          }}
        />
        <Tabs.Screen name="integrals"
          options={{ title: 'integrals', tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name="math-integral" size={18} color="#ffffff" />
            ),
          }}
        />
        <Tabs.Screen name="lagrange"
          options={{ title: 'lagrange', tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name="math-compass" size={18} color="#ffffff" />
            ),
          }}
        />
    </Tabs>
  );
}
