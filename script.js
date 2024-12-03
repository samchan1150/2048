const gridSize = 4;
let grid = [];
let cells = [];
let score = 0;



document.addEventListener('DOMContentLoaded', setup);

function setup() {
    score = 0; 
    createGrid();
    addNumber();
    addNumber();
    document.addEventListener('keydown', handleInput);
}

function createGrid() {
    const gridContainer = document.getElementById('grid');
    for (let i = 0; i < gridSize * gridSize; i++) {
        let cell = document.createElement('div');
        cell.classList.add('tile');
        gridContainer.appendChild(cell);
        cells.push(cell);
    }
    for (let i = 0; i < gridSize; i++) {
        grid[i] = new Array(gridSize).fill(0);
    }
    updateGrid();
}

function updateGrid() {
    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const value = grid[row][col];
        cell.className = 'tile';
        if (value) {
            cell.textContent = value;
            cell.setAttribute('data-value', value);
        } else {
            cell.textContent = '';
            cell.removeAttribute('data-value');
        }
    });
    updateScore(); // Add this line
}

function addNumber() {
    let options = [];
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === 0) {
                options.push({ r, c });
            }
        }
    }
    if (options.length > 0) {
        let { r, c } = options[Math.floor(Math.random() * options.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        let index = r * gridSize + c;
        cells[index].classList.add('new');
        updateGrid();
    }
}

function handleInput(event) {
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    if (moved) {
        addNumber();
        if (isGameOver()) {
            setTimeout(() => alert('Game Over!'), 100);
        }
    }
}

function move(row) {
    let arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i]; // Update the score
            arr[i + 1] = 0;
        }
    }
    arr = arr.filter(val => val);
    while (arr.length < gridSize) {
        arr.push(0);
    }
    return arr;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
        let oldRow = grid[r];
        let newRow = move(oldRow);
        if (!arraysEqual(oldRow, newRow)) {
            moved = true;
        }
        grid[r] = newRow;
    }
    updateGrid();
    return moved;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
        let oldRow = grid[r];
        let reversedRow = oldRow.slice().reverse();
        let newRow = move(reversedRow).reverse();
        if (!arraysEqual(oldRow, newRow)) {
            moved = true;
        }
        grid[r] = newRow;
    }
    updateGrid();
    return moved;
}

function moveUp() {
    let moved = false;
    for (let c = 0; c < gridSize; c++) {
        let col = [];
        for (let r = 0; r < gridSize; r++) {
            col.push(grid[r][c]);
        }
        let newCol = move(col);
        for (let r = 0; r < gridSize; r++) {
            if (grid[r][c] !== newCol[r]) {
                moved = true;
            }
            grid[r][c] = newCol[r];
        }
    }
    updateGrid();
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < gridSize; c++) {
        let col = [];
        for (let r = 0; r < gridSize; r++) {
            col.push(grid[r][c]);
        }
        let reversedCol = col.slice().reverse();
        let newCol = move(reversedCol).reverse();
        for (let r = 0; r < gridSize; r++) {
            if (grid[r][c] !== newCol[r]) {
                moved = true;
            }
            grid[r][c] = newCol[r];
        }
    }
    updateGrid();
    return moved;
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = 'Score: ' + score;
}

function isGameOver() {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === 0) return false;
            if (c < gridSize - 1 && grid[r][c] === grid[r][c + 1]) return false;
            if (r < gridSize - 1 && grid[r][c] === grid[r + 1][c]) return false;
        }
    }
    return true;
}

function arraysEqual(a, b) {
    return a.toString() === b.toString();
}