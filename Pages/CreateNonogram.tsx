import {Button, Text, TouchableOpacity, View} from "react-native";
import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import {puzzleList} from "./PuzzleList";

const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
        await Sharing.shareAsync(result.assets[0].uri);
    }
};

export default function CreateNonogram() {
    return (
        <View>
            <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                {/* Top row buttons.*/}
                <TouchableOpacity style={{borderRadius: 64,  backgroundColor: "#19647E", width:150, height:50,
                    alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color:"#fff", }}>From Scratch</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{borderRadius: 64,  backgroundColor: "#19647E", width:150, height:50,
                    alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color:"#fff", }}>From an image</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
