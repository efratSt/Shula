'use strict'

const MINE = '💣'
const FLAGE = '🚩'
const NORMAL = '🙂'
const LOSE = '🤬'
const WIN = '🤩'
const HINT = '💡'

var gBoard
var gSize
var gMine
var gLevel = {
    SIZE: 4,
    mine: 2,
}

var gIsHint
var gIsDone
var gIntervaiTime
var gLife
var LIFE = '❤️'
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}



function init() {

    clearInterval(gIntervaiTime)
    var elImuji = document.querySelector('.imuji')
    elImuji.innerText = NORMAL
    var time = Date.now()
    gIsDone = false
    gIsHint = false

    gBoard = buildBord(gLevel.SIZE)

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }

    var elButtonHints = document.querySelectorAll('.hint')
    for (var i = 0; i < elButtonHints.length; i++) {
        elButtonHints[i].hidden = false
    }

    var elTimer = document.querySelector('h2 span')
    gIntervaiTime = setInterval(() => {
        gGame.secsPassed = Date.now() - time
        elTimer.innerText = gGame.secsPassed / 1000
    }, 1000)

    addRandomaliMine(gBoard, gLevel.mine)
    gBoard = setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gLife = 3

    var elLife = document.querySelector('.life .love')
    elLife.innerText = ''
    for (var i = 0; i < gLife; i++) {
        elLife.innerText += LIFE + ' '
    }
}


function beginner() {
    clearInterval(gIntervaiTime)
    gLevel = {
        SIZE: 4,
        mine: 2,
    }
    init()
}


function medium() {
    clearInterval(gIntervaiTime)
    gLevel = {
        SIZE: 8,
        mine: 14,
    }
    init()
}


function expert() {
    clearInterval(gIntervaiTime)
    gLevel = {
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
                isFlagHint: true
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

            if (cell.isMarked) {
                className += ' mark '
                inHTML = FLAGE
            }
            if (cell.isShown) {
                className += ' show'
                inHTML = (cell.minesAroundCount === 0) ? '' : cell.minesAroundCount
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
    checkGameOver()
}


function cellClicked(event, elCell, i, j) {

    if (gIsDone) return
    if (gBoard[i][j].isShown) return //אם אתה לחוץ כבר אל תעשה כלום

    if (gIsHint === true && event.button === 2) return
    if (gIsHint === true) {
        openNegForHint(gBoard, i, j)
        setTimeout(() => {
            closeNegForHint(gBoard, i, j)
        }, 1000)
        gIsHint = false
        return
    }
    var elImuji = document.querySelector('.imuji')
    elImuji.innerText = NORMAL


    if (event.button !== 2 && gBoard[i][j].isMarked) return //אם גם לחיצה רגילה וגם מדוגל אל תעשה כלום

    if (gLife === 0 && gIsDone === true) return


    if (gBoard[i][j].minesAroundCount === MINE) {

        if (gBoard[i][j].isMarked === true || event.button === 2) elImuji.innerText = NORMAL
        else elImuji.innerText = LOSE

        if (gLife === 0) {
            showAllMine()
            clearInterval(gIntervaiTime)

            gIsDone = true
            // return

        } else {
            if (event.button !== 2) {
                gLife--
                printLife()
            }
        }
    }

    if (event.button === 2) {

        if (gBoard[i][j].isMarked) {

            gGame.markedCount--

            gBoard[i][j].isMarked = false
            elCell.classList.remove('mark')
            renderBoard(gBoard)
            return

        } else {
            gGame.markedCount++

            gBoard[i][j].isMarked = true
            elCell.classList.add('mark')
            renderBoard(gBoard)
            return
        }
    }

    if (gBoard[i][j].minesAroundCount === 0) {
        showNeg(gBoard, i, j)
        return
    } else {
        elCell.classList.add('show')


        gGame.shownCount++
        //update the modal
        gBoard[i][j].isShown = true
        gBoard[i][j].isFlagHint = false
        //update the dom
        renderBoard(gBoard)
        // return
    }
}


function cellMarked(event, elCell) {
    // if (event.button === 2) {
    //     console.log(event);
    //     console.log(elCell);
    // }

}


function checkGameOver() {
    if (gGame.shownCount === (gLevel.SIZE * gLevel.SIZE) || (gGame.markedCount === gLevel.mine && gGame.shownCount === (gLevel.SIZE * gLevel.SIZE) - gLevel.mine)) {
        clearInterval(gIntervaiTime)
        console.log('isVictory');
        var elImuji = document.querySelector('.imuji')
        elImuji.innerText = WIN
        gIsDone = true
    }
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
            if (board[i][j].isMarked === true) continue
            if (board[i][j].isMine === true) continue
            if (board[i][j].isShown === true) continue

            gGame.shownCount++
            console.log(gGame.shownCount);
            board[i][j].isShown = true
            board[i][j].isFlagHint = false
            
            elNegCell.classList.add('show')
            renderBoard(board)

        }
    }

    // console.log(elNewCell);
}


function addRandomaliMine(board, numOfMile) {
    while (numOfMile !== 0) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)

        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            numOfMile--
        }
    }
}


function printLife() {
    var elLife = document.querySelector('.life .love')
    elLife.innerText = ''
    for (var i = 0; i < gLife; i++) {
        elLife.innerText += LIFE + ' '
    }

}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function showNegRec(board, rowIdx, colIdx) {

    if (board[rowIdx, colIdx].minesAroundCount === MINE) return

    board[rowIdx][colIdx].isShown = true

    gGame.shownCount++

    var elNegCell = document.querySelector(`[data-ij="${rowIdx},${colIdx}"]`)
    elNegCell.classList.add('show')
    renderBoard(board)

    if (board[rowIdx, colIdx].minesAroundCount !== 0) return


    showNegRec(board, rowIdx + 1, colIdx)
    showNegRec(board, rowIdx - 1, colIdx)
    showNegRec(board, rowIdx, colIdx + 1)
    showNegRec(board, rowIdx, colIdx - 1)
    showNegRec(board, rowIdx + 1, colIdx + 1)
    showNegRec(board, rowIdx - 1, colIdx - 1)
    showNegRec(board, rowIdx + 1, colIdx - 1)
    showNegRec(board, rowIdx - 1, colIdx + 1)

    // תנאי עצירה כאשר לא שווה ל-0



}



function hints(elButtonHint) {
    elButtonHint.hidden = true
    gIsHint = true

}

function openNegForHint(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue

            if (board[i][j].isFlagHint === false) continue


            var elNegCell = document.querySelector(`[data-ij="${i},${j}"]`)
            board[i][j].isShown = true
            elNegCell.classList.add('show')
            renderBoard(board)

        }
    }
}

function closeNegForHint(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isFlagHint === true) {

                var elNegCell = document.querySelector(`[data-ij="${i},${j}"]`)
            board[i][j].isShown = false
            elNegCell.classList.remove('show')
            renderBoard(board)

            }

            
        }
    }
}