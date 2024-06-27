import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { NavigationContainer, getFocusedRouteNameFromRoute, useRoute, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from '@expo/vector-icons/Ionicons';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "./store/store";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { loginSuccess } from "./store/authSlice";

import WelcomeScreen from "./screens/auth/WelcomeScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import EmailActivationScreen from "./screens/auth/EmailActivationScreen";

import HomeScreen from "./screens/home/HomeScreen";
import HealthDataReportScreen from "./screens/home/HealthDataReportScreen";
import MedicationReminderScreen from "./screens/home/MedicationReminderScreen";

import UserScreen from "./screens/user/UserScreen";
import UserProfileScreen from "./screens/user/UserProfileScreen";

import DeviceManagementScreen from "./screens/DeviceManagementScreen";

import MedicalScreen from "./screens/medical/MedicalScreen";
import MedicalResultScreen from "./screens/medical/MedicalResultScreen";
import ChatBotScreen from "./screens/medical/ChatBotScreen";

import CommunityMainScreen from "./screens/community/CommunityMainScreen";
import NewBlogScreen from "./screens/community/NewBlogScreen";
import BlogDetailScreen from "./screens/community/BlogDetailScreen";

import Colors from "./constants/Colors";
import Sizes from "./constants/Sizes";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "dm-bold": require("./assets/fonts/DMSans-Bold.ttf"),
    "dm-regular": require("./assets/fonts/DMSans-Regular.ttf"),
    "dm-m": require("./assets/fonts/DMSans-Medium.ttf"),
  });

  function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen
          name="EmailActivation"
          component={EmailActivationScreen}
        />
      </Stack.Navigator>
    );
  }

  const useHideTabsHook = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const tabShownRoutes = [
      "CommunityBase",
      "HomeBase",
      "MedicalBase",
      "UserBase",
    ];
    React.useLayoutEffect(() => {
      const routeName = getFocusedRouteNameFromRoute(route);
      if (tabShownRoutes.includes(routeName) || routeName == undefined) {
        navigation.setOptions({
          tabBarStyle: {
            display: 'flex',            
            backgroundColor: Colors.grey100,
          }
        });
      } else {
        navigation.setOptions({ tabBarStyle: { display: "none" } });
      }
    }, [navigation, route]);
  };

  function Home() {
    useHideTabsHook();
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "dm-bold",
            fontSize: Sizes.s18,
          },
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="HomeBase"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{ title: "Health Data Report" }}
          name="HealthDataReport"
          component={HealthDataReportScreen}
        />
        <Stack.Screen
          options={{ title: "Device Management" }}
          name="DeviceManagement"
          component={DeviceManagementScreen}
        />
        <Stack.Screen
          options={{ title: "Medication Reminder" }}
          name="MedicationReminder"
          component={MedicationReminderScreen}
        />
      </Stack.Navigator>
    );
  }

  function User() {
    useHideTabsHook();
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "dm-bold",
            fontSize: Sizes.s18,
          },
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="UserBase"
          component={UserScreen}
        />
        <Stack.Screen
          options={{ title: "User Profile Setting" }}
          name="UserProfileSetting"
          component={UserProfileScreen}
        />
        <Stack.Screen
          options={{ title: "Device Management" }}
          name="DeviceManagement"
          component={DeviceManagementScreen}
        />
      </Stack.Navigator>
    );
  }

  function Medical() {
    useHideTabsHook();
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "dm-bold",
            fontSize: Sizes.s18,
          },
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="MedicalBase"
          component={MedicalScreen}
        />
        <Stack.Screen
          options={{ title: "Search Result" }}
          name="MedicalResult"
          component={MedicalResultScreen}
        />
        <Stack.Screen
          options={{ title: "Chat Bot AI" }}
          name="ChatBot"
          component={ChatBotScreen}
        />
      </Stack.Navigator>
    );
  }

  function Community() {
    useHideTabsHook();
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "dm-bold",
            fontSize: Sizes.s18,
          },
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="CommunityBase"
          component={CommunityMainScreen}
        />
        <Stack.Screen
          options={{ title: "New Blog" }}
          name="NewBlog"
          component={NewBlogScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="BlogDetail"
          component={BlogDetailScreen}
        />
      </Stack.Navigator>
    );
  }

  function AuthenticateStack() {
    return (
      <Tab.Navigator
        initialRouteName="Community"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: Sizes.xs14,
            fontFamily: "dm-m",
            marginBottom: 3,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") iconName = "home";
            else if (route.name === "Medical") iconName = "medkit";
            else if (route.name === "User") iconName = "person";
            else if (route.name === "Community") iconName = "apps";

            return <Ionicons name={iconName} size={26} color={color} />;
          },
          contentOptions: {
            backgroundColor: '#fff'
          },
          tabBarActiveTintColor: Colors.green300,
          tabBarInactiveTintColor: Colors.grey400,
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Medical" component={Medical} />
        <Tab.Screen name="Community" component={Community} />
        <Tab.Screen name="User" component={User} />
      </Tab.Navigator>
    );
  }

  function Navigation() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
      <NavigationContainer>
        {!isAuthenticated && <AuthStack />}
        {isAuthenticated && <AuthenticateStack />}
      </NavigationContainer>
    );
  }

  function Root() {
    const [isTryingLogin, setIsTryingLogin] = useState(true);

    useEffect(() => {
      async function fetchToken() {
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          store.dispatch(loginSuccess(storedToken));
        }

        setIsTryingLogin(false);
      }

      fetchToken();
    }, []);

    useEffect(() => {
      async function hideSplashScreen() {
        await SplashScreen.hideAsync();
      }

      hideSplashScreen();
    }, []);

    if (!fontsLoaded || isTryingLogin) {
      return null;
    }
    return <Navigation />;
  }

  return (

    <GestureHandlerRootView style={{ flex: 1 }} >
      <StatusBar style="auto" />
      <Provider store={store}>
        <Root />
      </Provider>
    </GestureHandlerRootView>
  );
}
