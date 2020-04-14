//@ts-check
(function() {
    class Cell {
        /**
         * @param {boolean} isAlive 
         */
        constructor(isAlive) {
            this.isAlive = isAlive;
            this.nextState = null;
        }
    }

    class Game {
        /**
         * @param {Cell[][]} board 
         */
        constructor(board) {
            this.board = board;
            this.isPaused = false;
        }
    }

    /**
     * 
     * @param {Cell} cell 
     * @param {Cell[]} neighbours 
     */
    function getNewState(cell, neighbours) {
        let numAliveNeighbours = neighbours.filter(n => n.isAlive).length;
        if (cell.isAlive) {
            return numAliveNeighbours == 2 || numAliveNeighbours == 3;
        } else {
            return numAliveNeighbours == 3;
        }
    }

    /**
     * 
     * @param {Cell[]} neighbours 
     * @param {Cell} cell 
     */
    function addIfDefined(neighbours, cell) {
        if (cell) {
            neighbours.push(cell);
        }
    }

    /**
     * @param {Cell[][]} board
     */
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

    /**
     * @param {number} numRows 
     * @param {number} numColumns 
     * @returns {Cell[][]}
     */
    function createBoard(numRows, numColumns) {
        const board = [];
        for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
            const row = [];
            for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
                row.push(new Cell(false));
            }

            board.push(row);
        }

        return board;
    }

    /**
     * @param {number} numRows 
     * @param {number} numColumns 
     * @returns {Game}
     */
    function createGame(numRows, numColumns) {
        return new Game(createBoard(numRows, numColumns));
    }

    /**
     * @param {Cell[][]} board 
     */
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

    /**
     * @param {Cell[][]} board 
     */
    function resetBoard(board) {
        for (const row of board) {
            for (const cell of row) {
                cell.isAlive = false;
                cell.nextState = null;
            }
        }

        drawBoard(board);
    }

    /**
     * @param {Game} game 
     */
    function setupClickListeners(game) {
        document.getElementById('btn-reset').onclick = function() {
            resetBoard(game.board);
        }

        document.getElementById('btn-pause').onclick = function() {
            game.isPaused = !game.isPaused;
            document.getElementById('btn-pause').innerText = game.isPaused ? 'Resume' : 'Pause';
        }
    }

    /**
     * @param {number} numRows 
     * @param {number} numColumns 
     * @param {number} refreshMs 
     */
    function playGame(numRows, numColumns, refreshMs) {
        const game = createGame(numRows, numColumns);
        setupClickListeners(game);
        drawBoard(game.board);
        setInterval(function() {
            if (!game.isPaused) {
                evaluateBoard(game.board);
                drawBoard(game.board);
            }
        }, refreshMs);
    }

    playGame(10, 10, 500);
}());