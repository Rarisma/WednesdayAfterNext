import * as React from 'react';
import { View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Sharing from 'expo-sharing';
import { Image } from 'expo-image';
import OldBoard from "./Pages/OldBoard";
import CreateNonogram from "./Pages/CreateNonogram";
import PuzzleList from "./Pages/PuzzleList";
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BoardTest from "./Pages/BoardTest";
import {useStyles} from "./Styles";

const Tab = createBottomTabNavigator();

function ShareTest() {
    const onShare = async () => { await Sharing.shareAsync("file://assets/adaptive-icon.png") }
    return(
        <View>
            <Image source="assets/adaptive-icon.png" />
            <Button title="Share" onPress={onShare}/>
        </View>
    );
}


export default function App() {
    const Styles = useStyles();
    return (
        <GestureHandlerRootView style={[Styles.Container, {flex: 1, margin:0, padding: 0}]} >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <NavigationContainer>
                    <Tab.Navigator
                      screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarIcon: ({color, size }) => {

                          let iconName;

                          if (route.name === 'Puzzle Select') iconName = 'grid';
                          else if (route.name === 'Play') iconName = 'play';
                          else if (route.name === 'Create') iconName = 'create';
                          else if (route.name === 'ShareTest') iconName = 'share';

                          return <Ionicons name={iconName} size={size} color={color} />;
                        },
                      })}>
                        <Tab.Screen name="Puzzle Select" component={PuzzleList}/>
                        <Tab.Screen name="Play" component={BoardTest} />
                        <Tab.Screen name="Create" component={CreateNonogram} />
                        <Tab.Screen name="ShareTest" component={ShareTest} />
                    </Tab.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
