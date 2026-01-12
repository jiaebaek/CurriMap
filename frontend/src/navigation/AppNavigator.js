import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { get } from '../config/api';

// Screens - 이 컴포넌트들이 실제로 존재하는지 꼭 확인하세요!
import AuthScreen from '../screens/Auth/AuthScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import RoadmapScreen from '../screens/Roadmap/RoadmapScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import MyPageScreen from '../screens/MyPage/MyPageScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import BookDetailScreen from '../screens/Book/BookDetailScreen';
import MissionProgressScreen from '../screens/Mission/MissionProgressScreen';
import ReportScreen from '../screens/Report/ReportScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Roadmap') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'MyPage') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Roadmap" component={RoadmapScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading: authLoading } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        try {
          const response = await get('/children');
          // 자녀가 있고 레벨이 배정되었는지 확인
          const complete = response.data && 
                           response.data.length > 0 && 
                           response.data[0].current_level_id !== null;
          setIsOnboardingComplete(complete);
        } catch (error) {
          console.error('Check onboarding failed:', error);
          setIsOnboardingComplete(false);
        }
      }
      setLoading(false);
    };

    if (!authLoading) {
      checkOnboarding();
    }
  }, [user, authLoading]);

  if (authLoading || (user && isOnboardingComplete === null)) {
    return null; // 로딩 중에는 아무것도 안 보여줌
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : !isOnboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen name="MissionProgress" component={MissionProgressScreen} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;