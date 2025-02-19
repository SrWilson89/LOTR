const player = document.getElementById('player');
const enemiesContainer = document.getElementById('enemies-container');
const itemsContainer = document.getElementById('items-container');
const healthDisplay = document.getElementById('health');
const levelDisplay = document.getElementById('level');
const defeatedDisplay = document.getElementById('defeated');
const battleLog = document.getElementById('battle-log');
const gameOverScreen = document.getElementById('game-over');
const respawnButton = document.getElementById('respawn-button');
const inventoryList = document.getElementById('inventory-list');
const questList = document.getElementById('quest-list');

let playerHealth = 1000;
let playerLevel = 1;
let enemiesDefeated = 0;
let playerDamage = 40;
let inBattle = false;
let isGameOver = false;
let bossSpawned = false;
let enemies = [];
let items = [];
let inventory = [];
let quests = [
    { description: 'Derrota a 5 enemigos', completed: false, target: 5 },
    { description: 'Encuentra el Anillo Único', completed: false }
];

// Función para mover al jugador
document.addEventListener('keydown', movePlayer);

function movePlayer(event) {
    if (inBattle || isGameOver) return;

    let x = parseInt(player.style.left) || 390;
    let y = parseInt(player.style.top) || 390;

    switch(event.key) {
        case 'ArrowUp':
            y = Math.max(y - 10, 0);
            break;
        case 'ArrowDown':
            y = Math.min(y + 10, 780);
            break;
        case 'ArrowLeft':
            x = Math.max(x - 10, 0);
            break;
        case 'ArrowRight':
            x = Math.min(x + 10, 780);
            break;
    }

    player.style.left = x + 'px';
    player.style.top = y + 'px';

    checkForEnemies();
    checkForItems();
}

// Función para crear un enemigo
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    const enemyType = Math.random();

    if (enemyType < 0.33) {
        enemy.textContent = '👹'; // Orco común
        enemy.health = Math.floor(Math.random() * 50) + 30;
        enemy.damage = Math.floor(Math.random() * 10) + 5;
    } else if (enemyType < 0.66) {
        enemy.textContent = '🧌'; // Troll
        enemy.className += ' troll';
        enemy.health = Math.floor(Math.random() * 80) + 50;
        enemy.damage = Math.floor(Math.random() * 15) + 10;
    } else {
        enemy.textContent = '👤'; // Nazgûl
        enemy.className += ' nazgul';
        enemy.health = Math.floor(Math.random() * 100) + 70;
        enemy.damage = Math.floor(Math.random() * 20) + 15;
    }

    enemy.style.left = Math.floor(Math.random() * 380) + 'px';
    enemy.style.top = Math.floor(Math.random() * 380) + 'px';
    enemiesContainer.appendChild(enemy);
    enemies.push(enemy);
}

// Función para verificar colisiones con enemigos
function checkForEnemies() {
    const playerRect = player.getBoundingClientRect();
    enemies.forEach((enemy, index) => {
        const enemyRect = enemy.getBoundingClientRect();
        if (playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top) {
            startBattle(enemy, index);
        }
    });
}

// Función para iniciar una batalla
function startBattle(enemy, index) {
    inBattle = true;
    addToLog(`¡Un enemigo (${enemy.textContent}) con ${enemy.health} de salud aparece!`);

    const battleInterval = setInterval(() => {
        if (playerHealth <= 0 || enemy.health <= 0) {
            clearInterval(battleInterval);
            inBattle = false;
            if (playerHealth <= 0) {
                gameOver();
            } else {
                addToLog('¡Has derrotado al enemigo!');
                enemies.splice(index, 1);
                enemy.remove();
                enemiesDefeated++;
                defeatedDisplay.textContent = enemiesDefeated;

                // Crear un objeto en la posición del enemigo derrotado
                createItemAtPosition(parseInt(enemy.style.left), parseInt(enemy.style.top));

                checkLevelUp();
                checkQuests();
            }
            return;
        }

        const playerAttack = Math.floor(Math.random() * playerDamage) + 1;
        const enemyAttack = Math.floor(Math.random() * enemy.damage) + 1;

        enemy.health -= playerAttack;
        playerHealth -= enemyAttack;

        addToLog(`Le hiciste ${playerAttack} de daño al enemigo.`);
        addToLog(`El enemigo te hizo ${enemyAttack} de daño.`);

        healthDisplay.textContent = playerHealth;
    }, 1000);
}

// Función para crear un objeto en una posición específica
function createItemAtPosition(x, y) {
    const item = document.createElement('div');
    item.className = 'item';
    item.textContent = Math.random() > 0.5 ? '💍' : '🧪';
    item.style.left = x + 'px';
    item.style.top = y + 'px';
    item.type = item.textContent === '💍' ? 'power' : 'health';
    itemsContainer.appendChild(item);
    items.push(item);
}

// Función para mostrar "Game Over"
function gameOver() {
    isGameOver = true;
    gameOverScreen.classList.remove('hidden');
    addToLog('¡Has sido derrotado!');
    playerHealth = 0;
    healthDisplay.textContent = playerHealth;
}

// Función para reaparecer
respawnButton.addEventListener('click', () => {
    isGameOver = false;
    gameOverScreen.classList.add('hidden');
    playerHealth = 1000;
    healthDisplay.textContent = playerHealth;
    player.style.left = '390px';
    player.style.top = '390px';
    addToLog('¡Has reaparecido!');
});

// Función para verificar si el jugador sube de nivel
function checkLevelUp() {
    if (enemiesDefeated >= playerLevel * 3) {
        playerLevel++;
        levelDisplay.textContent = playerLevel;
        addToLog(`¡Has subido al nivel ${playerLevel}!`);
        increaseDifficulty();
        checkForBoss();
    }
}

// Función para aumentar la dificultad
function increaseDifficulty() {
    playerHealth += 20;
    healthDisplay.textContent = playerHealth;

    for (let i = 0; i < playerLevel; i++) {
        createEnemy();
    }
}

// Función para verificar si aparece el jefe
function checkForBoss() {
    if (enemiesDefeated >= 10 && !bossSpawned) {
        spawnBoss();
        bossSpawned = true;
    }
}

// Función para generar el jefe
function spawnBoss() {
    const boss = document.createElement('div');
    boss.className = 'enemy boss';
    boss.textContent = '👁️'; // Sauron
    boss.style.left = Math.floor(Math.random() * 380) + 'px';
    boss.style.top = Math.floor(Math.random() * 380) + 'px';
    boss.health = 200; // Salud alta
    boss.damage = 30; // Daño alto
    enemiesContainer.appendChild(boss);
    enemies.push(boss);
    addToLog('¡Sauron ha aparecido! ¡Cuidado!');
}

// Función para verificar colisiones con items
function checkForItems() {
    const playerRect = player.getBoundingClientRect();
    items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        if (playerRect.left < itemRect.right &&
            playerRect.right > itemRect.left &&
            playerRect.top < itemRect.bottom &&
            playerRect.bottom > itemRect.top) {
            pickUpItem(item, index);
        }
    });
}

// Función para recoger un item
function pickUpItem(item, index) {
    if (item.type === 'health') {
        inventory.push('🧪'); // Poción
        addToLog('¡Has recogido una poción mágica!');
    } else {
        inventory.push('💍'); // Anillo
        addToLog('¡Has encontrado el Anillo Único!');
    }
    updateInventory();
    items.splice(index, 1);
    item.remove();
    checkQuests();
}

// Función para actualizar el inventario
function updateInventory() {
    inventoryList.innerHTML = inventory.map(item => `<li>${item}</li>`).join('');
}

// Función para verificar misiones
function checkQuests() {
    quests.forEach(quest => {
        if (!quest.completed) {
            if (quest.target && enemiesDefeated >= quest.target) {
                quest.completed = true;
                addToLog(`¡Misión completada: ${quest.description}!`);
            } else if (inventory.includes('💍')) {
                quest.completed = true;
                addToLog(`¡Misión completada: ${quest.description}!`);
            }
        }
    });
    updateQuests();
}

// Función para actualizar las misiones
function updateQuests() {
    questList.innerHTML = quests.map(quest => `
        <li>${quest.description} ${quest.completed ? '✅' : ''}</li>
    `).join('');
}

// Función para agregar mensajes al registro de batalla
function addToLog(message) {
    battleLog.innerHTML += message + '<br>';
    let lines = battleLog.innerHTML.split('<br>');
    if (lines.length > 10) {
        lines = lines.slice(-10);
        battleLog.innerHTML = lines.join('<br>');
    }
    battleLog.scrollTop = battleLog.scrollHeight;
}

// Inicializar el juego
function initializeGame() {
    for (let i = 0; i < 3; i++) {
        createEnemy();
    }
    for (let i = 0; i < 2; i++) {
        createItem();
    }
    updateQuests();
}

initializeGame();
// Agregar una función para mostrar el mensaje de victoria
function showVictoryMessage() {
    const victoryMessage = document.createElement('div');
    victoryMessage.id = 'victory-message';
    victoryMessage.innerHTML = `
        <p>¡Has ganado!</p>
        <button id="restart-button">Reiniciar Juego</button>
    `;
    victoryMessage.style.position = 'absolute';
    victoryMessage.style.top = '50%';
    victoryMessage.style.left = '50%';
    victoryMessage.style.transform = 'translate(-50%, -50%)';
    victoryMessage.style.textAlign = 'center';
    victoryMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    victoryMessage.style.padding = '20px';
    victoryMessage.style.borderRadius = '10px';
    victoryMessage.style.color = 'white';
    victoryMessage.style.zIndex = '1000';
    document.body.appendChild(victoryMessage);

    // Agregar un botón para reiniciar el juego
    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', () => {
        location.reload(); // Recargar la página para reiniciar el juego
    });
}

// Modificar la función checkQuests para verificar si el jugador ha ganado
function checkQuests() {
    let quest1Completed = false; // Misión 1: Derrotar a 5 enemigos
    let quest2Completed = false; // Misión 2: Encontrar el Anillo Único

    quests.forEach(quest => {
        if (!quest.completed) {
            if (quest.target && enemiesDefeated >= quest.target) {
                quest.completed = true;
                addToLog(`¡Misión completada: ${quest.description}!`);
                quest1Completed = true; // Marcar la primera misión como completada
            } else if (inventory.includes('💍')) {
                quest.completed = true;
                addToLog(`¡Misión completada: ${quest.description}!`);
                quest2Completed = true; // Marcar la segunda misión como completada
            }
        } else {
            // Si la misión ya estaba completada, verificamos cuál es
            if (quest.description === 'Derrota a 5 enemigos') {
                quest1Completed = true;
            } else if (quest.description === 'Encuentra el Anillo Único') {
                quest2Completed = true;
            }
        }
    });

    updateQuests();

    // Verificar si ambas misiones están completadas
    if (quest1Completed && quest2Completed) {
        showVictoryMessage();
    }
}
// Función para crear decoraciones (árboles y rocas)
function createDecorations() {
    const decorations = ['🌳', '🌲', '🪨']; // Emojis para árboles y rocas
    for (let i = 0; i < 10; i++) { // Crear 10 decoraciones
        const decoration = document.createElement('div');
        decoration.className = 'decoration';
        decoration.textContent = decorations[Math.floor(Math.random() * decorations.length)];
        if (decoration.textContent === '🪨') {
            decoration.classList.add('rock');
        } else {
            decoration.classList.add('tree');
        }
        decoration.style.left = Math.floor(Math.random() * 780) + 'px';
        decoration.style.top = Math.floor(Math.random() * 780) + 'px';
        document.getElementById('map').appendChild(decoration);
    }
}

// Llamar a la función para crear decoraciones al inicializar el juego
function initializeGame() {
    createDecorations(); // Agregar decoraciones
    for (let i = 0; i < 3; i++) {
        createEnemy();
    }
    for (let i = 0; i < 2; i++) {
        createItem();
    }
    updateQuests();
}
// Agrega esto al final del archivo script.js

// Obtener los botones de control móvil
const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const downButton = document.getElementById('down');
const rightButton = document.getElementById('right');

// Funciones para mover al jugador
function moveUp() {
    movePlayer({ key: 'ArrowUp' });
}

function moveLeft() {
    movePlayer({ key: 'ArrowLeft' });
}

function moveDown() {
    movePlayer({ key: 'ArrowDown' });
}

function moveRight() {
    movePlayer({ key: 'ArrowRight' });
}

// Asignar eventos a los botones
upButton.addEventListener('click', moveUp);
leftButton.addEventListener('click', moveLeft);
downButton.addEventListener('click', moveDown);
rightButton.addEventListener('click', moveRight);

// Permitir arrastrar los botones (opcional)
let isDragging = false;

function startDrag(event) {
    isDragging = true;
}

function endDrag() {
    isDragging = false;
}

function handleDrag(event) {
    if (isDragging) {
        const button = event.target;
        const rect = button.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        button.style.position = 'absolute';
        button.style.left = `${event.clientX - offsetX}px`;
        button.style.top = `${event.clientY - offsetY}px`;
    }
}

// Asignar eventos de arrastre (opcional)
document.querySelectorAll('#mobile-controls button').forEach(button => {
    button.addEventListener('mousedown', startDrag);
    button.addEventListener('touchstart', startDrag);
    button.addEventListener('mouseup', endDrag);
    button.addEventListener('touchend', endDrag);
    button.addEventListener('mousemove', handleDrag);
    button.addEventListener('touchmove', handleDrag);
});