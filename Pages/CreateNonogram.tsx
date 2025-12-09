import { Button, View } from "react-native";
import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";

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
            <Button title="From Scratch" onPress={() => {}} />
            <Button title="From an Image" onPress={pickImage} />
        </View>
    );
}
