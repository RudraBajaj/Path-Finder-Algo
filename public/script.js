// Pathfinding Algorithms (simplified implementations)
const algorithms = {
  bfs: function(grid, start, end) {
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

      // Check all 4 directions
      const directions = [[1,0],[0,1],[-1,0],[0,-1]];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        const cellKey = `${newRow},${newCol}`;

        if (newRow >= 0 && newRow < grid.length && 
            newCol >= 0 && newCol < grid[0].length &&
            grid[newRow][newCol] !== 'wall' && 
            !visited.has(cellKey)) {
          visited.add(cellKey);
          queue.push([...currentPath, { row: newRow, col: newCol }]);
        }
      }
    }
    return { path: [], visitedNodes };
  },

  dfs: function(grid, start, end) {
    const visitedNodes = [];
    const stack = [[start]];
    const visited = new Set([`${start.row},${start.col}`]);

    while (stack.length > 0) {
      const currentPath = stack.pop();
      const { row, col } = currentPath[currentPath.length - 1];
      visitedNodes.push({ row, col });

      if (row === end.row && col === end.col) {
        return { path: currentPath, visitedNodes };
      }

      // Check all 4 directions in reverse order for DFS
      const directions = [[0,-1],[-1,0],[0,1],[1,0]];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        const cellKey = `${newRow},${newCol}`;

        if (newRow >= 0 && newRow < grid.length && 
            newCol >= 0 && newCol < grid[0].length &&
            grid[newRow][newCol] !== 'wall' && 
            !visited.has(cellKey)) {
          visited.add(cellKey);
          stack.push([...currentPath, { row: newRow, col: newCol }]);
        }
      }
    }
    return { path: [], visitedNodes };
  },

  dijkstra: function(grid, start, end) {
    const visitedNodes = [];
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    const path = [];

    // Initialize distances
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const key = `${row},${col}`;
        distances[key] = Infinity;
        unvisited.add(key);
      }
    }
    distances[`${start.row},${start.col}`] = 0;

    while (unvisited.size > 0) {
      // Find node with smallest distance
      let currentKey = null;
      let smallestDistance = Infinity;
      for (const key of unvisited) {
        if (distances[key] < smallestDistance) {
          smallestDistance = distances[key];
          currentKey = key;
        }
      }

      if (currentKey === null) break;

      const [row, col] = currentKey.split(',').map(Number);
      visitedNodes.push({ row, col });

      if (row === end.row && col === end.col) {
        // Reconstruct path
        let current = currentKey;
        while (current !== `${start.row},${start.col}`) {
          const [r, c] = current.split(',').map(Number);
          path.unshift({ row: r, col: c });
          current = previous[current];
        }
        path.unshift(start);
        return { path, visitedNodes };
      }

      unvisited.delete(currentKey);

      // Check neighbors
      const directions = [[1,0],[0,1],[-1,0],[0,-1]];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        const neighborKey = `${newRow},${newCol}`;

        if (newRow >= 0 && newRow < grid.length && 
            newCol >= 0 && newCol < grid[0].length &&
            grid[newRow][newCol] !== 'wall' && 
            unvisited.has(neighborKey)) {
          const alt = distances[currentKey] + 1;
          if (alt < distances[neighborKey]) {
            distances[neighborKey] = alt;
            previous[neighborKey] = currentKey;
          }
        }
      }
    }
    return { path: [], visitedNodes };
  },

  astar: function(grid, start, end) {
    const visitedNodes = [];
    const openSet = new Set([`${start.row},${start.col}`]);
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    const path = [];

    // Initialize scores
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const key = `${row},${col}`;
        gScore[key] = Infinity;
        fScore[key] = Infinity;
      }
    }
    gScore[`${start.row},${start.col}`] = 0;
    fScore[`${start.row},${start.col}`] = heuristic(start, end);

    while (openSet.size > 0) {
      // Find node with lowest fScore
      let currentKey = null;
      let lowestFScore = Infinity;
      for (const key of openSet) {
        if (fScore[key] < lowestFScore) {
          lowestFScore = fScore[key];
          currentKey = key;
        }
      }

      const [row, col] = currentKey.split(',').map(Number);
      visitedNodes.push({ row, col });

      if (row === end.row && col === end.col) {
        // Reconstruct path
        let current = currentKey;
        while (current !== `${start.row},${start.col}`) {
          const [r, c] = current.split(',').map(Number);
          path.unshift({ row: r, col: c });
          current = cameFrom[current];
        }
        path.unshift(start);
        return { path, visitedNodes };
      }

      openSet.delete(currentKey);

      // Check neighbors (including diagonals)
      const directions = [[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        const neighborKey = `${newRow},${newCol}`;

        if (newRow >= 0 && newRow < grid.length && 
            newCol >= 0 && newCol < grid[0].length &&
            grid[newRow][newCol] !== 'wall') {
          
          // Diagonal cost is sqrt(2), straight is 1
          const cost = (Math.abs(dr) + Math.abs(dc)) === 2 ? 1.414 : 1;
          const tentativeGScore = gScore[currentKey] + cost;

          if (tentativeGScore < gScore[neighborKey]) {
            cameFrom[neighborKey] = currentKey;
            gScore[neighborKey] = tentativeGScore;
            fScore[neighborKey] = gScore[neighborKey] + heuristic({row: newRow, col: newCol}, end);
            if (!openSet.has(neighborKey)) {
              openSet.add(neighborKey);
            }
          }
        }
      }
    }
    return { path: [], visitedNodes };
  }
};

// Helper function for A*
function heuristic(a, b) {
  // Manhattan distance
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Main Application
document.addEventListener('DOMContentLoaded', () => {
  const GRID_SIZE = 20;
  let grid = [];
  let startCell = { row: 0, col: 0 };
  let endCell = { row: GRID_SIZE-1, col: GRID_SIZE-1 };
  let isVisualizing = false;

  // DOM Elements
  const gridContainer = document.getElementById('grid-container');
  const visualizeBtn = document.getElementById('visualize-btn');
  const clearBtn = document.getElementById('clear-btn');
  const algorithmSelect = document.getElementById('algorithm-select');
  const statusDisplay = document.getElementById('status-display');

  // Initialize grid
  function createGrid() {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        gridContainer.appendChild(cell);

        cell.addEventListener('click', () => {
          if (isVisualizing) return;
          
          const cellRow = parseInt(cell.dataset.row);
          const cellCol = parseInt(cell.dataset.col);
          
          // Check if clicking start or end
          if (cellRow === startCell.row && cellCol === startCell.col) return;
          if (cellRow === endCell.row && cellCol === endCell.col) return;
          
          // Toggle wall
          cell.classList.toggle('wall');
          grid[cellRow][cellCol] = cell.classList.contains('wall') ? 'wall' : 0;
          updateStatus('Board modified. Click "Visualize" to start.');
        });
      }
    }

    // Set start and end cells
    const startElement = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
    const endElement = document.querySelector(`[data-row="${endCell.row}"][data-col="${endCell.col}"]`);
    startElement.classList.add('start');
    endElement.classList.add('end');
    grid[startCell.row][startCell.col] = 'start';
    grid[endCell.row][endCell.col] = 'end';
  }

  // Visualize the selected algorithm
  async function visualizeAlgorithm() {
    if (isVisualizing) return;
    
    isVisualizing = true;
    visualizeBtn.disabled = true;
    clearBtn.disabled = true;
    algorithmSelect.disabled = true;
    
    // Clear previous visualization
    document.querySelectorAll('.visited, .path').forEach(cell => {
      cell.classList.remove('visited', 'path');
    });

    const algorithm = algorithmSelect.value;
    updateStatus(`Visualizing ${algorithm.toUpperCase()}...`, 'searching');

    const { path, visitedNodes } = algorithms[algorithm](grid, startCell, endCell);

    // Animate visited nodes
    for (let i = 0; i < visitedNodes.length; i++) {
      const { row, col } = visitedNodes[i];
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      if (cell && !cell.classList.contains('start') && !cell.classList.contains('end')) {
        cell.classList.add('visited');
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Animate final path if found
    if (path.length > 0) {
      for (let i = 0; i < path.length; i++) {
        const { row, col } = path[i];
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell && !cell.classList.contains('start') && !cell.classList.contains('end')) {
          cell.classList.add('path');
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      updateStatus(`${algorithm.toUpperCase()} found a path!`, 'success');
    } else {
      updateStatus('No path exists!', 'error');
    }

    isVisualizing = false;
    visualizeBtn.disabled = false;
    clearBtn.disabled = false;
    algorithmSelect.disabled = false;
  }

  // Clear the board
  function clearBoard() {
    if (isVisualizing) return;
    
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    document.querySelectorAll('.cell').forEach(cell => {
      cell.className = 'cell';
    });

    // Reset start and end
    const startElement = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
    const endElement = document.querySelector(`[data-row="${endCell.row}"][data-col="${endCell.col}"]`);
    startElement.classList.add('start');
    endElement.classList.add('end');
    grid[startCell.row][startCell.col] = 'start';
    grid[endCell.row][endCell.col] = 'end';

    updateStatus('Board cleared. Ready for pathfinding.');
  }

  // Update status display
  function updateStatus(message, statusType = '') {
    statusDisplay.textContent = message;
    statusDisplay.className = statusType;
  }

  // Event listeners
  visualizeBtn.addEventListener('click', visualizeAlgorithm);
  clearBtn.addEventListener('click', clearBoard);

  // Initialize
  createGrid();
  updateStatus('Click on cells to add walls, then click Visualize');
});