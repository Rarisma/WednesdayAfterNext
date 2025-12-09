import { useState, useMemo, useCallback } from "react";
import { Pressable, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import {useThemeColors} from "../Styles";

const MAX_CELL_SIZE = 50;
const BOARD_WIDTH_PERCENT = 0.6;
const BOARD_HEIGHT_PERCENT = 0.6;
const HINT_RATIO = 0.12;

const calculateHints = (cells, size, getIndex) => {
  const hints = [];
  let count = 0;
  for (let i = 0; i < size; i++) {
    if (cells[getIndex(i)]) count++;
    else if (count > 0) { hints.push(count); count = 0; }
  }
  if (count > 0) hints.push(count);
  return hints.length ? hints : [0];
};

const HintList = ({ hints, style, textSize }) => (
  <View style={style}>
    {hints.map((hint, i) => (
      <Text key={i} style={[styles.hintText, { fontSize: textSize }]}>{hint}</Text>
    ))}
  </View>
);

const Cell = ({ filled, onPress, row, col, rows, cols, size, colors }) => {
  const isCorner = (r, c) => (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
  const radius = size * 0.2;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: filled ? colors.text : colors.background,
          borderColor: colors.border,
        },
        col > 0 && styles.cellOverlapLeft,
        row > 0 && styles.cellOverlapTop,
        pressed && styles.cellPressed,
        isCorner(row, col) && {
          borderTopLeftRadius: row === 0 && col === 0 ? radius : 0,
          borderTopRightRadius: row === 0 && col === cols - 1 ? radius : 0,
          borderBottomLeftRadius: row === rows - 1 && col === 0 ? radius : 0,
          borderBottomRightRadius: row === rows - 1 && col === cols - 1 ? radius : 0,
        },
      ]}
    />
  );
};

const Stepper = ({ label, value, onIncrement, onDecrement, min, max, colors }) => (
  <View style={styles.stepperContainer}>
    <Text style={styles.stepperLabel}>{label}</Text>
    <View style={styles.stepperControls}>
      <Pressable
        onPress={onDecrement}
        style={[styles.stepperButton, { backgroundColor: value <= min ? colors.textMuted : colors.border }]}
        disabled={value <= min}
      >
        <Text style={styles.stepperButtonText}>−</Text>
      </Pressable>
      <Text style={styles.stepperValue}>{value}</Text>
      <Pressable
        onPress={onIncrement}
        style={[styles.stepperButton, { backgroundColor: value >= max ? colors.textMuted : colors.border }]}
        disabled={value >= max}
      >
        <Text style={styles.stepperButtonText}>+</Text>
      </Pressable>
    </View>
  </View>
);

export default function OldBoard() {
  const colors = useThemeColors();
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const availableWidth = screenWidth * BOARD_WIDTH_PERCENT;
  const availableHeight = screenHeight * BOARD_HEIGHT_PERCENT;

  const hintWidth = availableWidth * HINT_RATIO;
  const hintHeight = availableHeight * HINT_RATIO;

  const cellSize = Math.min(
    (availableWidth - hintWidth) / cols,
    (availableHeight - hintHeight) / rows,
    MAX_CELL_SIZE
  );

  const textSize = Math.max(cellSize * 0.35, 8);

  const [cells, setCells] = useState(() => Array(rows * cols).fill(false));

  // Reset grid when dimensions change
  const handleRowsChange = (newRows) => {
    setRows(newRows);
    setCells(Array(newRows * cols).fill(false));
  };

  const handleColsChange = (newCols) => {
    setCols(newCols);
    setCells(Array(rows * newCols).fill(false));
  };

const rowHints = Array.from({ length: rows }, (_, row) =>
  calculateHints(cells, cols, col => row * cols + col)
);

  const colHints = useMemo(() =>
    Array.from({ length: cols }, (_, col) =>
      calculateHints(cells, rows, row => row * cols + col)
    ), [cells, rows, cols]);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Stepper
          label="Rows"
          value={rows}
          onIncrement={() => handleRowsChange(rows + 1)}
          onDecrement={() => handleRowsChange(rows - 1)}
          min={1}
          max={30}
          colors={colors}
        />
        <Stepper
          label="Cols"
          value={cols}
          onIncrement={() => handleColsChange(cols + 1)}
          onDecrement={() => handleColsChange(cols - 1)}
          min={1}
          max={30}
          colors={colors}
        />
      </View>

      <View style={styles.boardWrapper}>
        <Text style={[styles.title, { fontSize: textSize * 1.5, marginBottom: textSize }]}>
          WednesdayAfterNext Board
        </Text>

        <View style={[styles.colHintsRow, { marginLeft: hintWidth }]}>
          {colHints.map((hints, col) => (
            <HintList
              key={col}
              hints={hints}
              style={[styles.colHintCell, { width: cellSize }]}
              textSize={textSize}
            />
          ))}
        </View>

        {Array.from({ length: rows }, (_, row) => (
          <View key={row} style={styles.gridRow}>
            <HintList
              hints={rowHints[row]}
              style={[styles.rowHintCell, { width: hintWidth, gap: textSize * 0.3 }]}
              textSize={textSize}
            />
            {Array.from({ length: cols }, (_, col) => {
              const index = row * cols + col;
              return (
                <Cell
                  key={col}
                  filled={cells[index]}
                    onPress={() => setCells(prev => prev.map((v, i) => i === index ? !v : v))}
                  row={row}
                  col={col}
                  rows={rows}
                  cols={cols}
                  size={cellSize}
                  colors={colors}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  controls: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  stepperContainer: {
    alignItems: "center",
  },
  stepperLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepperControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 32,
    textAlign: "center",
  },
  boardWrapper: {
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
  },
  colHintsRow: {
    flexDirection: "row",
  },
  colHintCell: {
    alignItems: "center",
  },
  rowHintCell: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 4,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  hintText: {
    fontWeight: "500",
  },
  cell: {
    borderWidth: 1,
  },
  cellOverlapLeft: {
    marginLeft: -1,
  },
  cellOverlapTop: {
    marginTop: -1,
  },
  cellPressed: {
    transform: [{ scale: 1.5 }],
    zIndex: 1,
  },
});
