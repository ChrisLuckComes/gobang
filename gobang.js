/**
 * 罗运来 五子棋 dom版
 */
window.onload = () => {
    let table = document.getElementById('table')
    loadTable()
}

temp = null //悔的那步棋
backTime = 0 //悔棋次数
chessArr = [] //棋子数组
/**
 * 绘制棋盘
 */
function loadTable() {
    for (var i = 0; i < 15; i++) {
        let line = document.createElement('div')
        for (var j = 0; j < 15; j++) {
            line.innerHTML += "<div class='box'></div>"
        }
        table.appendChild(line)
    }
    table.addEventListener('click', a, true)//事件委托
}

function a(event) { //用于绑定和解绑
    create(event.clientX, event.clientY)
}

/**
 * 下棋
 */
function create(x, y) {
    var chess = document.createElement('img')
    chess.className = 'chess'
    chess.style.position = 'absolute'
    var _x = x - table.offsetLeft
    var _y = y - table.offsetTop
    if (_x % 40 >= 5 && _x % 40 <= 35 || _y % 40 >= 5 && _y % 40 <= 35) {//不在半径范围内
        return
    } else {
        let chessX = table.offsetLeft + Math.round(_x / 40) * 40 - 10.5 //获取准确left,top值以定位棋子
        let chessY = table.offsetTop + Math.round(_y / 40) * 40 - 10.5
        chess.style.left = chessX + 'px'
        chess.style.top = chessY + 'px'
        chessArr.length % 2 == 0 ? chess.src = 'black.png' : chess.src = 'white.png'
        document.body.appendChild(chess)
        chessArr.push({
            x: chessX,
            y: chessY,
            type: chessArr.length % 2 == 0 ? 'black' : 'white'
        })
        if (chessArr.length >= 9) {//棋子最少要9颗才能赢
            var a = ifWin()
            if (a){
                setTimeout(() => {
                    alert(a)
                }, 0);
                chessArr=[]
                temp=null
            }
        }
    }
    backTime = 0 //过棋之后才能悔棋
}
/**
 * 重开
 */
function restart() {
    Array.from(document.querySelectorAll('.chess')).forEach(item => document.body.removeChild(item))
    chessArr = []
    temp = null
    backTime = 0
    table.addEventListener('click', a, true)
}

/**
 * 悔棋
 */
function back() {
    if (chessArr.length == 0) {
        return
    }
    if (backTime != 0) {
        alert('你已经悔过棋了！')
    } else {
        temp = Array.from(document.querySelectorAll('.chess')).pop()
        document.body.removeChild(temp)
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
 * 判断一方是否胜利
 */
function ifWin() {
    var leftRightCount = 1
    var upDownCount = 1
    var angCount = 1
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
            table.removeEventListener('click', a, true)
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
            table.removeEventListener('click', a, true)
            return lastChess.type == 'black' ? '黑棋胜利' : '白棋胜利'
        }
    }
    //判断斜向
    for (let i = lastChess.x - 40, j = lastChess.x + 40, k = lastChess.y - 40, l = lastChess.y + 40; i > 0, j < table.offsetLeft + 600, k > 0, l < table.offsetTop + 600; i -= 40, j += 40, k -= 40, l += 40) {
        if (lastChess.type == 'black') {
            let tempCount = blackArr.filter(item => (item.x == i && item.y == k) || (item.x == j && item.y == l)).length
            if (tempCount > 0) {
                angCount += tempCount
            } else {
                break
            }
        } else {
            let tempCount = whiteArr.filter(item => (item.x == i && item.y == k) || (item.x == j && item.y == l)).length
            if (tempCount > 0) {
                angCount += tempCount
            } else {
                break
            }
        }
        if (angCount == 5) {
            table.removeEventListener('click', a, true)
            return lastChess.type == 'black' ? '黑棋胜利' : '白棋胜利'
        }
    }

}