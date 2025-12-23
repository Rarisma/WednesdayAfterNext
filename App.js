import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import PuzzleList from "./Pages/PuzzleList";
import Nonogram from "./Pages/Nonogram";
import {useStyles} from "./Styles";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();



export default function App() {
    const Styles = useStyles();

    return (
        <GestureHandlerRootView style={[Styles.Container, {flex: 1, margin:0, padding: 0}]} >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <NavigationContainer>
                    <Stack.Navigator>
                        {/*No header as there's a tabview in the main area.*/}
                        <Stack.Screen name="default" component={PuzzleList} options={{ headerShown: false }} />

                        {/*overridden header as it looks terrible (has a  huge chin on my S24U)*/}
                        <Stack.Screen name="Play" component={Nonogram}
                                      options={{ headerTransparent: true, headerTitle:"" }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
