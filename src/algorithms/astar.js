import Heap from 'heap-js';

// Directions: up, down, left, right
const dir = [
    [1, 0], 
    [-1, 0],
    [0, -1],
    [0, 1],
  ];

const heuristic_astar = (startRow, startCol, targetRow, targetCol) => {
    return (Math.abs(targetRow - startRow) + Math.abs(targetCol - startCol));
};


export const astar = (grid, startRow, startCol, targetRow, targetCol) => {
    let visitedOrder = [];
    let openList = new Heap((a, b) => a.f - b.f);;    //queue
    const closedSet = new Set();  // visisted node
    const gScore = new Map();
    const fScore = new Map();
    let parentMap = new Map(); // Map<"r,c", "pr,pc">

    const startKey = `${startRow},${startCol}`;

    openList.push({ node: startKey, f: 0 });
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic_astar(startRow, startCol, targetRow, targetCol));
    parentMap.set(startKey, null);
    
    
    while (openList.size() > 0) {
        const current = openList.pop();
        const [curRow, curCol] = current.node.split(',').map(Number);
        visitedOrder.push([curRow, curCol]);
                
        if (curRow === targetRow && curCol === targetCol) {
            return { visitedOrder, parentMap }; 
        }
        
        closedSet.add(current.node);
        for (let d of dir) {
            let x = curRow + d[0];
            let y = curCol + d[1];

            if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== -1 ) {
                const key = `${x},${y}`;
                
                const tentativeGScore = gScore.get(current.node) + 1;
                if (!gScore.has(key) || tentativeGScore < gScore.get(key)) {
                    parentMap.set(key, `${curRow},${curCol}`);
                    gScore.set(key, tentativeGScore);
                    fScore.set(key, tentativeGScore + heuristic_astar(x, y, targetRow, targetCol));

                    if (!closedSet.has(key)) {
                        openList.push({ node: key, f: fScore.get(key) });
                    }
                }
            }
        }
    }
    return { visitedOrder, parentMap }; 
};
