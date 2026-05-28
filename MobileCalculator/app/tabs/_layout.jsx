import { Tabs } from 'expo-router';
import { Platform, useWindowDimensions, View, Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'


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
          options={{ title: 'linear equation', tabBarIcon: ({ color, focused }) => (
              // <FontAwesome name="superscript" size={18} color="#ffffff" />
              <MaterialCommunityIcons name="chart-line" size={18} color="#ffffff" />
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
              // <MaterialCommunityIcons name="math-compass" size={18} color="#ffffff" />
              <MaterialCommunityIcons name="vector-polyline" size={18} color="#ffffff" />
            ),
          }}
        />
        <Tabs.Screen name="derivatives"
          options={{ title: 'derivatives', tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name="function-variant" size={18} color="#ffffff" />
            ),
          }}
        />
        <Tabs.Screen name="differentialEquation"
          options={{ title: 'Diff equation', tabBarIcon: ({ color, focused }) => (
              // <MaterialIcons name="data-object" size={18} color="#ffffff" />
              <MaterialCommunityIcons name="chart-bell-curve" size={18} color="#ffffff" />
            ),
          }}
        />
    </Tabs>
  );
}
