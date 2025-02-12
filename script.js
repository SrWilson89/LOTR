const player = document.getElementById('player');
const enemiesContainer = document.getElementById('enemies-container');
const itemsContainer = document.getElementById('items-container');
const healthDisplay = document.getElementById('health');
const levelDisplay = document.getElementById('level');
const defeatedDisplay = document.getElementById('defeated');
const battleLog = document.getElementById('battle-log');
const gameOverScreen = document.getElementById('game-over');
const respawnButton = document.getElementById('respawn-button');

let playerHealth = 100;
let playerLevel = 1;
let enemiesDefeated = 0;
let playerDamage = 15;
let inBattle = false;
let isGameOver = false;
let enemies = [];
let items = [];

// Función para mover al jugador
document.addEventListener('keydown', movePlayer);

function movePlayer(event) {
    if (inBattle || isGameOver) return; // No mover al jugador durante la batalla o si el juego terminó

    let x = parseInt(player.style.left) || 190;
    let y = parseInt(player.style.top) || 190;

    switch(event.key) {
        case 'ArrowUp':
            y = Math.max(y - 10, 0);
            break;
        case 'ArrowDown':
            y = Math.min(y + 10, 380);
            break;
        case 'ArrowLeft':
            x = Math.max(x - 10, 0);
            break;
        case 'ArrowRight':
            x = Math.min(x + 10, 380);
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
    enemy.textContent = '👹';
    enemy.style.left = Math.floor(Math.random() * 380) + 'px';
    enemy.style.top = Math.floor(Math.random() * 380) + 'px';
    enemy.health = Math.floor(Math.random() * 50) + 30;
    enemy.damage = Math.floor(Math.random() * 10) + 5;
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
                checkLevelUp();
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
    playerHealth = 100;
    healthDisplay.textContent = playerHealth;
    player.style.left = '190px';
    player.style.top = '190px';
    addToLog('¡Has reaparecido!');
});

// Función para verificar si el jugador sube de nivel
function checkLevelUp() {
    if (enemiesDefeated >= playerLevel * 3) {
        playerLevel++;
        levelDisplay.textContent = playerLevel;
        addToLog(`¡Has subido al nivel ${playerLevel}!`);
        increaseDifficulty();
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

// Función para crear un item
function createItem() {
    const item = document.createElement('div');
    item.className = 'item';
    item.textContent = Math.random() > 0.5 ? '💍' : '🧪';
    item.style.left = Math.floor(Math.random() * 380) + 'px';
    item.style.top = Math.floor(Math.random() * 380) + 'px';
    item.type = item.textContent === '💍' ? 'power' : 'health';
    itemsContainer.appendChild(item);
    items.push(item);
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
        playerHealth += 20;
        addToLog('¡Has recogido una poción mágica! +20 de salud.');
    } else {
        playerDamage += 5;
        addToLog('¡Has encontrado el Anillo Único! +5 de daño.');
    }
    healthDisplay.textContent = playerHealth;
    items.splice(index, 1);
    item.remove();
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
for (let i = 0; i < 3; i++) {
    createEnemy();
}
for (let i = 0; i < 2; i++) {
    createItem();
}