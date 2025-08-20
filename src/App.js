import logo from './logo.svg';
import './App.css';
import { useState, createContext, useContext } from "react";
import * as constant from './constants.js';
import Grid from './components/Grid/Grid.jsx';

export const Context = createContext();


function App() {
  // 0 means unvisited , 1 means visited , 2 means start , 3 means target , -1 means wall, 4 means shortest path

  const [startPos , setStartPos] = useState({ row: constant.START_ROW, col: constant.START_COL })
  const [targetPos , setTargetPos] = useState({ row: constant.TARGET_ROW, col: constant.TARGET_COL })
  const initialGrid = Array.from({ length: constant.BOX_SIDE }, () => Array(constant.BOX_SIDE * 3).fill(0));
  initialGrid[startPos.row][startPos.col] = 2
  initialGrid[targetPos.row][targetPos.col] = 3

  const [grid, setGrid] = useState(initialGrid);

  return (
    <Context.Provider className="App" value={[grid,setGrid,startPos,setStartPos,targetPos,setTargetPos]}>
      <Grid/>
    </Context.Provider>
  );
}

export default App;