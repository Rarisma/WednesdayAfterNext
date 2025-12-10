import UPNG from 'upng-js';
import {View, Text, ActivityIndicator, Button, Pressable, TouchableOpacity} from 'react-native';
import {Asset} from 'expo-asset';
import {useThemeColors} from "../Styles";

const puzzleList = [
    {name: 'Target', asset: require('../assets/puzzles/Target.png'), size: "5x5"},
    {name: 'Heart', asset: require('../assets/puzzles/Heart.png'), size: "8x8"},
];


async function LoadPuzzle(puzzle: { name: string; asset: any; size: string; }){
    //Load asset from resources
    const assetObj = Asset.fromModule(asset);
    await assetObj.downloadAsync();
    const response = await fetch(assetObj.localUri || assetObj.uri);
    const bytes = new Uint8Array(await response.arrayBuffer());

    //Decode properly to png file
    const png = UPNG.decode(bytes.buffer);
    const rgba = UPNG.toRGBA8(png)[0];
    return {name, width: png.width, height: png.height, data: new Uint8Array(rgba)};
}

export default function PuzzleList() {
    const colors = useThemeColors();
    return (
        <View>
            {puzzleList.map((puzzle) => (
                <TouchableOpacity activeOpacity={0.7} key={puzzle.name} onPress={() => LoadPuzzle(puzzle)}>
                    <View style={{
                        flexDirection: 'row', gap: 8, borderColor: colors.border,
                        borderWidth: 5, borderRadius: 5, backgroundColor: colors.border, margin: 10, padding: 10
                        }}>
                        <Text style={{fontSize: 20}}>{puzzleList.indexOf(puzzle)} - </Text>
                        <Text style={{fontSize: 20}}>{puzzle.name}</Text>
                        <Text style={{fontSize: 20}}>{puzzle.size}</Text>
                        <Text style={{fontSize: 20, marginLeft: 'auto'}}>00:00</Text>
                    </View>
                </TouchableOpacity>

            ))}
        </View>
    );
}
