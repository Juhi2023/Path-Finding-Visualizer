import Heap from 'heap-js';

const dir = [
  [-1, 0], // up
  [1, 0],  // down
  [0, -1], // left
  [0, 1]   // right
];

export const dijkstra = (grid, startRow, startCol) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const parentMap = new Map();
  const visited = new Set();
  const visitedOrder = [];

  const heap = new Heap((a, b) => a.dist - b.dist);

  dist[startRow][startCol] = 0;
  parentMap.set(`${startRow},${startCol}`, null);
  heap.push({ r: startRow, c: startCol, dist: 0 });


  while (heap.size() > 0) {
    const { r, c, dist: d } = heap.pop();
    const key = `${r},${c}`;
    if (visited.has(key)) 
      continue;

    visited.add(key);
    visitedOrder.push([r, c]);

    if (grid[r][c] === 3) break; // target found

    for (let [dr, dc] of dir) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== -1) {
        const newDist = dist[r][c] + 1;
        if (newDist < dist[nr][nc]) {
          dist[nr][nc] = newDist;
          parentMap.set(`${nr},${nc}`, `${r},${c}`);
          heap.push({ r: nr, c: nc, dist: newDist });
        }
      }
    }
  }

  return { visitedOrder, parentMap };
};
