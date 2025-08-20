// Directions: up, down, left, right
const dir = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1]   // right
];

export const bidirectionalBFS = (grid, startRow, startCol, targetRow, targetCol) => {
    let visitedOrderStart = [];
    let visitedOrderTarget = [];

    let queueStart = [];
    let visitedStart = new Set(); 
    let parentStartMap = new Map(); // Map<"r,c", "pr,pc">

    let queueTarget = [];
    let visitedTarget = new Set(); 
    let parentTargetMap = new Map(); // Map<"r,c", "pr,pc">

    const startKey = `${startRow},${startCol}`;
    visitedStart.add(startKey);
    parentStartMap.set(startKey, null);
    queueStart.push([startRow, startCol]);

    const targetKey = `${targetRow},${targetCol}`;
    visitedTarget.add(targetKey);
    parentTargetMap.set(targetKey, null);
    queueTarget.push([targetRow, targetCol]);

    let meetingPoint = null;

    while (queueStart.length > 0 && queueTarget.length > 0) {
        // ---- Expand Start Side ----
        let qsSize = queueStart.length;
        for (let i = 0; i < qsSize; i++) {
            const [r, c] = queueStart.shift();
            visitedOrderStart.push([r, c]);

            for (let d of dir) {
                let x = r + d[0];
                let y = c + d[1];

                if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== -1) {
                    const key = `${x},${y}`;

                    if (!visitedStart.has(key)) {
                        visitedStart.add(key);
                        parentStartMap.set(key, `${r},${c}`);
                        queueStart.push([x, y]);

                        // Check if target side has visited this node
                        if (visitedTarget.has(key)) {
                            meetingPoint = [x, y];
                            return { visitedOrderStart, visitedOrderTarget, parentStartMap, parentTargetMap, meetingPoint };
                        }
                    }
                }
            }
        }

        // ---- Expand Target Side ----
        let qtSize = queueTarget.length;
        for (let i = 0; i < qtSize; i++) {
            const [r, c] = queueTarget.shift();
            visitedOrderTarget.push([r, c]);

            for (let d of dir) {
                let x = r + d[0];
                let y = c + d[1];

                if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== -1) {
                    const key = `${x},${y}`;

                    if (!visitedTarget.has(key)) {
                        visitedTarget.add(key);
                        parentTargetMap.set(key, `${r},${c}`);
                        queueTarget.push([x, y]);

                        // Check if start side has visited this node
                        if (visitedStart.has(key)) {
                            meetingPoint = [x, y];
                            return { visitedOrderStart, visitedOrderTarget, parentStartMap, parentTargetMap, meetingPoint };
                        }
                    }
                }
            }
        }
    }

    return { visitedOrderStart, visitedOrderTarget, parentStartMap, parentTargetMap, meetingPoint };
};
