const moveAudio = new Audio('./assets/tick.mp3');
const winAudio = new Audio('./assets/win.mp3');
const clickAudio = new Audio('./assets/click.mp3');

let playground;

function createPlayground () {
    playground = document.createElement('canvas');
    playground.setAttribute('id', 'playground');
    playground.width = 600;
    playground.height = 600;
    document.querySelector('.sandbox').appendChild(playground);
};

function play(isComputer) {
    /**
     * Variable for saving canvas
     * @type {HTMLElement}
     */
    const canvas = document.getElementById('playground');
    /**
     * Variable for saving context of canvas
     */
    const ctx = canvas.getContext('2d');
    /**
     * Variable for saving width of playground
     * @type {number}
     */
    const gridWidth = canvas.width;
    /**
     * Variable for saving size of playground
     * @type {number}
     */
    const playgroundSize = 3;
    /**
     * Variable for saving width of side of cell
     * @type {number}
     */
    const sideOfCell = gridWidth / playgroundSize;
    /**
     * Variable for saving all available paths of playground
     * @type {{[key: string]: {offset: number[], value: undefined | string}}}
     */
    const fieldMap = {
        a1: {offset: [0, 0], value: undefined},
        a2: {offset: [sideOfCell, 0], value: undefined},
        a3: {offset: [2 * sideOfCell, 0], value: undefined},
        b1: {offset: [0, sideOfCell], value: undefined},
        b2: {offset: [sideOfCell, sideOfCell], value: undefined},
        b3: {offset: [2 * sideOfCell, sideOfCell], value: undefined},
        c1: {offset: [0, 2 * sideOfCell], value: undefined},
        c2: {offset: [sideOfCell, 2 * sideOfCell], value: undefined},
        c3: {offset: [2 * sideOfCell, 2 * sideOfCell], value: undefined},
    };
    /**
     * Variable for saving combination for win
     * @type {string[][]}
     */
    const combinationForWin = [
        ['a1', 'a2', 'a3'],
        ['b1', 'b2', 'b3'],
        ['c1', 'c2', 'c3'],
        ['a1', 'b2', 'c3'],
        ['a3', 'b2', 'c1'],
        ['a1', 'b1', 'c1'],
        ['a2', 'b2', 'c2'],
        ['a3', 'b3', 'c3'],
    ];
    /**
     * Variable for saving methods for players
     * @type {{cross: drawCross, circle: drawCircle}}
     */
    const figures = {
        'circle': drawCircle,
        'cross': drawCross,
    };
    /**
     * Variables for type of player
     * @type {string}
     */
    let player = 'circle'
    let comp = 'cross';
    /**
     * Variable for saving who now moving
     * @type {boolean}
     */
    let isComp = true;

    /**
     * Method for getting random index
     * @param max {number}
     * @returns {number}
     */
    function getRandomIntInclusive(max) {
        max = Math.floor(max);
        return Math.floor(Math.random() * (max + 1));
    }

    /**
     * Method for drawing circle
     * @param ctx
     * @param startX {number}
     * @param startY {number}
     */
    function drawCircle(ctx, startX = sideOfCell/2, startY = sideOfCell/2) {
        const radius = sideOfCell/2 - 20;
        const [x, y] = [startX + sideOfCell/2, startY + sideOfCell/2];

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2, false);
        ctx.lineWidth = '10';
        ctx.strokeStyle = '#1A1A1A';
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Method for drawing cross
     * @param ctx
     * @param x {number}
     * @param y {number}
     */
    function drawCross(ctx, x = 0, y = 0) {
        ctx.beginPath();
        ctx.moveTo(x + 20,y + 20);
        ctx.lineTo(x + sideOfCell - 20,y + sideOfCell - 20);
        ctx.fill();
        ctx.lineWidth = '10';
        ctx.strokeStyle = '#18BC9C';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(x + sideOfCell - 20,y + 20);
        ctx.lineTo(x + 20,y + sideOfCell - 20);
        ctx.fill();
        ctx.lineWidth = '10';
        ctx.strokeStyle = '#18BC9C';
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Method for drawing playground
     * @param ctx
     */
    function drawGrid(ctx) {
        for (let i = 0; i < playgroundSize; i++) {
            for (let j = 0; j < playgroundSize; j++) {
                ctx.strokeStyle = 'rgba(33,33,33,0.5)';
                ctx.stroke();
                ctx.strokeRect(j * sideOfCell, i * sideOfCell, sideOfCell, sideOfCell);
            }
        }
    }

    /**
     * Method for making random move
     * @returns {number[]},
     */
    function makeToMoveComp() {
        const paths = [];
        Object.entries(fieldMap).forEach(([key, object]) => {
            if(!object.value) paths.push(key);
        });
        const offset = [...fieldMap[paths[getRandomIntInclusive(paths.length - 1)]].offset]
            .map(value => value + 5);
        return offset;
    }

    /**
     * Method for drawing any figure
     * @param x {number}
     * @param y {number}
     * @param drawFn
     * @returns {boolean},
     */
    function drawFigure(x, y, drawFn, player) {
        Object.entries(fieldMap).forEach(([key, object]) => {
            if ((x > object.offset[0] && x < object.offset[0] + sideOfCell) &&
                (y > object.offset[1] && y < object.offset[1] + sideOfCell)) {
                if (!object.value) {
                    fieldMap[key].value = player;
                    drawFn(ctx, object.offset[0], object.offset[1]);
                    moveAudio.play();
                    if (player === 'player') changeWhoMoving();
                }
            }
        });
    }

    /**
     * Method for resolving winner
     * @returns {{winner: string, combination: string[]}}
     */
    function resolveWinner() {
        const moves = Object.values(fieldMap).filter(el => !!el.value).length || 0;
        const result = {'comp': [], 'player': []};
        Object.entries(fieldMap).forEach(([key, object]) => {
            if (object.value) result[object.value].push(key);
        });
        for (let combination of combinationForWin) {
            if (
                result['comp'].length >= 3 &&
                (combination.length + result['comp'].length - 3) === (new Set([...combination, ...result['comp']])).size) {
                return {winner: 'comp', combination, moves};
            } else if (
                result['player'].length >= 3 &&
                (combination.length + result['player'].length - 3) === (new Set([...combination, ...result['player']])).size) {
                return {winner: 'player', combination, moves};
            }
        };

        if (new Set([...result['comp'], ...result['player']]).size === 9) {
            return {winner: 'nothing', combination: [], moves};
        }
    }

    /**
     * Method for checking who is win
     * @returns {Promise<>boolean>}
     */
    async function checkWinner() {
        const winner = resolveWinner();
        if (!winner) return false;
        isComp = true;
        winAudio.play();
        console.log('winner',winner)
        const table = JSON.parse(localStorage.getItem('table'));
        if (table) localStorage.setItem('table', JSON.stringify([...table, winner]));
        else localStorage.setItem('table', JSON.stringify([winner]));
        await new Promise(res => {
            const timerId = setTimeout(async () => {
                showModal(winner.winner);
                clearTimeout(timerId);
            }, 300);
        });
        return true;
    }

    /**
     * Method for defining who need moving
     * @returns {Promise<void>}
     */
    async function changeWhoMoving() {
        const hasWinner = await checkWinner();
        if(!hasWinner) {
            const timerId = setTimeout(() => {
                isComp = !isComp;
                drawFigure(...makeToMoveComp(), figures[comp], 'comp');
                checkWinner();
                clearTimeout(timerId);
            }, 300);
        }
    }

    /**
     * Method for showing modal window
     * @param winnerName {string}
     */
    function showModal(winnerName) {
        const moves = Object.values(fieldMap).filter(el => !!el.value).length;
        const params = {
            buttons: [
                {
                    title: 'Okay',
                    class: 'agree',
                },
            ]
        }

        switch (winnerName) {
            case 'player':
                params.title = 'Congratulations!';
                params.text = `
                <p>You have won!</p>
                <p>Won figure - <strong>${player}</strong></p>
                <p>Number of moves - <strong>${moves}</strong></p>
            `;
                break;
            case 'comp':
                params.title = 'You lost!';
                params.text = 'Nothing wrong! Let\'s try again!';
                params.text = `
                <p>Nothing wrong! Let\'s try again!</p>
                <p>Won figure - <strong>${comp}</strong></p>
                <p>Number of moves - <strong>${moves}</strong></p>
            `;
                break;
            default:
                params.title = 'Standoff...';
                params.text = 'Nobody wins and nobody loses!';
                params.text = `
                <p>Nobody wins and nobody loses!</p>
                <p>Number of moves - <strong>${moves}<strong></p>
            `;
        }

        const modal = new Modal(params);
        modal.present();

        document.querySelector('.agree').addEventListener('click', () => {
            clickAudio.play();
            modal.dismiss();
            setTimeout(() => removePlay(isComputer), 300)
        });
    }

    /**
     * Method for init play
     */
    function initGame(isComputer) {
        [player, comp] = isComputer ? ['circle', 'cross'] : ['cross', 'circle'];
        isComp = isComputer;
        /**
         * Drawing playground
         */
        drawGrid(ctx);
        /**
         * Drawing figures by click
         */
        canvas
            .addEventListener(
                'click',
                (event) => {
                    if (!isComp) {
                        isComp = !isComp;
                        drawFigure(event.offsetX, event.offsetY, figures[player], 'player');
                    } else {
                        setTimeout(() => {
                            //location.reload();
                            removePlay(isComputer);
                        }, 300)
                    }
                });

        if (isComp) {
            drawFigure(...makeToMoveComp(), figures[comp], 'comp');
            isComp = !isComp;
        }
    }

    initGame(isComputer);
}

function removePlay(isComp) {
    document.querySelector('.sandbox').removeChild(playground);
    createPlayground();
    play(isComp);
}