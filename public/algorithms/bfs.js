export function bfs(grid, start, end) {
  const visitedNodes = [];
  const path = [];
  const queue = [[start]];
  const visited = new Set([`${start.row},${start.col}`]);

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const { row, col } = currentPath[currentPath.length - 1];
    
    visitedNodes.push({ row, col });

    if (row === end.row && col === end.col) {
      return { path: currentPath, visitedNodes };
    }

    for (const [dr, dc] of [[1,0], [0,1], [-1,0], [0,-1]]) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (isValidCell(newRow, newCol, grid, visited)) {
        visited.add(`${newRow},${newCol}`);
        queue.push([...currentPath, { row: newRow, col: newCol }]);
      }
    }
  }
  
  return { path: [], visitedNodes };
}

function isValidCell(row, col, grid, visited) {
  // Check bounds and if not wall/visited
}