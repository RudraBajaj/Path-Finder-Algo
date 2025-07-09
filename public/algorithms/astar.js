import { PriorityQueue } from '../utils/priority-queue.js';
import { manhattanDistance } from '../utils/heuristic.js';

export function aStar(grid, start, end) {
  const openSet = new PriorityQueue((a, b) => a.f - b.f);
  const visitedNodes = [];
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  // Initialize scores
  grid.forEach((row, i) => {
    row.forEach((_, j) => {
      gScore.set(`${i},${j}`, Infinity);
      fScore.set(`${i},${j}`, Infinity);
    });
  });

  gScore.set(`${start.row},${start.col}`, 0);
  fScore.set(`${start.row},${start.col}`, manhattanDistance(start, end));

  openSet.push({
    row: start.row,
    col: start.col,
    f: manhattanDistance(start, end)
  });

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    visitedNodes.push(current);

    if (current.row === end.row && current.col === end.col) {
      return {
        path: reconstructPath(cameFrom, current),
        visitedNodes
      };
    }

    // Explore neighbors...
  }

  return { path: [], visitedNodes };
}