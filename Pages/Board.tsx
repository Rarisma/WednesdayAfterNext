import React, {useState, useMemo, useRef, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useStyles} from "../Styles";

//0 - Empty, 1 - Filled, 2 - X
type CellState = 0 | 1 | 2;

interface NonogramProps {
    solution: number[][];
    cellSize?: number;
    onWin?: () => void;
}

/**
 * Generates clues for a nonogram.
 * @param line Line of cells (0, empty; 1, filled)
 * @returns Array of clues
 */
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

export function Board({solution, cellSize = 20, onWin}: NonogramProps) {
    //Get size of solutions.
    const rows = solution.length;
    const cols = solution[0].length;

    //Check solution is provided
    if (solution == null) {return (<Text>Select a puzzle first!</Text>);}
    const styles = useStyles();

    const [grid, setGrid] = useState<CellState[][]>(() =>
        Array(rows).fill(null).map(() => Array(cols).fill(0))
    );

    const dragMode = useRef<CellState | null>(null);
    const visited = useRef(new Set<string>());

    const rowClues = useMemo(() => solution.map(getClues), [solution]);
    const colClues = useMemo(
        () => Array.from({length: cols}, (_, c) => getClues(solution.map(r => r[c]))),
        [solution, cols]
    );

    //calc clue sizes
    const maxRowClue = Math.max(...rowClues.map(c => c.length));
    const maxColClue = Math.max(...colClues.map(c => c.length));
    const clueWidth = maxRowClue * 20;
    const clueHeight = maxColClue * 20;

    const posToCell = useCallback((x: number, y: number) => {
        const col = Math.floor((x - clueWidth) / cellSize);
        const row = Math.floor((y - clueHeight) / cellSize);
        return row >= 0 && row < rows && col >= 0 && col < cols ? {row, col} : null;
    }, [clueWidth, clueHeight, cellSize, rows, cols]);

    const hasWon = useMemo(() =>
        grid.every((row, ri) => row.every((cell, ci) =>
            (cell === 1) === (solution[ri][ci] === 1)
        )), [grid, solution]);

    useEffect(() => {
        if (hasWon) {
            onWin?.();
        }
    }, [hasWon, onWin]);

    const setCell = useCallback((r: number, c: number, state: CellState) => {
        setGrid(prev => {
            const next = prev.map(row => [...row]);
            next[r][c] = state;
            return next;
        });
    }, []);

    const toggleCell = useCallback((x: number, y: number, crossMode: boolean) => {
        const cell = posToCell(x, y);
        if (!cell) return;
        const current = grid[cell.row][cell.col];
        if (crossMode) { setCell(cell.row, cell.col, current === 2 ? 0 : 2); }
        else {setCell(cell.row, cell.col, current === 1 ? 0 : 1);}
    }, [grid, posToCell, setCell]);

    const startDrag = useCallback((x: number, y: number, crossMode: boolean) => {
        visited.current.clear();
        const cell = posToCell(x, y);
        if (!cell) {
            dragMode.current = null;
            return;
        }
        const current = grid[cell.row][cell.col];
        if (crossMode) {dragMode.current = current === 2 ? 0 : 2;}
        else {dragMode.current = current === 1 ? 0 : 1;}
        visited.current.add(`${cell.row},${cell.col}`);
        setCell(cell.row, cell.col, dragMode.current);
    }, [grid, posToCell, setCell]);

    const continueDrag = useCallback((x: number, y: number) => {
        if (dragMode.current === null) return;
        const cell = posToCell(x, y);
        if (!cell) return;
        const key = `${cell.row},${cell.col}`;
        if (visited.current.has(key)) { return; }
        visited.current.add(key);
        setCell(cell.row, cell.col, dragMode.current);
    }, [posToCell, setCell]);

    const endDrag = useCallback(() => {
        dragMode.current = null;
        visited.current.clear();
    }, []);

    // Tap for single fill
    const tap = Gesture.Tap()
        .maxDuration(250)
        .runOnJS(true)
        .onEnd((e) => toggleCell(e.x, e.y, false));

    // Long press for single cross
    const longPress = Gesture.LongPress()
        .minDuration(300)
        .onStart((e) => toggleCell(e.x, e.y, true));

    // Pan for fill drag (needs some movement to activate)
    const fillPan = Gesture.Pan()
        .minDistance(10)
        .runOnJS(true)
        .onStart((e) => startDrag(e.x, e.y, false))
        .onUpdate((e) => continueDrag(e.x, e.y))
        .onEnd(endDrag);

    // Pan for cross drag (requires long press first)
    const crossPan = Gesture.Pan()
        .activateAfterLongPress(300)
        .runOnJS(true)
        .onStart((e) => startDrag(e.x, e.y, true))
        .onUpdate((e) => continueDrag(e.x, e.y))
        .onEnd(endDrag);

    const gesture = Gesture.Race(crossPan, fillPan, Gesture.Exclusive(longPress, tap));

    return (
        <GestureDetector gesture={gesture}>
            <View style={styles.Page}>
                <View style={s.row}>
                    <View style={{width: clueWidth, height: clueHeight}}/>
                    {colClues.map((clue, i) => (
                        <View key={i} style={[s.colClue, {width: cellSize, height: clueHeight}]}>
                            {clue.map((n, j) => <Text key={j} style={[styles.Text, s.clueText]}>{n}</Text>)}
                        </View>
                    ))}
                </View>

                {grid.map((row, r) => (
                    <View key={r} style={s.row}>
                        <View style={[s.rowClue, {width: clueWidth, height: cellSize}]}>
                            {rowClues[r].map((n, i) => <Text key={i} style={[styles.Text, s.clueText]}>{n}</Text>)}
                        </View>
                        {row.map((cell, c) => (
                            <View key={c} style={[s.cell, {width: cellSize, height: cellSize}, cell === 1 && s.filled]}>
                                {cell === 2 && <Text style={styles.Text}>✕</Text>}
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </GestureDetector>
    );
}

const s = StyleSheet.create({
    row: {flexDirection: 'row'},
    rowClue: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 4,
    },
    colClue: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 2,
    },
    clueText: {
        fontSize: 14,
        lineHeight: 18,
        minWidth: 18,
        textAlign: 'center',
    },
    cell: {
        borderWidth: 0.5,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filled: {backgroundColor: '#333'},
});
