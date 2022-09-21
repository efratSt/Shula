'use strict'

const MINE = '💣'
const FLAGE = '🚩'
var gBoard
var gSize
var gMine
var gLevel = {
    SIZE: 4,
    mine: 2,
}

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


    var time = Date.now()

    gBoard = buildBord(gLevel.SIZE)

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }

    gIntervaiTime = setInterval(() => {
        gGame.secsPassed = Date.now() - time
        console.log(gGame.secsPassed / 1000);
    }, 1000)

    addRandomaliMine(gBoard, gLevel.mine)
    gBoard = setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gLife = 3

    var elLife = document.querySelector('.life')
    elLife.innerText = ''
    for (var i = 0; i < gLife; i++) {
        elLife.innerText += LIFE + ' '
    }

    // var elH1 = document.querySelector('h1')
    // elH1.hidden = true

    // window.addEventListener('contextmenu', (event) => {
    //     console.log(event.button)
    //   })
}


function beginner() {
    gLevel = {
        SIZE: 4,
        mine: 2,
    }
    init()
}
function medium() {
    gLevel = {
        SIZE: 8,
        mine: 14,
    }
    init()
}
function expert() {
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
    checkGameOver()
}





function cellClicked(event, elCell, i, j) {
    // if (gLife === 0 ) return
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return



    
    if (gBoard[i][j].minesAroundCount === MINE) {
        if (gLife === 0) {
            showAllMine()
            
            // stopGame()
            // return
        } else {
            gLife--
            // var elLife = document.querySelector('.life')
            // elLife.innerText = ''
            // for (var i = 0; i < gLife; i++) {
            //     elLife.innerText += LIFE
            // }
        }
    }
   
    // if (gLife === 0) return

    if (event.button === 2) {
        if (gBoard[i][j].isMarked) {

            gGame.markedCount--

            gBoard[i][j].isMarked = false
            elCell.classList.remove('mark')
            renderBoard(gBoard)
            // return

        } else {
            gGame.markedCount++

            gBoard[i][j].isMarked = true
            elCell.classList.add('mark')
            renderBoard(gBoard)
            // return
        }
    }

    // if (gBoard[i][j].isShown) return


    if (gBoard[i][j].minesAroundCount === 0) {
        showNeg(gBoard, i, j)
        console.log(gGame.shownCount);
        // return
    } else {
        elCell.classList.add('show')


        gGame.shownCount++
        //update the modal
        gBoard[i][j].isShown = true
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
    if (gGame.markedCount + gGame.shownCount === (gLevel.SIZE * gLevel.SIZE)) {
        clearInterval(gIntervaiTime)
        console.log('isVictory');
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
            if (gBoard[i][j].isMarked === true) continue
            if (gBoard[i][j].isMine === true) continue
            if (gBoard[i][j].isShown === true) continue

            gGame.shownCount++
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
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)

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