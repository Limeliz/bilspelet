const players = ['Förare', 'Shotgun', 'Vänster', 'Höger'];
const buttons = [
  { name: 'Polis', value: 5, color: '#81d4fa', dark: true },
  { name: 'Brand', value: 5, color: '#f44336' },
  { name: 'Sjukvård', value: 5, color: '#8bc34a', dark: true },
  { name: 'Utryckning', value: 2, color: '#2196f3' },
  { name: 'Polismotorcykel', value: 8, color: '#9c27b0' },
  { name: 'Bakhjulskörning', value: 15, color: '#ff9800', dark: true },
  { name: 'Övningskörning', value: 1, color: '#4caf50' },
  { name: 'Hajbussen', value: 5, color: 'gray' },
  { name: 'Djurambulans', value: 8, color: 'YellowGreen', dark: true }
];

let data = JSON.parse(localStorage.getItem('scoreData')) || players.map(() => ({
  total: 0,
  history: [],
  counts: {}
}));

function saveData() {
  localStorage.setItem('scoreData', JSON.stringify(data));
}

function createGameGrid() {
  const grid = document.getElementById('gameGrid');
  grid.innerHTML = '';
  players.forEach((name, i) => {
    const cell = document.createElement('div');
    cell.className = 'playerCell';

    const title = document.createElement('h2');
    title.textContent = name + ': ' + data[i].total + ' p';
    cell.appendChild(title);

    const btnContainer = document.createElement('div');
    const cols = Math.ceil(Math.sqrt(buttons.length));
    btnContainer.style.display = 'grid';
    btnContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    btnContainer.style.gap = '5px';

    buttons.forEach(btn => {
      const b = document.createElement('button');
      b.textContent = btn.name + ' (' + btn.value + ')';
	  b.style.backgroundColor = btn.color || '#ccc';
	  console.log("btn: "+btn.name+" color: "+btn.color);
	  b.style.color = btn.dark ? 'black' : 'white';
      b.onclick = () => {
        data[i].total += btn.value;
        data[i].history.push(btn);
        data[i].counts[btn.name] = (data[i].counts[btn.name] || 0) + 1;
        saveData();
        createGameGrid();
      };
      btnContainer.appendChild(b);
    });

    cell.appendChild(btnContainer);

    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Ångra';
    undoBtn.onclick = () => {
      const last = data[i].history.pop();
      if (last) {
        data[i].total -= last.value;
        data[i].counts[last.name]--;
        if (data[i].counts[last.name] === 0) delete data[i].counts[last.name];
        saveData();
        createGameGrid();
      }
    };
    cell.appendChild(undoBtn);

    grid.appendChild(cell);
  });

}

function showResults() {
  const panel = document.getElementById('resultsPanel');
  const resultsGrid = document.getElementById('resultsGrid');
  resultsGrid.innerHTML = '';
  data.forEach((playerData, i) => {
    const resCell = document.createElement('div');
    resCell.className = 'resultCell';
    resCell.innerHTML = `<h3>${players[i]}</h3>`;
    for (const [key, val] of Object.entries(playerData.counts)) {
      resCell.innerHTML += `<div>${key}: ${val} st</div>`;
    }
    resCell.innerHTML += `<strong>Totalt: ${playerData.total} p</strong>`;
    resultsGrid.appendChild(resCell);
  });
  panel.classList.remove('hidden');
}

function resetAll() {
  if (confirm('Är du säker på att du vill nollställa alla resultat?')) {
    data = players.map(() => ({
      total: 0,
      history: [],
      counts: {}
    }));
    saveData();
    createGameGrid();
  }
}

document.getElementById('showResultsBtn').onclick = showResults;
document.getElementById('closeResultsBtn').onclick = () => {
  document.getElementById('resultsPanel').classList.add('hidden');
};
document.getElementById('resetBtn').onclick = resetAll;

createGameGrid();
