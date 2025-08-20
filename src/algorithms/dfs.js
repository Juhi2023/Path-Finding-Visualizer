const dir = [
    [-1, 0], // up
    [0, 1],  // right
    [1, 0],  // down
    [0, -1], // left
];

function dfsHelper(grid, visitedOrder, visited, parentMap, r, c) {
    let parent = `${r},${c}`;

    if (visited.has(parent)) 
        return false;
    
    visited.add(parent);
    visitedOrder.push([r, c]);

    if (grid[r][c] === 3) { // found target
        return true;
    }

    for (let [dx, dy] of dir) {
        let x = r + dx;
        let y = c + dy;

        if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== -1) {
            let key = `${x},${y}`;
            if (!visited.has(key)) {
                parentMap.set(key, parent);
                if (dfsHelper(grid, visitedOrder, visited, parentMap, x, y)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export const dfs = (grid, startRow, startCol) => {
    let visitedOrder = [];
    let visited = new Set();
    let parentMap = new Map();

    let startKey = `${startRow},${startCol}`;
    parentMap.set(startKey, null);

    dfsHelper(grid, visitedOrder, visited, parentMap, startRow, startCol, true);

    return { visitedOrder, parentMap };
};
