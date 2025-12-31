import {Button, Text, TouchableOpacity, View} from "react-native";
import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import {puzzleList} from "./PuzzleList";
import {useStyles} from "../Styles";

const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) { await Sharing.shareAsync(result.assets[0].uri);  }
};

export default function CreateNonogram() {
    const styles = useStyles();
    return (
        <View style={[styles.Page, {alignItems: 'center', justifyContent: 'center'}]}>
            {/* Top row buttons.*/}
            <TouchableOpacity style={[styles.Button, { margin: 20, width:200 }]} onPress={() => {}}>
                <Text style={{color:"#fff"}}>From Scratch</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.Button, { margin: 20, width:200  }]} onPress={() => {}}>
                <Text style={{color:"#fff"}}>From an image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.Button, { margin: 20, width:200  }]} onPress={() => {}}>
                <Text style={{color:"#fff"}}>Ask AI</Text>
            </TouchableOpacity>
        </View>
    );
}
