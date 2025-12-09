import * as React from 'react';
import { View, Button, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Sharing from 'expo-sharing';
import { Image } from 'expo-image';
import OldBoard from "./Pages/OldBoard";
import CreateNonogram from "./Pages/CreateNonogram";
import PuzzleList from "./Pages/PuzzleList";
import { toByteArray } from 'base64-js';

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
            <Tab.Navigator>
                <Tab.Screen name="Puzzle Select" component={PuzzleList}/>
                <Tab.Screen name="Play" component={OldBoard} />
                <Tab.Screen name="Create" component={CreateNonogram} />
                <Tab.Screen name="ShareTest" component={ShareTest} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
