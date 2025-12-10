import * as React from 'react';
import { View, Button, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Sharing from 'expo-sharing';
import { Image } from 'expo-image';
import OldBoard from "./Pages/OldBoard";
import CreateNonogram from "./Pages/CreateNonogram";
import PuzzleList from "./Pages/PuzzleList";
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function ShareTest() {
    const onShare = async () => {
        await Sharing.shareAsync("file://assets/adaptive-icon.png")
    }
    return(
        <View>
            <Image source="assets/adaptive-icon.png" />
            <Button title="Share" onPress={onShare}/>
        </View>
    );
}


export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Puzzle Select') iconName = 'grid';
                  else if (route.name === 'Play') iconName = 'play';
                  else if (route.name === 'Create') iconName = 'create';
                  else if (route.name === 'ShareTest') iconName = 'share';

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}>
                <Tab.Screen name="Puzzle Select" component={PuzzleList}/>
                <Tab.Screen name="Play" component={OldBoard} />
                <Tab.Screen name="Create" component={CreateNonogram} />
                <Tab.Screen name="ShareTest" component={ShareTest} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
