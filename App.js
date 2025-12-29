import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import PuzzleList from "./Pages/PuzzleList";
import Nonogram from "./Pages/Nonogram";
import {useStyles} from "./Styles";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import DrawingBoard from "./Pages/DrawingBoard";
import CreateNonogram from "./Pages/CreateNonogram";
const Stack = createNativeStackNavigator();



export default function App() {
    const Styles = useStyles();

    //https://react-native-google-signin.github.io/docs/original
    //Configure google sign in for firebase auth
    GoogleSignin.configure({ webClientId: '925279293004-7s5gcr2kv7uioa6oh7bdqnlee78m87hp.apps.googleusercontent.com'});

    return (
        <GestureHandlerRootView style={Styles.Page} >
            <SafeAreaView style={Styles.Page} edges={['top']}>
                <NavigationContainer>
                    <Stack.Navigator>
                        {/*No header as there's a tabview in the main area.*/}
                        <Stack.Screen name="default" component={PuzzleList} options={{ headerShown: false }} />

                        {/*overridden header as it looks terrible (has a  huge chin on my S24U)*/}
                        <Stack.Screen name="Play" component={Nonogram} options={{ headerShown: false  }}/>
                        <Stack.Screen name="DrawingBoard" component={DrawingBoard} options={{ headerShown: false  }}/>
                        <Stack.Screen name="Create" component={CreateNonogram} options={{ headerShown: false  }}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
