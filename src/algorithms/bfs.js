// Pure BFS - fast, no React involved
const dir = [[-1,0],[1,0],[0,-1],[0,1]];

export function bfs(grid, startRow, startCol) {
    let visited = new Set();
    let parentMap = new Map();
    let queue = [[startRow, startCol]];
    let head = 0;
    let visitedOrder = [];

    const startKey = `${startRow},${startCol}`;
    visited.add(startKey);
    parentMap.set(startKey, null);

    while (head < queue.length) {
        const [r, c] = queue[head++];
        visitedOrder.push([r, c]);

        if (grid[r][c] === 3) break;

        for (let [dr, dc] of dir) {
            let x = r + dr, y = c + dc;
            if ( x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== -1) {
                const key = `${x},${y}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    parentMap.set(key, `${r},${c}`);
                    queue.push([x, y]);
                }
            }
        }
    }

    return { visitedOrder, parentMap };
}

