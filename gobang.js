/**
 * 罗运来 五子棋 dom版
 */
window.onload = () => {
    let dom = document.getElementById('dom')
    let canvas = document.getElementById('canvas')
    let table = document.getElementById('table')
    let table1 = document.getElementById('table1')
    // ctx = table1.getContext('2d')
    loadTable()
}
edition = 'dom' //当前版本
temp = null //悔的那步棋
tempCanvas = {
    img: null,
    chess: null
}
backTime = 0 //悔棋次数
chessArr = [] //棋子数组
initState = null
canvasStates = [] //保存canvas状态
end = false
/**
 * 改版本
 */
function change() {
    if (edition == 'canvas') {
        edition = 'dom'
        restartC()
    } else {
        edition = 'canvas'
        restart()
    }
    loadTable()
}
/**
 * 绘制棋盘
 */
function loadTable() {
    if (edition != 'dom') {
        dom.style.display = 'none'
        canvas.style.display = 'flex'
        table1.height = table1.height
        let ctx = table1.getContext('2d')
        for (var i = 0; i <= 15; i++) {
            draw(ctx, 10, i * 40 + 10, 610, i * 40 + 10)
            draw(ctx, i * 40 + 10, 10, i * 40 + 10, 610)
        }
        ctx.stroke()
        initState = ctx.getImageData(0, 0, 620, 620)
        canvasStates.push(initState) //保存棋盘状态
        table1.addEventListener('click', a, true)
    } else {
        canvas.style.display = 'none'
        dom.style.display = 'flex'
        for (var i = 0; i < 15; i++) {
            let line = document.createElement('div')
            for (var j = 0; j < 15; j++) {
                line.innerHTML += "<div class='box'></div>"
            }
            table.appendChild(line)
        }
        table.addEventListener('click', a, true) //事件委托
    }
}
/**
 * 画棋盘线
 */
function draw(ctx, x, y, x1, y1) {
    ctx.moveTo(x, y)
    ctx.lineTo(x1, y1)
    ctx.lineWidth = '2'
}

function a(event) { //用于绑定和解绑
    edition == 'dom' ?
        create(event.clientX, event.clientY) :
        createC(event.offsetX - 10, event.offsetY - 10)

}

/**
 * 下棋 - dom
 */
function create(x, y) {
    var chess = document.createElement('img')
    chess.className = 'chess'
    chess.style.position = 'absolute'
    var _x = x - table.offsetLeft
    var _y = y - table.offsetTop
    if (_x % 40 >= 19 && _x % 40 <= 21 || _y % 40 >= 19 && _y % 40 <= 21) { //不在半径范围内
        return
    } else {
        let chessX = table.offsetLeft + Math.round(_x / 40) * 40 - 10.5 //获取准确left,top值以定位棋子
        let chessY = table.offsetTop + Math.round(_y / 40) * 40 - 10.5
        if (chessArr.filter(item => item.x == chessX && item.y == chessY).length != 0) return
        chess.style.left = chessX + 'px'
        chess.style.top = chessY + 'px'
        chessArr.length % 2 == 0 ? chess.src = 'black.png' : chess.src = 'white.png'
        document.body.appendChild(chess)
        chessArr.push({
            x: chessX,
            y: chessY,
            type: chessArr.length % 2 == 0 ? 'black' : 'white'
        })
        if (chessArr.length >= 9) { //棋子最少要9颗才能赢
            var a = ifWin()
            if (a) {
                setTimeout(() => {
                    alert(a)
                    end = true
                }, 0);
                chessArr = []
                temp = null
            }
        }
    }
    backTime = 0 //过棋之后才能悔棋
}
/**
 * 下棋 - canvas
 */
function createC(x, y) {
    if (x % 40 >= 19 && x % 40 <= 21 || y % 40 >= 19 && y % 40 <= 21) { //不在半径范围内
        return
    } else {
        let ctx = table1.getContext('2d')
        let chessX = Math.round(x / 40) * 40 + 10
        let chessY = Math.round(y / 40) * 40 + 10
        if (chessArr.filter(item => item.x == chessX && item.y == chessY).length != 0) return
        canvasStates.push(ctx.getImageData(0, 0, 620, 620)) //保存下棋前的状态
        ctx.beginPath()
        ctx.arc(chessX, chessY, 10, 0, 2 * Math.PI)
        chessArr.length % 2 == 0 ? ctx.fillStyle = 'black' : ctx.fillStyle = 'white'
        var obj = {
            x: chessX,
            y: chessY,
            type: chessArr.length % 2 == 0 ? 'black' : 'white'
        }
        chessArr.push(obj)
        ctx.fill()
        ctx.closePath()
        tempCanvas.img = ctx.getImageData(0, 0, 620, 620) //保存下棋后的状态
        tempCanvas.chess = obj
        if (chessArr.length >= 9) { //棋子最少要9颗才能赢
            var a = ifWin()
            if (a) {
                setTimeout(() => {
                    alert(a)
                    end = true
                }, 0);
                chessArr = []
                tempCanvas = {
                    img: null,
                    chess: null
                }
            }
        }
    }
    backTime = 0 //过棋之后才能悔棋
}
/**
 * 重开 - dom
 */
function restart() {
    Array.from(document.querySelectorAll('.chess')).forEach(item => document.body.removeChild(item))
    chessArr = []
    temp = null
    backTime = 0
    if (end == true)
        table.addEventListener('click', a, true)
}

/**
 * 重开 -canvas
 */
function restartC() {
    let ctx = table1.getContext('2d')
    ctx.putImageData(initState, 0, 0)
    chessArr = []
    tempCanvas = {
        img: null,
        chess: null
    }
    canvasStates = []
    backTime = 0
    if (end == true)
        table1.addEventListener('click', a, true)
}
/**
 * 悔棋 - dom
 */
function back(event) {
    if (chessArr.length == 0) {
        return
    }
    if (backTime != 0) {
        alert('你已经悔过棋了！')
    } else {
        if (event.target.id == 'dom-back') {
            temp = Array.from(document.querySelectorAll('.chess')).pop()
            document.body.removeChild(temp)
        } else { //canvas
            let ctx = table1.getContext('2d')
            ctx.putImageData(canvasStates.pop(), 0, 0)
        }
        chessArr.pop()
        backTime++
    }
}
/**
 * 撤销悔棋
 */
function cancelBack() {
    if (temp != null) {
        document.body.appendChild(temp)
        chessArr.push({
            x: +temp.style.left.split('p')[0],
            y: +temp.style.top.split('p')[0],
            type: temp.src.includes('black') ? 'black' : 'white'
        })
        temp = null
    } else {
        alert('没有悔棋哦！')
    }
}
/**
 * 
 */
function cancelBackC(params) {
    if (tempCanvas.chess != null) {
        let ctx = table1.getContext('2d')
        ctx.putImageData(tempCanvas.img, 0, 0)
        chessArr.push(tempCanvas.chess)
        tempCanvas = {
            img: null,
            chess: null
        }
    } else {
        alert('没有悔棋哦！')
    }
}
/**
 * 判断一方是否胜利
 */
function ifWin() {
    var leftRightCount = 1
    var upDownCount = 1
    var leftDownRightTopCount = 1
    var leftTopRightDownCount = 1
    var blackArr = chessArr.filter(item => item.type == 'black')
    var whiteArr = chessArr.filter(item => item.type == 'white')
    var lastChess = chessArr[chessArr.length - 1]
    //判断横向
    for (let i = lastChess.x - 40, j = lastChess.x + 40; i > 0, j < table.offsetLeft + 600; i -= 40, j += 40) {
        if (lastChess.type == 'black') {
            let tempCount = blackArr.filter(item => (item.x == i && item.y == lastChess.y) || (item.x == j && item.y == lastChess.y)).length
            if (tempCount > 0) {
                leftRightCount += tempCount
            } else {
                break
            }
        } else {
            let tempCount = whiteArr.filter(item => (item.x == i && item.y == lastChess.y) || (item.x == j && item.y == lastChess.y)).length
            if (tempCount > 0) {
                leftRightCount += tempCount
            } else {
                break
            }
        }
        if (leftRightCount == 5) {
            edition == 'dom' ? table.removeEventListener('click', a, true) : table1.removeEventListener('click', a, true)
            return lastChess.type == 'black' ? '黑棋胜利' : '白棋胜利'
        }
    }
    //判断纵向
    for (let i = lastChess.y - 40, j = lastChess.y + 40; i > 0, j < table.offsetTop + 600; i -= 40, j += 40) {
        if (lastChess.type == 'black') {
            let tempCount = blackArr.filter(item => (item.y == i && item.x == lastChess.x) || (item.y == j && item.x == lastChess.x)).length
            if (tempCount > 0) {
                upDownCount += tempCount
            } else {
                break
            }
        } else {
            let tempCount = whiteArr.filter(item => (item.y == i && item.x == lastChess.x) || (item.y == j && item.x == lastChess.x)).length
            if (tempCount > 0) {
                upDownCount += tempCount
            } else {
                break
            }
        }
        if (upDownCount == 5) {
            edition == 'dom' ? table.removeEventListener('click', a, true) : table1.removeEventListener('click', a, true)
            return lastChess.type == 'black' ? '黑棋胜利' : '白棋胜利'
        }
    }
    //判断左下右上斜向
    for (let i = lastChess.x - 40, j = lastChess.x + 40, k = lastChess.y + 40, l = lastChess.y - 40; i > 0, j < table.offsetLeft + 600, k < table.offsetTop + 600, l > 0; i -= 40, j += 40, k += 40, l -= 40) {
        let c = doCount('leftDownRightTop', i, j, k, l)
        if (c == 0) break
        else leftDownRightTopCount += c
        if (leftDownRightTopCount == 5) {
            edition == 'dom' ? table.removeEventListener('click', a, true) : table1.removeEventListener('click', a, true)
            return lastChess.type == 'black' ? '黑棋胜利' : '白棋胜利'
        }
    }
    //判断左上右下斜向
    for (let i = lastChess.x - 40, j = lastChess.x + 40, k = lastChess.y - 40, l = lastChess.y + 40; i > 0, j < table.offsetLeft + 600, k > 0, l < table.offsetTop + 600; i -= 40, j += 40, k -= 40, l += 40) {
        let c = doCount('leftTopRightDown', i, j, k, l)
        if (c == 0) break
        else leftTopRightDownCount += c
        if (leftTopRightDownCount == 5) {
            edition == 'dom' ? table.removeEventListener('click', a, true) : table1.removeEventListener('click', a, true)
            return lastChess.type == 'black' ? '黑棋胜利' : '白棋胜利'
        }
    }

    function doCount(type, i, j, k, l) {
        let count = 0
        if (lastChess.type == 'black') {
            let tempCount = blackArr.filter(item => (item.x == i && item.y == k) || (item.x == j && item.y == l)).length
            if (tempCount > 0) {
                count += tempCount
            } else {
                return 0
            }
        } else {
            let tempCount = whiteArr.filter(item => (item.x == i && item.y == k) || (item.x == j && item.y == l)).length
            if (tempCount > 0) {
                count += tempCount
            } else {
                return 0
            }
        }
        return count
    }
}