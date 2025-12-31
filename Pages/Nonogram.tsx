import {View, Text, ScrollView, Modal, TouchableOpacity, Share} from "react-native";
import {Board} from "./Board";
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback, useState, useEffect,} from "react";
import {useStopwatch} from "react-timer-hook";
import {useStyles} from "../Styles";
import {storage} from "./PuzzleList";
import {Ionicons} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import Confetti from 'react-native-reanimated-confetti';
export default function Nonogram() {
    const [visible, setVisible] = useState(false);
    const Styles = useStyles();
    const navigation = useNavigation();

    const route = useRoute();
    const solution = route.params?.solution as number[][] | undefined;
    const {seconds, minutes, start, pause} = useStopwatch();
    const [hasWon, setHasWon] = useState(false);
    const [, invalidateLayout] = useState(0);

    //Visually center the board, as the clues will offset it without appropiate padding.
    const getClues = (line: number[]): number[] => {
        const clues: number[] = [];
        let count = 0;
        for (const cell of line) {
            if (cell === 1) count++;
            else if (count > 0) {
                clues.push(count);
                count = 0;
            }
        }
        if (count > 0) clues.push(count);
        return clues.length ? clues : [0];
    };
    const rowClues = solution.map(getClues);
    const colClues = solution[0].map((_, c) => getClues(solution.map(r => r[c])));
    const clueWidth = Math.max(...rowClues.map(c => c.length)) * 20;
    const clueHeight = Math.max(...colClues.map(c => c.length)) * 20;

    //Use a stable key from the solution
    const boardKey = JSON.stringify(solution);
    useFocusEffect(useCallback(() => {invalidateLayout(n => n + 1); }, []));

    useEffect(() => {
        if (hasWon) {
            storage.set('Puzzle' + route.params?.id, true);
            let best = storage.getString('PuzzleTime' + route.params?.id);

            if (best == undefined) { //No best time
                storage.set('PuzzleTime' + route.params?.id, String(minutes).padStart(2, '0') +
                    ':' + String(seconds).padStart(2, '0'));
            }
            else{ // Compare current time and best times
                const inttime = parseInt(best.split(':')[0]) + parseInt(best.split(':')[1])/60;
                const currtime = minutes + seconds/60;
                if (currtime < inttime){ //New Best time
                    storage.set('PuzzleTime' + route.params?.id, String(minutes).padStart(2, '0') +
                        ':' + String(seconds).padStart(2, '0'));
                }
            }
            //Get new best time to show in prompt
            const BestTime = storage.getString('PuzzleTime' + route.params?.id);
            setVisible(true);
            pause();
        }
    }, [hasWon]);

    return (
        <View style={[Styles.Page, {margin: 0, flex: 1}]}>
            {/*Timer*/}
            <Text style={[Styles.Text, {textAlign: 'center', fontSize: 32, margin: 10}]}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Text>

            {/*Scrollable main nonogram board.*/}
            <ScrollView horizontal contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={{flex: 1}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingRight: clueWidth, paddingBottom: clueHeight }}>
                        <Board key={boardKey} solution={solution} cellSize={40} onWin={() => setHasWon(true)}/>
                    </View>
                </ScrollView>
            </ScrollView>


            {/*Shown when complete*/}

            {visible && (<Confetti count={150} origin={{ x: 500 / 2, y: 0 }} fadeOut/> )}
            <Modal visible={visible} animationType="slide" transparent={true}
                   onRequestClose={() => setVisible(false)}>
                <View style={[{flex: 1, justifyContent: 'center', alignItems:'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                    <View style={[Styles.Container, {height:350, width:300}]}>
                        <Text style={[Styles.Text, {textAlign: 'center', fontSize:32, marginBottom:30}]} >Solved! </Text>
                        <Text style={[Styles.Text, {textAlign: 'center'}]} >Your Time: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} </Text>
                        <Text style={[Styles.Text, {textAlign: 'center', marginTop:10}]} >Best Time: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}  </Text>
                        <Text style={[Styles.Text, {textAlign: 'center', marginTop:10}]} >Mistakes: NOT IMPL </Text>

                        <TouchableOpacity style={[{marginTop:'auto', alignSelf:'center'}]} onPress={() => {
                                const shareScore = async () => {
                                    await Share.share({
                                        message:"I beat the "+ route.params['name']+" puzzle in " + minutes + ':' +seconds+"!\n Can you beat me?",
                                    });
                                };
                                shareScore();
                            }}>
                            <Ionicons name="share-social-outline" size={24} color={"white"}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.IconButton, {marginTop:'auto', alignSelf:'center'}]}
                                          onPress={() => navigation.goBack()}>
                            <Ionicons name="close-outline" size={24} color={"white"}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
