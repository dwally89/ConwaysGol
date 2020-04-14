//@ts-check
(function() {
    /**
     * @template T
     * @param {T[]} arr 
     * @param {T} item 
     */
    function addIfDefined(arr, item) {
        if (item) {
            arr.push(item);
        }
    }

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

        /**
         * @private
         * @param {Cell} cell 
         * @param {Cell[]} neighbours 
         */
        getNewState(cell, neighbours) {
            let numAliveNeighbours = neighbours.filter(n => n.isAlive).length;
            if (cell.isAlive) {
                return numAliveNeighbours == 2 || numAliveNeighbours == 3;
            } else {
                return numAliveNeighbours == 3;
            }
        }

        evaluateBoard() {
            for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
                for (let columnIndex = 0; columnIndex < this.board[rowIndex].length; columnIndex++) {
                    const neighbours = [];
                    const cell = this.board[rowIndex][columnIndex];
                    const previousRow = this.board[rowIndex - 1];
                    const nextRow = this.board[rowIndex + 1];
                    if (previousRow) {
                        addIfDefined(neighbours, previousRow[columnIndex - 1]);
                        addIfDefined(neighbours, previousRow[columnIndex]);
                        addIfDefined(neighbours, previousRow[columnIndex + 1]);
                    }

                    addIfDefined(neighbours, this.board[rowIndex][columnIndex - 1]);
                    addIfDefined(neighbours, this.board[rowIndex][columnIndex + 1]);
                    if (nextRow) {
                        addIfDefined(neighbours, nextRow[columnIndex - 1]);
                        addIfDefined(neighbours, nextRow[columnIndex]);
                        addIfDefined(neighbours, nextRow[columnIndex + 1]);
                    }

                    cell.nextState = this.getNewState(cell, neighbours);
                }
            }

            for (const row of this.board) {
                for (const cell of row) {
                    cell.isAlive = cell.nextState;
                    cell.nextState = null;
                }
            }
        }

        resetBoard() {
            for (const row of this.board) {
                for (const cell of row) {
                    cell.isAlive = false;
                    cell.nextState = null;
                }
            }

            drawBoard(this.board);
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
     * @param {Game} game 
     */
    function setupClickListeners(game) {
        document.getElementById('btn-reset').onclick = function() {
            game.resetBoard();
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
        const game = new Game(createBoard(numRows, numColumns));
        setupClickListeners(game);
        drawBoard(game.board);
        setInterval(function() {
            if (!game.isPaused) {
                game.evaluateBoard();
                drawBoard(game.board);
            }
        }, refreshMs);
    }

    playGame(10, 10, 500);
}());