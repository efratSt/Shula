'use strict'

const MINE = '💣'
const FLAGE = '🚩'
var gBoard
var gSize
var gMine
var gLevel = {}
var gLife


function init() {

    // console.log(gMine);
    // console.log(gSize);
    gBoard = buildBord(gLevel.SIZE)



    addRandomaliMine(gBoard, gLevel.mine)
    gBoard = setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gLife = 3

    // var elH1 = document.querySelector('h1')
    // elH1.hidden = true

    // window.addEventListener('contextmenu', (event) => {
    //     console.log(event.button)
    //   })
}


function beginner() {
    gLevel ={
        SIZE: 4,
        mine: 2,
    }
    init()
}
function medium() {
    gLevel ={
        SIZE: 8,
        mine: 14,
    }
    init()
}
function expert() {
    gLevel ={
        SIZE: 12,
        mine: 32,
    }
    init()
}


function buildBord(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            // var countMine = setMinesNegsCount(board, i, j)
            board[i][j] = {
                minesAroundCount: null,
                isShown: false,//מה שכבר לחוץ ופתוח
                isMine: false,// אם י שבתוכו פצצה
                isMarked: false, //  מה שהרגע לחצו עליו בעכבר
            }
        }
    }
    return board
}



function renderBoard(board) {
    var strHTML = '<table border="1"><tbody>'

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]


            var inHTML = ''
            var className = ''

            
            if (cell.isMine) className += ' mine'
            
            if (cell.isShown) {
                className += ' show'
                inHTML = (cell.minesAroundCount === 0) ? '' : cell.minesAroundCount
            }
            if (cell.isMarked) {
                className += 'mark '
                inHTML = FLAGE
            }

            strHTML += `<td class="cell${className}"
                            data-ij="${i},${j}"
                            onmousedown="cellClicked(event,this, ${i}, ${j})" >
                            ${inHTML}
                        </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    // console.log(strHTML);
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}





function cellClicked(event, elCell, i, j) {
    if (event.button === 2) {
        event.
        gBoard[i][j].isMarked =true
        elCell.classList.add('mark')
    }
    // if (event.button === 2) console.log(event);

    // window.addEventListener('contextmenu', (event) => {
    //     console.log(event.button)

    // })



    if (gBoard[i][j].minesAroundCount === MINE) {
        if (gLife === 0) mineClicked()
        else {
            gLife--
        }

        
    }

    if (gBoard[i][j].minesAroundCount === 0) {
        showNeg(gBoard, i, j)

    } else {
        elCell.classList.add('show')

        //update the modal
        gBoard[i][j].isShown = true

        //update the dom
        renderBoard(gBoard)
    }
}





function cellMarked(event, elCell) {
    // if (event.button === 2) {
    //     console.log(event);
    //     console.log(elCell);
    // }

}





function mineClicked() {
    showAllMine()
    // init()

    // var elH1 = document.querySelector('h1')
    // elH1.hidden = false
}

function showAllMine() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++)

            if (gBoard[i][j].minesAroundCount === MINE) {
                //update the modal
                gBoard[i][j].isShown = true
                //update the dom
                var elCell = document.querySelector(`[data-ij="${i},${j}"]`)
                elCell.classList.add('show')

            }
    }
}

//זה בודק תא ספציפי ומחזיר כמה פצצות יש לידו
function setMinesNegsCountInCell(board, rowIdx, colIdx) {
    var count = 0;

    if (board[rowIdx][colIdx].isMine) return MINE

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue

            var currCell = board[i][j]

            if (currCell.isMine) count++
        }
    }
    return count
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCountInCell(board, i, j)
        }
    }
    return board
}



function showNeg(board, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= board[i].length) continue

            var elNegCell = document.querySelector(`[data-ij="${i},${j}"]`)
            gBoard[i][j].isShown = true
            elNegCell.classList.add('show')
            renderBoard(gBoard)
        }
    }


    // var elNewCell = document.querySelector('[data-ij="0,1"]')
    // console.log(elNewCell);
}




function addRandomaliMine(board, numOfMile) {
    while (numOfMile !== 0) {
        var i = getRandomInt(0, board.length)
        var j = getRandomInt(0, board[i].length)

        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            numOfMile--
        }
    }
}















function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}