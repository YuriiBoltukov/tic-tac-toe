const playBtn = document.querySelector('.play');
const statisticsBtn = document.querySelector('.statistics');
const sandbox = document.querySelector('.sandbox');
/**
 * Variable for saving settings for modal window
 * @type {{title: string, text: string, buttons: {title: string, class: string}[]}}
 */
const params = {
    title: 'Let\'s play!',
    text: 'Choose a shape!',
    buttons: [
        {
            title: 'O',
            class: 'circle',
        },
        {
            title: 'X - Is first!',
            class: 'cross',
        },
    ]
};
const modal = new Modal(params);

playBtn.addEventListener('click', () => {
    sandbox.innerHTML = '';
    playBtn.style.display = 'none';
    sandbox.style.display = 'block';
    statisticsBtn.style.display = 'block';
    createPlayground();
    showOverflowElement();
});

statisticsBtn.addEventListener('click', () => {
    sandbox.innerHTML = createTable();
    statisticsBtn.style.display = 'none';
    sandbox.style.display = 'block';
    playBtn.style.display = 'block';
});

function showOverflowElement() {
    modal.present();

    document.querySelector('.circle').addEventListener('click', () => {
        clickAudio.play();
        modal.dismiss();
        play(true);
    });
    document.querySelector('.cross').addEventListener('click', () => {
        clickAudio.play();
        modal.dismiss();
        play(false);
    });
}

function createTable() {
    const data = JSON.parse(localStorage.getItem('table')).slice(-10);
    return `
        <table class="table caption-top table-primary">
            <caption>List of users</caption>
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Won</th>
                    <th scope="col">Combination</th>
                    <th scope="col">Moves</th>
                </tr>
            </thead>
            <tbody>
                ${createTableBody(data)}
            </tbody>
        </table>
    `;
}

function createTableBody(data) {
    return data.reduce((acc, el, i) => {
        const row = `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${el.winner}</td>
                <td>${el.combination}</td>
                <td>${el.moves}</td>
            </tr>
        `;
        return acc += row;
    }, '')
}