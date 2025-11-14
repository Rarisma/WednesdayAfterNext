import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {useState} from "react";
const Tab = createBottomTabNavigator();

function HomeScreen() {
    const [fillColor, setFillColor] = useState('white');
    return (
        <View style={styles.container}>
            <Text>WednesdayAfterNext Board</Text>
            <Pressable
                style={({ pressed }) => [
                    {
                        width: 30,
                        height: 30,
                        backgroundColor: fillColor,
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 4,
                        transform: [{ scale: pressed ? 0.9 : 1 }]
                    }
                ]}
                onPress={() => setFillColor(prev => prev === 'white' ? 'black' : 'white')}/>
            <StatusBar style="auto" />
        </View>
    );
}
function Create() {
    return (
        <View style={styles.container}>
            <Text>Create Menu</Text>
        </View>
    );
}

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Puzzle Select" component={HomeScreen} />
                <Tab.Screen name="Create" component={HomeScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
