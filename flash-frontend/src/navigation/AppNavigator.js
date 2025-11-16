import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/authContext.js';
import { View, Text } from 'react-native';
import LoginScreen from '../../app/authPages/LoginScreen.js';
import RegisterScreen from '../../app/authPages/RegisterScreen.js';
import MapScreen from '../../app/pages/MapScreen.js';
import AddChargerScreen from '../../app/pages/AddChargerScreen.js';
import ProfileScreen from '../../app/pages/ProfileScreen.js';
import { ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack(){
    return(
        <Stack.Navigator screenOptions={{ headerShown: false, }}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
        </Stack.Navigator>
    );
}

function AppTabs(){
    return(
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            },
      }}
      >

        <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
            tabBarLabel: 'Mapa',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="map" size={size} color={color}/>
            ),
        }}
        />

        <Tab.Screen
        name="AddCharger"
        component={AddChargerScreen}
        options={{
            tabBarLabel: 'Adicionar',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="add-circle" size={size} color={color}/>
            ),
        }}
        />

        <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color}/>
            ),
        }}
        />
        </Tab.Navigator>

    )
}

export default function AppNavigator(){
    const { signed, loading } = useAuth();

    if(loading){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF"/>
                <Text style={{ marginTop: 10 }}>Carregando...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {signed ? <AppTabs/> : <AuthStack/>}
        </NavigationContainer>
    )
}