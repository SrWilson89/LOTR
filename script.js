const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const healthDisplay = document.getElementById('health');
const defeatedDisplay = document.getElementById('defeated');
const battleLog = document.getElementById('battle-log');

let playerHealth = 100;
let enemiesDefeated = 0;
let enemyHealth = 50;

document.addEventListener('keydown', movePlayer);

function movePlayer(event) {
    let x = parseInt(player.style.left) || 190;
    let y = parseInt(player.style.top) || 190;

    switch(event.key) {
        case 'ArrowUp':
            y -= 10;
            break;
        case 'ArrowDown':
            y += 10;
            break;
        case 'ArrowLeft':
            x -= 10;
            break;
        case 'ArrowRight':
            x += 10;
            break;
    }

    player.style.left = x + 'px';
    player.style.top = y + 'px';

    checkForEnemy();
}

function checkForEnemy() {
    let playerRect = player.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (playerRect.left < enemyRect.right &&
        playerRect.right > enemyRect.left &&
        playerRect.top < enemyRect.bottom &&
        playerRect.bottom > enemyRect.top) {
        startBattle();
    }
}

function startBattle() {
    enemy.style.display = 'block';
    battleLog.innerHTML += '¡Un enemigo aparece!<br>';

    let battleInterval = setInterval(() => {
        let playerDamage = Math.floor(Math.random() * 15) + 1;
        let enemyDamage = Math.floor(Math.random() * 10) + 1;

        enemyHealth -= playerDamage;
        playerHealth -= enemyDamage;

        battleLog.innerHTML += `Le hiciste ${playerDamage} de daño al enemigo.<br>`;
        battleLog.innerHTML += `El enemigo te hizo ${enemyDamage} de daño.<br>`;

        if (enemyHealth <= 0) {
            clearInterval(battleInterval);
            enemy.style.display = 'none';
            enemiesDefeated++;
            defeatedDisplay.textContent = enemiesDefeated;
            battleLog.innerHTML += '¡Has derrotado al enemigo!<br>';
            enemyHealth = 50;
            respawnEnemy();
        }

        if (playerHealth <= 0) {
            clearInterval(battleInterval);
            battleLog.innerHTML += '¡Has sido derrotado!<br>';
            playerHealth = 0;
        }

        healthDisplay.textContent = playerHealth;
    }, 1000);
}

function respawnEnemy() {
    let x = Math.floor(Math.random() * 380);
    let y = Math.floor(Math.random() * 380);
    enemy.style.left = x + 'px';
    enemy.style.top = y + 'px';
}

// Inicializar enemigo
respawnEnemy();

function movePlayer(event) {
    let x = parseInt(player.style.left) || 190;
    let y = parseInt(player.style.top) || 190;

    switch(event.key) {
        case 'ArrowUp':
            y = Math.max(y - 10, 0); // No permitir moverse más allá del borde superior
            break;
        case 'ArrowDown':
            y = Math.min(y + 10, 380); // No permitir moverse más allá del borde inferior
            break;
        case 'ArrowLeft':
            x = Math.max(x - 10, 0); // No permitir moverse más allá del borde izquierdo
            break;
        case 'ArrowRight':
            x = Math.min(x + 10, 380); // No permitir moverse más allá del borde derecho
            break;
    }

    player.style.left = x + 'px';
    player.style.top = y + 'px';

    checkForEnemy();
}

function respawnEnemy() {
    let playerRect = player.getBoundingClientRect();
    let x, y;

    do {
        x = Math.floor(Math.random() * 380);
        y = Math.floor(Math.random() * 380);
    } while (
        Math.abs(x - playerRect.left) < 50 && Math.abs(y - playerRect.top) < 50
    );

    enemy.style.left = x + 'px';
    enemy.style.top = y + 'px';
}

function startBattle() {
    enemy.style.display = 'block';
    battleLog.innerHTML += '¡Un enemigo aparece!<br>';

    let battleInterval = setInterval(() => {
        if (playerHealth <= 0 || enemyHealth <= 0) {
            clearInterval(battleInterval);
            if (playerHealth <= 0) {
                battleLog.innerHTML += '¡Has sido derrotado!<br>';
                playerHealth = 0;
                healthDisplay.textContent = playerHealth;
            }
            return;
        }

        let playerDamage = Math.floor(Math.random() * 15) + 1;
        let enemyDamage = Math.floor(Math.random() * 10) + 1;

        enemyHealth -= playerDamage;
        playerHealth -= enemyDamage;

        battleLog.innerHTML += `Le hiciste ${playerDamage} de daño al enemigo.<br>`;
        battleLog.innerHTML += `El enemigo te hizo ${enemyDamage} de daño.<br>`;

        if (enemyHealth <= 0) {
            clearInterval(battleInterval);
            enemy.style.display = 'none';
            enemiesDefeated++;
            defeatedDisplay.textContent = enemiesDefeated;
            battleLog.innerHTML += '¡Has derrotado al enemigo!<br>';
            enemyHealth = 50;
            respawnEnemy();
        }

        healthDisplay.textContent = playerHealth;
    }, 1000);
}

function addToLog(message) {
    battleLog.innerHTML += message + '<br>';
    // Limitar el registro a las últimas 10 líneas
    let lines = battleLog.innerHTML.split('<br>');
    if (lines.length > 10) {
        lines = lines.slice(-10);
        battleLog.innerHTML = lines.join('<br>');
    }
    // Desplazar el scroll al final
    battleLog.scrollTop = battleLog.scrollHeight;
}

let inBattle = false;

function movePlayer(event) {
    if (inBattle) return; // No mover al jugador durante la batalla

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

    checkForEnemy();
}

function startBattle() {
    inBattle = true; // Activar el estado de batalla
    enemy.style.display = 'block';
    addToLog('¡Un enemigo aparece!');

    let battleInterval = setInterval(() => {
        if (playerHealth <= 0 || enemyHealth <= 0) {
            clearInterval(battleInterval);
            inBattle = false; // Desactivar el estado de batalla
            if (playerHealth <= 0) {
                addToLog('¡Has sido derrotado!');
                playerHealth = 0;
                healthDisplay.textContent = playerHealth;
            }
            return;
        }

        let playerDamage = Math.floor(Math.random() * 15) + 1;
        let enemyDamage = Math.floor(Math.random() * 10) + 1;

        enemyHealth -= playerDamage;
        playerHealth -= enemyDamage;

        addToLog(`Le hiciste ${playerDamage} de daño al enemigo.`);
        addToLog(`El enemigo te hizo ${enemyDamage} de daño.`);

        if (enemyHealth <= 0) {
            clearInterval(battleInterval);
            inBattle = false; // Desactivar el estado de batalla
            enemy.style.display = 'none';
            enemiesDefeated++;
            defeatedDisplay.textContent = enemiesDefeated;
            addToLog('¡Has derrotado al enemigo!');
            enemyHealth = 50;
            respawnEnemy();
        }

        healthDisplay.textContent = playerHealth;
    }, 1000);
}