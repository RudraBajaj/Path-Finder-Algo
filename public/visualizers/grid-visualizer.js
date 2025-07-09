export function animateSearch(visitedNodes, callback) {
  let i = 0;
  function step() {
    if (i < visitedNodes.length) {
      const { row, col } = visitedNodes[i];
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      if (cell && !cell.classList.contains('start') && !cell.classList.contains('end')) {
        cell.classList.add('visited');
      }
      i++;
      requestAnimationFrame(step);
    } else {
      callback?.();
    }
  }
  step();
}

export function animatePath(path) {
  // Similar implementation for path animation
}

export function resetGrid() {
  document.querySelectorAll('.visited, .path').forEach(cell => {
    cell.classList.remove('visited', 'path');
  });
}