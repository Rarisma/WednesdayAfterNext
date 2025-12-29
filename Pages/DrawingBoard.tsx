import {GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {Text, TouchableOpacity, View} from "react-native";
import auth from '@react-native-firebase/auth';
import { Image } from 'expo-image';
import {useStyles, useThemeColors} from "../Styles";
import {Ionicons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {collection, getFirestore, limit, query} from '@react-native-firebase/firestore';

const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const { data } = await GoogleSignin.signIn();

        const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
        await auth().signInWithCredential(googleCredential);
    }
    catch (error) {console.error(error); }
};

export default function DrawingBoard() {
    const [, invalidateLayout] = useState(0);
    const User = GoogleSignin.getCurrentUser();
    const Styles = useStyles();
    const colors = useThemeColors();
    const [puzzles, setPuzzles] = useState([]);
    const [iconsVisible, setIconsVisible] = useState(false);

    useEffect(() => {
        const fetchPuzzles = async () => {
            const snapshot = await query(collection(getFirestore(), 'Levels'), limit(20)).get();
            setPuzzles(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        };
        fetchPuzzles();
    }, []);

    if (User == null){
        return (
            <View style={[Styles.Page, {alignItems:'center', justifyContent:'center'}]}>
                <TouchableOpacity style={[Styles.Button,{width:400, justifyContent:'center'}]} onPress={signInWithGoogle}>
                    <GoogleSigninButton size={GoogleSigninButton.Size.Icon} onPress={signInWithGoogle}/>
                    <Text style={[Styles.Text, {marginLeft:20}]} >Sign in with Google</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[Styles.Page]}>
            <View style={[Styles.HorizontalContainer,{ alignItems:'center', justifyContent:'flex-start'}]}>
                <Image source={{ uri: User.user.photo }} style={{ width: 40, height: 40, borderRadius: 20, marginRight:15 }}/>
                <Text style={Styles.Text}>Hi {User.user.name.split(' ')[0]}!</Text>
                <Text style={[Styles.Text, {marginLeft:'auto', marginRight:20}]}>Solved:XX</Text>

                {/*Search, Icons and Logoff buttons*/}
                <TouchableOpacity style={[Styles.Button,{width:50, justifyContent:'center', marginRight:10}]}
                                  onPress={async () => { setIconsVisible(!iconsVisible); }}>
                        <Ionicons name={iconsVisible ? "eye-outline" : "eye-off-outline"} size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[Styles.Button,{width:50, justifyContent:'center', marginRight:10}]}
                                  onPress={async () => { }}>
                    <Ionicons name="search-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[Styles.Button,{width:50, justifyContent:'center'}]}
                                  onPress={async () => {
                                      await GoogleSignin.signOut();
                                      await auth().signOut();
                                      invalidateLayout(x => x + 1);
                                  }}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {puzzles.map((puzzle, _) => (
                <TouchableOpacity activeOpacity={0.7} key={puzzle.id}   >
                    <View style={[Styles.HorizontalContainer, {backgroundColor:colors.border}]}>
                        {iconsVisible &&
                        (
                            <Image source={{ uri: `data:image/png;base64,${puzzle['LevelData']}` }} contentFit='fill'
                                   cachePolicy="none"
                                   style={{ width: 20, height: 20, backgroundColor: '#f0f0f0', borderRadius: 20, marginRight:20}}
                            />
                        )}

                        <Text style={Styles.Text}>{puzzle['Name']}</Text>
                        <Text style={[Styles.Text, { marginLeft: 'auto' }]}>{puzzle['Width']}x{puzzle['Height']}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

