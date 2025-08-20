import React , {useContext , useRef , useEffect , useState} from 'react';
import { Context } from '../../App';
import goal from "../../assets/target.svg"
import start from "../../assets/start.svg"
import './Grid.css';
import { bfs } from '../../algorithms/bfs';
import { dfs } from '../../algorithms/dfs';
import { bidirectionalBFS } from '../../algorithms/bidirectionalBFS';
import { dijkstra } from '../../algorithms/dijkastra';
import { astar } from '../../algorithms/astar';
import { astarEuclidean } from '../../algorithms/astarEuclidean';

//styling
const animationDuration = "700ms";

const getBackgroundImage = (value) => {
    if (value === 2) 
        return `url(${start})`;
    if (value === 3) 
        return `url(${goal})`;
    return "none";
};


export default function Grid(){
    const [grid,setGrid,startPos,setStartPos,targetPos,setTargetPos] = useContext(Context);
    const [isAlgoRunning, setIsAlgoRunning] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [NodeDrag, setNodeDraging] = useState(-1);

    // Function to update the grid cell value
    const updateGridCell = (row, col, value) => {
        setGrid(prev => {
            const newGrid = prev.map(row => row.slice());
            newGrid[row][col] = value;
            return newGrid;
        });
    };

    // Function to handle drag start
    const handleMouseDown = (e, row, col) => {
        e.preventDefault();
        setIsDragging(true);
        if (grid[row][col] === -1 && isErasing === true){
            updateGridCell(row,col,0)
        }else if (grid[row][col] === 0 && isErasing === false){
            updateGridCell(row,col,-1)
        }else if (grid[row][col]=== 2){
            setNodeDraging(2)
            updateGridCell(row,col,0)
        }else if (grid[row][col]=== 3){
            setNodeDraging(3)
            updateGridCell(row,col,0)
        }
    };
    
    // Function to handle drag end
    const handleMouseUp = (e, row , col) => {
        setIsDragging(false);
        if (NodeDrag === 2){
            setStartPos({ row, col })
            updateGridCell(row, col, 2);
        }else if (NodeDrag === 3){
            setTargetPos({ row, col })
            updateGridCell(row, col, 3);
        }
        setNodeDraging(-1);
    };

    // Function to handle cell modification during dragging
    const handleMouseEnter = (e, row, col) => {
        if (isDragging) {
            // only draw/erase when not dragging start/target
            if (NodeDrag === -1) {
                if (grid[row][col] === -1 || grid[row][col] ===0) {
                    if (!isErasing) {
                        updateGridCell(row, col, -1);
                    } else {
                        updateGridCell(row, col, 0);
                    }
                }
            }
        }
    
    };

    const eraseboard = () => {
        setIsErasing(false);
        clearAlgo()
        setGrid(prev => {
            let newGrid = prev.map(row => [...row]);
            for (let r = 0; r < newGrid.length; r++) {
                for (let c = 0; c < newGrid[0].length; c++) {
                    if (newGrid[r][c] !== 2 && newGrid[r][c] !== 3) {
                        newGrid[r][c] = 0; 
                    }
                }
            }
            return newGrid;
        });
    }

    const clearAlgo = async() => {
        for (let r = 0 ; r < grid.length ; r++){
            for (let c = 0 ; c < grid[0].length ; c++){
                const element = document.getElementById( `node-${r}-${c}`);
                if (element) {
                    element.classList.remove("node-visited");
                    element.classList.remove("node-shortestPath")
                }
            }
        }
    }

    const getRandomNumber = (min,max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    
    const generateRandomBlocks = (blocks , direction) => {
        eraseboard();
        setIsAlgoRunning(true)
    
        setGrid(prev=>{
            let newGrid = prev.map(row => [...row]);
    
            if (direction === 0){
              for (let r = 0; r < newGrid.length; r++) {
                    let set = 0;
                    while (set < blocks) {
                        const num = getRandomNumber(0, newGrid[0].length - 1);
                        if (newGrid[r][num] === 0) {
                            newGrid[r][num] = -1;
                            set += 1;
                        }
                    }
                }
                return newGrid;
            }else if(direction === 1){
                for (let c = 0; c < newGrid[0].length; c++) {
                    let set = 0;
                    while (set < blocks) {
                        const num = getRandomNumber(0, newGrid.length - 1);
                        if (newGrid[num][c] === 0) {
                            newGrid[num][c] = -1;
                            set += 1;
                        }
                    }
                }
                return newGrid;
            }
            
        });
    
        setIsAlgoRunning(false)
    };

    function carve(maze, x, y) {
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

        // Shuffle directions for randomness
        directions.sort(() => Math.random() - 0.5);

        
        for (let [dx, dy] of directions) {
            let nx = x + dx * 2;
            let ny = y + dy * 2;
            
            if (nx >= 0 && nx < maze[0].length && ny >= 0 && ny < maze.length && maze[ny][nx] === -1) {
                if (maze[y+dy][x+dx]!== 3 && maze[y+dy][x+dx]!== 2) {
                    maze[ny][nx] = 0;
                    maze[y + dy][x + dx] = 0;
                }
                carve(maze, nx, ny);
            }
        }
    }

    async function generateMaze() {
        eraseboard()
        setIsAlgoRunning(true)
        let maze = grid.map(row => row.slice());
    
        for(let i = 0; i < maze.length; i++) {
            for(let j = 0; j < maze[0].length; j++) {
                if(maze[i][j]===0) {
                    maze[i][j] = -1;
                }
            }
        }
        
        maze[0][0] = -1;
        carve(maze, startPos.row, startPos.col);

    
        for (let j = 0; j < maze[0].length; j++) {
          let columnUpdate = maze.map(row => row[j]);
          setGrid(prevGrid => {
              let newGrid = prevGrid.map(row => [...row]);
              for (let i = 0; i < maze.length; i++) {
                  newGrid[i][j] = maze[i][j];
              }
              return newGrid;
          });
          await new Promise(resolve => setTimeout(resolve, 10));
        }
    
        setIsAlgoRunning(false)
        return maze;
    }

    //Algorithm
    async function handleAlgorithm(type){
        clearAlgo()
        setIsAlgoRunning(true)
        let shortestPath = [];
        let parentMap;
        let visitedOrder;
        let data;

        switch(type){
            case "DFS":
                data = dfs(grid, startPos.row, startPos.col);
                visitedOrder =data.visitedOrder;
                parentMap = data.parentMap
                shortestPath = reconstructPath(parentMap, targetPos.row, targetPos.col)
                await animateAlgorithm(visitedOrder, shortestPath)
                break;

            case "BFS":
                data = bfs(grid, startPos.row, startPos.col);
                visitedOrder =data.visitedOrder;
                parentMap = data.parentMap
                shortestPath = reconstructPath(parentMap, targetPos.row, targetPos.col)
                await animateAlgorithm(visitedOrder, shortestPath)
                break;

            case "Bi-BFS":
                //visitedOrderStart, visitedOrderTarget, parentStartMap, parentTargetMap, meetingPoint
                data = bidirectionalBFS(grid, startPos.row, startPos.col, targetPos.row, targetPos.col);
                let visitedOrderStart = data.visitedOrderStart;
                let visitedOrderTarget = data.visitedOrderTarget;
                let parentStartMap = data.parentStartMap;
                let parentTargetMap = data.parentTargetMap;
                let meetingPoint = data.meetingPoint;
                const [mr, mc] = meetingPoint;

                if (meetingPoint) {
                    const pathFromStart = reconstructPath(data.parentStartMap, mr, mc);
                    const pathFromTarget = reconstructPath(data.parentTargetMap, mr, mc).reverse();
                    parentMap = data.parentMap;
                    shortestPath = [...pathFromStart, ...pathFromTarget.slice(1)];
                }

                await animateBiBFS(visitedOrderStart, visitedOrderTarget, shortestPath);
                break;

            case "Dijkstra":
                data = dijkstra(grid, startPos.row, startPos.col);
                visitedOrder =data.visitedOrder;
                parentMap = data.parentMap
                shortestPath = reconstructPath(parentMap, targetPos.row, targetPos.col)
                await animateAlgorithm(visitedOrder, shortestPath)
                break;


            case "AstarM":
                data = astar(grid, startPos.row, startPos.col, targetPos.row, targetPos.col);
                visitedOrder =data.visitedOrder;
                parentMap = data.parentMap
                shortestPath = reconstructPath(parentMap, targetPos.row, targetPos.col)
                await animateAlgorithm(visitedOrder, shortestPath)
                break;

            case "AstarE":
                data = astarEuclidean(grid, startPos.row, startPos.col, targetPos.row, targetPos.col);
                visitedOrder =data.visitedOrder;
                parentMap = data.parentMap
                shortestPath = reconstructPath(parentMap, targetPos.row, targetPos.col)
                await animateAlgorithm(visitedOrder, shortestPath)
                break;

            default:
        }
    }


    // Reconstruct shortest path from visitedOrder
    const reconstructPath = (parentMap, targetRow, targetCol) => {
        let path = [];
        let key = `${targetRow},${targetCol}`;
    
        if (!parentMap.has(key)) {
            return path; // No path found
        }
    
        // Backtrack using parentMap
        while (key !== null) {
            let [r, c] = key.split(",").map((i)=> parseInt(i));
            path.push([r, c]);
            key = parentMap.get(key);
        }
    
        return path.reverse(); // Start → Target
    };

    async function animateAlgorithm(visitedOrder, shortestPath){
        const delay = 10;
        visitedOrder.slice(1).forEach((node, index) => {
            
            setTimeout(() => {
                if(node[0]===targetPos.row && node[1]===targetPos.col){
                    animateAlgorithmPath(shortestPath)
                    return;
                }else{
                    const element = document.getElementById(`node-${node[0]}-${node[1]}`);
                    element.className = 'node-visited'
                }

           
            }, delay * index);
        });
    }

    async function animateAlgorithmPath(shortestPath){
        const delay = 10;
        shortestPath.slice(1).forEach((node, index) => {
            
            setTimeout(() => {
                if(node[0]===targetPos.row && node[1]===targetPos.col){
                    setIsAlgoRunning(false)
                    return;
                }else{
                    const element = document.getElementById(`node-${node[0]}-${node[1]}`);
                    element.className = 'node-shortestPath'
                }

           
            }, delay * index);
        });
    }

    async function animateBiBFS(visitedOrderStart, visitedOrderTarget, shortestPath) {
        const delay = 10;
        const maxLen = Math.max(visitedOrderStart.length, visitedOrderTarget.length);
    
        for (let i = 1; i < maxLen; i++) {
            setTimeout(() => {
                if (i < visitedOrderStart.length) {
                    const [r, c] = visitedOrderStart[i];
                    const element = document.getElementById(`node-${r}-${c}`);
                    if (!(r === targetPos.row && c === targetPos.col)) {
                        element.className = 'node-visited';
                    }
                }
    
                if (i < visitedOrderTarget.length) {
                    const [r, c] = visitedOrderTarget[i];
                    const element = document.getElementById(`node-${r}-${c}`);
                    if (!(r === targetPos.row && c === targetPos.col)) {
                        element.className = 'node-visited';
                    }
                }
    
                // When both searches meet, animate shortest path
                if (i === maxLen - 1) {
                    animateAlgorithmPath(shortestPath);
                }
            }, delay * i);
        }
    }
    
    
    async function animateAlgorithmPath(shortestPath) {
        const delay = 20;
    
        for (let i = 1; i < shortestPath.length; i++) {
            await new Promise(res => setTimeout(res, delay));
            const [r, c] = shortestPath[i];
    
            const element = document.getElementById(`node-${r}-${c}`);
            if (element) element.className = 'node-shortestPath';
        }
    
        setIsAlgoRunning(false);
    }
    

    
    //bootstrap
    useEffect(() => {
        // Initialize tooltips after component mounts
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].forEach(
            (tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl)
        );
    }, []);

    return (
        <div className='grid-container'>
            <div className="operations w-100 mx-0 row gap-2">
                <div className="box px-0 col">
                    <div className='heading'>Algorithms</div>
                    <button onClick={()=>!isAlgoRunning && handleAlgorithm("DFS")}>DFS</button>
                    <button onClick={()=>!isAlgoRunning && handleAlgorithm("BFS")}>BFS</button>
                    <button onClick={()=>!isAlgoRunning && handleAlgorithm("Bi-BFS")}>Bidirectional BFS</button>
                    <button onClick={()=>!isAlgoRunning && handleAlgorithm("Dijkstra")}>Dijkstra</button>
                    <button onClick={()=>!isAlgoRunning && handleAlgorithm("AstarM")}>A* (Manhattan)</button>
                    <button onClick={()=>!isAlgoRunning && handleAlgorithm("AstarE")}>A* (Euclidean)</button>
                </div>
                <div className="box px-0 col">
                    <div className='heading'>Operations</div>
                    <button onClick={()=>!isAlgoRunning && generateMaze()}>Generate Maze</button>
                    <button onClick={()=>!isAlgoRunning && generateRandomBlocks(5,1)}>Generate Wall</button>
                    <button className={isErasing ? 'active' : ''} onClick={() => setIsErasing(!isErasing)}>Erase</button>
                    <button onClick={(e) => !isAlgoRunning && clearAlgo()}>Clear Algo</button>
                    <button className='' onClick={(e) => !isAlgoRunning && eraseboard()}>Reset Board</button>
                </div>
            </div>
            <div className='table-container'>
                <table>
                    <tbody>
                        {
                            grid?.map((_, rowIndex)=>{
                                return (
                                    <tr key={rowIndex}>
                                    {
                                        grid[rowIndex]?.map((_, colIndex)=>{
                                            let val = grid[rowIndex][colIndex];
                                            let img = getBackgroundImage(val)
                                            return(
                                                <td 
                                                    id={`node-${rowIndex}-${colIndex}`}
                                                    className={val==-1 ? 'node-wall' : ''}
                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                    title={`[${rowIndex}, ${colIndex}]`}
                                                    onMouseDown={(e) => !isAlgoRunning && handleMouseDown(e, rowIndex, colIndex)}
                                                    onMouseEnter={(e) => !isAlgoRunning && handleMouseEnter(e, rowIndex, colIndex)}
                                                    onMouseUp={(e) =>  !isAlgoRunning &&  handleMouseUp(e, rowIndex, colIndex)}
                                                    key={colIndex}
                                                >
                                                <div style={{
                                                    height:"100%",
                                                    width:"100%",
                                                    backgroundImage: img,
                                                    backgroundSize: 'auto 100% ',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                    position: 'absolute', 
                                                    top: 0, 
                                                    left: 0,
                                                }}></div>
                                                </td>
                                            )
                                        })
                                    }
                                    </tr>   
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}