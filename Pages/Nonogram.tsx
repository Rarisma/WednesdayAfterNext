import {View, Text, ScrollView, Modal, Button} from "react-native";
import {Board} from "./Board";
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback, useState, useEffect,} from "react";
import {useStopwatch} from "react-timer-hook";
import {useStyles} from "../Styles";

export default function Nonogram() {
    const [visible, setVisible] = useState(false);
    const Styles = useStyles();

    const route = useRoute();
    const solution = route.params?.solution as number[][] | undefined;
    const {seconds, minutes, start, pause} = useStopwatch();

    if (!solution || !Array.isArray(solution) || !Array.isArray(solution[0])) {
        return (
            <View>
                <Text>Select a puzzle first!</Text>
            </View>
        );
    }

    //Visually centre the board, as the clues will offset it without appropiate padding.
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
    let Completed = false;
    return (
        <View style={[Styles.Page, {margin: 0, flex: 1}]}>
            {/*Timer*/}
            <Text style={[Styles.Text, {textAlign: 'center', fontSize: 32, margin: 10}]}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Text>

            {/*Scrollable main nonogram board.*/}
            <ScrollView horizontal contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} style={{flex: 1}}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: clueWidth,
                        paddingBottom: clueHeight
                    }}>
                        <Board key={boardKey} solution={solution} cellSize={40} onWin={() => {
                            Completed = true;
                            setVisible(true);
                            pause();
                        }}/>
                    </View>
                </ScrollView>
            </ScrollView>

            <Modal visible={Completed} animationType="slide" transparent={true}
                   onRequestClose={() => setVisible(false)}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={{margin: 20, padding: 20, backgroundColor: 'white', borderRadius: 10}}>
                        <Text>Modal Content</Text>
                        <Button title="Close" onPress={() => setVisible(false)}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
