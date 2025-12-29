import UPNG from 'upng-js';
import {View, Text, TouchableOpacity, Modal, Button} from 'react-native';
import { Asset } from 'expo-asset';
import {useStyles, useThemeColors} from "../Styles";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

//Registry of puzzles from assets.
export const puzzleList = [
    { name: 'Target', asset: require('../assets/puzzles/Target.png'), size: "5x5" },
    { name: 'Heart', asset: require('../assets/puzzles/Heart.png'), size: "8x8" },
    { name: 'Question Mark', asset: require('../assets/puzzles/QuestionMark.png'), size: "10x10" },

    //Jam's Adjustable Mirrors Assets used via explicit permission of Lycoris Studio UK (Who I am a developer for).
    { name: 'Jam Jar', asset: require('../assets/puzzles/JamJar.png'), size: "16x16" },
    { name: 'Mirror', asset: require('../assets/puzzles/Mirror.png'), size: "64x64" },
];

/**
 * Loads the puzzle from /assets/puzzles and returns info via a matrix.
 * @param puzzle Puzzle object (get from puzzle list UI)
 */
export async function LoadPuzzle(puzzle: { name: string; asset: any; size: string }) {
    const { name, asset } = puzzle;

    //Load base png
    const assetObj = Asset.fromModule(asset);
    await assetObj.downloadAsync();
    const response = await fetch(assetObj.localUri || assetObj.uri);
    const bytes = new Uint8Array(await response.arrayBuffer());

    //Load as ARGB
    const png = UPNG.decode(bytes.buffer);
    const rgba = new Uint8Array(UPNG.toRGBA8(png)[0]);

    //Parse to Matrix
    const matrix: number[][] = [];
    for (let y = 0; y < png.height; y++) {
        const row: number[] = [];
        for (let x = 0; x < png.width; x++) {
            const i = (y * png.width + x) * 4;
            row.push(rgba[i + 3] > 0 ? 1 : 0); //All pixels are 1 unless the Alpha Channel is zero.
        }
        matrix.push(row);
    }

    //Return puzzle object with matrix.
    return { name, width: png.width, height: png.height, matrix };
}

/**qw
 * Puzzle List UI
 * @param onSelect
 * @constructor
 */
export default function PuzzleList({ onSelect }: { onSelect: (matrix: number[][]) => void }) {
    const styles = useStyles();
    const colors = useThemeColors();
    const navigation = useNavigation<any>();

    const handlePress = async (puzzle: typeof puzzleList[0]) => {
        const { matrix } = await LoadPuzzle(puzzle);
        navigation.navigate('Play', { solution: matrix });
    };

    return (
        <View style={styles.Page}>
            {puzzleList.map((puzzle, index) => (
                <TouchableOpacity activeOpacity={0.7} key={puzzle.name}  onPress={() => handlePress(puzzle)} >
                    <View style={[styles.HorizontalContainer, {backgroundColor:colors.border}]}>
                        <Text style={styles.Text}>{index} - </Text>
                        <Text style={styles.Text}>{puzzle.name}</Text>
                        <Text style={[styles.Text, { marginLeft: 'auto' }]}>{puzzle.size}</Text>
                        <Text style={[styles.Text, { marginLeft:20 }]}>00:00</Text>
                    </View>
                </TouchableOpacity>
            ))}

            <View style={[styles.HorizontalContainer, {gap:40, marginTop: 'auto', marginBottom:20, backgroundColor:null, borderColor:null, borderWidth:0}]}>
                {/* buttons row .*/}
                <TouchableOpacity style={[styles.Button, {width:150}]} onPress={() => navigation.navigate('Create')}>
                    <Ionicons name="add-outline" size={24} color="white" />
                    <Text style={{color:"#fff", marginLeft:10}}>Create Puzzle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.Button, {width:150}]} onPress={() => navigation.navigate('DrawingBoard')}>
                    <Ionicons name="download-outline" size={24} color="white" />
                    <Text style={{color:"#fff", marginLeft:10}}>Get Puzzles</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}
