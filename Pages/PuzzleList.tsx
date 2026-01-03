import UPNG from 'upng-js';
import {View, Text, TouchableOpacity, Modal, Button, Switch} from 'react-native';
import { Asset } from 'expo-asset';
import {useStyles, useThemeColors} from "../Styles";
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {useCallback, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
 * @constructor
 */
export default function PuzzleList() {
    const styles = useStyles();
    const colors = useThemeColors();
    const navigation = useNavigation<any>();
    const [showSettings, setShowSettings] = useState(false);
    const [, invalidateLayout] = useState(0);
    useFocusEffect(useCallback(() => {invalidateLayout(n => n + 1); }, []));
    const handlePress = async (puzzle: typeof puzzleList[0]) => {
        const { matrix } = await LoadPuzzle(puzzle);
        navigation.navigate('Play', { solution: matrix, id:puzzleList.indexOf(puzzle), name:puzzle.name });
    };

    const [puzzleData, setPuzzleData] = useState<{ completed: boolean; time: string }[]>([]);
    useFocusEffect(useCallback(() => {
        Promise.all(puzzleList.map(async (_, i) => ({
            completed: await AsyncStorage.getItem('Puzzle' + i) === 'true',
            time: await AsyncStorage.getItem('PuzzleTime' + i) || '',
        }))).then(setPuzzleData);
    }, []));

    return (
        <View style={styles.Page}>
            {puzzleList.map((puzzle, index) => (
                <TouchableOpacity activeOpacity={0.7} key={puzzle.name} onPress={() => handlePress(puzzle)}>
                    <View style={[styles.HorizontalContainer, {backgroundColor: colors.border}]}>
                        {puzzleData[index]?.completed ? (
                            <Ionicons name="checkmark-circle-outline" size={28} color={colors.text} style={{marginRight: 20}} />
                        ) : (
                            <View style={{ width: 46, height: 0 }} />
                        )}
                        <Text style={styles.Text}>{puzzle.name}</Text>
                        <Text style={[styles.Text, { marginLeft: 'auto'}]}>{puzzle.size}</Text>
                        <Text style={[styles.Text, { marginLeft: 20 }]}>{puzzleData[index]?.time}</Text>
                    </View>
                </TouchableOpacity>
            ))}

            <View style={[styles.HorizontalContainer, {gap:40, marginTop: 'auto',
                marginBottom:20, backgroundColor:null, borderColor:null, borderWidth:0}]}>
                {/* buttons row .*/}
                <TouchableOpacity style={[styles.Button, {width:150}]} onPress={() => navigation.navigate('Create')}>
                    <Ionicons name="add-outline" size={24} color={"white"} />
                    <Text style={{color:"#fff", marginLeft:10}}>Create Puzzle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.Button, {width:150}]} onPress={() => navigation.navigate('DrawingBoard')}>
                    <Ionicons name="download-outline" size={24} color={"white"} />
                    <Text style={{color:"#fff", marginLeft:10}}>Get Puzzles</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.IconButton]} onPress={() => setShowSettings(true)}>
                    <Ionicons name="settings-outline" size={24} color={"white"} />
                </TouchableOpacity>
            </View>
            <SettingsPopup visible={showSettings} onClose={() => setShowSettings(false)} />
        </View>
    );
}
export function SettingsPopup({ visible, onClose }) {
  const [mistakes, setMistakes] = useState(true);
  const styles = useStyles();

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="fade" style={styles.Container}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.Container, {margin: 50}]}>
          <Text style={{ fontWeight: 'bold', marginBottom: 16 }}>Settings</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={styles.Text}>Fix mistakes</Text>
            <Switch value={mistakes} onValueChange={setMistakes} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={styles.Text}>Show timer</Text>
            <Switch value={mistakes} onValueChange={setMistakes} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={styles.Text}>Show best times</Text>
            <Switch value={mistakes} onValueChange={setMistakes} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={styles.Text}>Open to last puzzle</Text>
            <Switch value={mistakes} onValueChange={setMistakes} />
          </View>
          <TouchableOpacity onPress={onClose} style={[styles.IconButton, {alignSelf: 'center' }]}>
            <Ionicons name="close-outline" size={24} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
