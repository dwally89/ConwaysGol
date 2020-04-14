function createCell(isAlive) {
    return {
        isAlive: isAlive,
        nextState: null
    };
}

function getNewState(cell, neighbours) {
    let numAliveNeighbours = neighbours.filter(n => n.isAlive).length;
    if (cell.isAlive) {
        return numAliveNeighbours == 2 || numAliveNeighbours == 3;
    } else {
        return numAliveNeighbours == 3;
    }
}

function addIfDefined(neighbours, cell) {
    if (cell) {
        neighbours.push(cell);
    }
}

function evaluateBoard(board) {
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            const neighbours = [];
            const cell = board[rowIndex][columnIndex];
            const previousRow = board[rowIndex - 1];
            const nextRow = board[rowIndex + 1];
            if (previousRow) {
                addIfDefined(neighbours, previousRow[columnIndex - 1]);
                addIfDefined(neighbours, previousRow[columnIndex]);
                addIfDefined(neighbours, previousRow[columnIndex + 1]);
            }

            addIfDefined(neighbours, board[rowIndex][columnIndex - 1]);
            addIfDefined(neighbours, board[rowIndex][columnIndex + 1]);
            if (nextRow) {
                addIfDefined(neighbours, nextRow[columnIndex - 1]);
                addIfDefined(neighbours, nextRow[columnIndex]);
                addIfDefined(neighbours, nextRow[columnIndex + 1]);
            }

            cell.nextState = getNewState(cell, neighbours);
        }
    }

    for (const row of board) {
        for (const cell of row) {
            cell.isAlive = cell.nextState;
            cell.nextState = null;
        }
    }
}

function createBoard(numRows, numColumns) {
    const board = [];
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const row = [];
        for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
            row.push(createCell(false));
        }

        board.push(row);
    }

    return board;
}

function drawBoard(board) {
    const table = document.createElement('table');
    for (const row of board) {
        const rowEl = document.createElement('tr');
        for (const cell of row) {
            const td = document.createElement('td');
            td.style.backgroundColor = cell.isAlive ? 'green' : 'red';
            td.onclick = function() {
                cell.isAlive = !cell.isAlive;
                drawBoard(board);
            };

            rowEl.appendChild(td);
        }

        table.appendChild(rowEl);
    }

    const boardContainer = document.getElementById('board-container');
    boardContainer.innerHTML = '';
    boardContainer.appendChild(table);
}

function resetBoard(board) {
    for (const row of board) {
        for (const cell of row) {
            cell.isAlive = false;
            cell.nextState = null;
        }
    }

    drawBoard(board);
}

isPaused = false;

function setupClickListeners(board) {
    document.getElementById('btn-reset').onclick = function() {
        resetBoard(board);
    }

    document.getElementById('btn-pause').onclick = function() {
        isPaused = !isPaused;
        document.getElementById('btn-pause').innerText = isPaused ? 'Resume' : 'Pause';
    }
}

function playGame() {
    const board = createBoard(10, 10);
    setupClickListeners(board);
    drawBoard(board);
    setInterval(function() {
        if (!isPaused) {
            evaluateBoard(board);
            drawBoard(board);
        }
    }, 500);
}

playGame();