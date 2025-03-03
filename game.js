// Actualización del archivo game.js
document.addEventListener('DOMContentLoaded', function() {
  let playerHealth = 1000;
  let enemiesKilled = 0;
  let ringFound = false;
  let currentEnemy = null;
  let currentLocation = null;
  let playerDamage = 50; // Daño base del jugador
  
  // Efectos de sonido
  const sounds = {
    explore: new Audio('https://cdnjs.cloudflare.com/ajax/libs/soundjs/1.0.2/sound.js'), // Simula sonidos
    attack: new Audio('https://cdnjs.cloudflare.com/ajax/libs/soundjs/1.0.2/sound.js'),
    enemyDeath: new Audio('https://cdnjs.cloudflare.com/ajax/libs/soundjs/1.0.2/sound.js'),
    ringFound: new Audio('https://cdnjs.cloudflare.com/ajax/libs/soundjs/1.0.2/sound.js'),
    rest: new Audio('https://cdnjs.cloudflare.com/ajax/libs/soundjs/1.0.2/sound.js'),
    victory: new Audio('https://cdnjs.cloudflare.com/ajax/libs/soundjs/1.0.2/sound.js')
  };

  const elements = {
    health: document.getElementById('health'),
    enemiesKilled: document.getElementById('enemies-killed'),
    ringFound: document.getElementById('ring-found'),
    mainScreen: document.getElementById('main-screen'),
    gameLog: document.getElementById('game-log'),
    exploreBtn: document.getElementById('explore-btn'),
    attackBtn: document.getElementById('attack-btn'),
    searchBtn: document.getElementById('search-btn'),
    restBtn: document.getElementById('rest-btn'),
    victoryScreen: document.getElementById('victory-screen'),
    playAgainBtn: document.getElementById('play-again-btn'),
    playerDamage: document.getElementById('player-damage')
  };

  const enemies = [
    { name: 'Orco 👹', health: 100, damage: 30, image: '/api/placeholder/100/100', description: 'Un orco salvaje de las tierras oscuras.' },
    { name: 'Uruk-hai 🧌', health: 150, damage: 40, image: '/api/placeholder/100/100', description: 'Una cruza temible entre orcos y humanos, creada por Saruman.' },
    { name: 'Nazgûl 🧟♂️', health: 200, damage: 60, image: '/api/placeholder/100/100', description: 'Un espectro del anillo que fue una vez un rey humano.' },
    { name: 'Araña Gigante 🕷️', health: 120, damage: 35, image: '/api/placeholder/100/100', description: 'Una descendiente de Ungoliant que acecha en las sombras.' },
    { name: 'Troll de las Cavernas 👾', health: 250, damage: 50, image: '/api/placeholder/100/100', description: 'Una criatura enorme y brutal que habita en las profundidades.' }
  ];

  const locations = [
    { name: 'Bosque Negro 🌳', description: 'Un bosque oscuro y peligroso, hogar de arañas gigantes y otros peligros.', image: '/api/placeholder/100/100', enemyChance: 0.7, ringChance: 0.1, backgroundColor: '#1a3300' },
    { name: 'Montañas Nubladas ⛰️', description: 'Montañas altas y traicioneras donde los goblins acechan.', image: '/api/placeholder/100/100', enemyChance: 0.6, ringChance: 0.15, backgroundColor: '#40485e' },
    { name: 'Mordor 🌋', description: 'La tierra oscura dominada por Sauron.', image: '/api/placeholder/100/100', enemyChance: 0.9, ringChance: 0.2, backgroundColor: '#330000' },
    { name: 'Rivendell 🏞️', description: 'El último hogar acogedor al este del mar.', image: '/api/placeholder/100/100', enemyChance: 0.3, ringChance: 0.1, backgroundColor: '#0066cc' },
    { name: 'Minas de Moria ⚒️', description: 'Un laberinto de túneles antiguos bajo las montañas.', image: '/api/placeholder/100/100', enemyChance: 0.8, ringChance: 0.25, backgroundColor: '#1a1a1a' }
  ];

  function addToLog(message) {
    const logEntry = document.createElement('p');
    logEntry.innerHTML = message;
    elements.gameLog.appendChild(logEntry);
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
  }

  function updateStatus() {
    elements.health.textContent = playerHealth;
    elements.enemiesKilled.textContent = enemiesKilled;
    elements.ringFound.textContent = ringFound ? '✨ Encontrado' : '❌ No encontrado';
    
    // Actualiza el indicador de daño del jugador
    if (elements.playerDamage) {
      elements.playerDamage.textContent = playerDamage;
    }
    
    // Ajusta el color de la salud basado en su valor
    if (playerHealth < 300) {
      elements.health.style.color = '#ff0000';
    } else if (playerHealth < 600) {
      elements.health.style.color = '#ffaa00';
    } else {
      elements.health.style.color = '#55ff55';
    }
    
    if (enemiesKilled >= 5 && ringFound) victory();
    if (playerHealth <= 0) gameOver();
  }

  function explore() {
    // Reproduce sonido de exploración
    sounds.explore.play().catch(e => console.log('Error al reproducir sonido:', e));
    
    currentEnemy = null;
    elements.attackBtn.disabled = true;
    elements.searchBtn.disabled = true;
    currentLocation = locations[Math.floor(Math.random() * locations.length)];
    
    // Cambia el fondo de la pantalla principal según la ubicación
    elements.mainScreen.style.backgroundColor = currentLocation.backgroundColor;
    elements.mainScreen.style.transition = 'background-color 1s';
    
    elements.mainScreen.innerHTML = `
      <h2>${currentLocation.name}</h2>
      <div class="location-image" style="background-image: url('${currentLocation.image}')"></div>
      <p>${currentLocation.description}</p>
    `;
    
    addToLog(`🗺️ Has llegado a: <strong>${currentLocation.name}</strong>`);
    elements.searchBtn.disabled = false;

    if (Math.random() < currentLocation.enemyChance) {
      const enemy = JSON.parse(JSON.stringify(enemies[Math.floor(Math.random() * enemies.length)]));
      currentEnemy = enemy;
      
      elements.mainScreen.innerHTML += `
        <div class="enemy-encounter">
          <h3>⚠️ ¡Has encontrado un enemigo!</h3>
          <div class="enemy-avatar" style="background-image: url('${enemy.image}')"></div>
          <p>Un <span class="enemy">${enemy.name}</span> te ataca.</p>
          <div class="enemy-stats">
            <div>❤️ Salud: <span class="enemy-health">${enemy.health}</span></div>
            <div>⚔️ Daño: <span class="enemy-damage">${enemy.damage}</span></div>
          </div>
          <p class="enemy-description">${enemy.description}</p>
        </div>
      `;
      
      addToLog(`⚔️ ¡Un <span class="enemy">${enemy.name}</span> te ha encontrado!`);
      elements.attackBtn.disabled = false;
    }
  }
  
  function attack() {
    if (!currentEnemy) return;
    
    // Reproduce sonido de ataque
    sounds.attack.play().catch(e => console.log('Error al reproducir sonido:', e));
    
    // Daño aleatorio del jugador (entre 80% y 120% del daño base)
    const damageMultiplier = 0.8 + Math.random() * 0.4;
    const damage = Math.floor(playerDamage * damageMultiplier);
    
    // Aplicar daño al enemigo
    currentEnemy.health -= damage;
    
    // Animación de ataque
    const enemyAvatar = document.querySelector('.enemy-avatar');
    if (enemyAvatar) {
      enemyAvatar.classList.add('attack-animation');
      setTimeout(() => {
        enemyAvatar.classList.remove('attack-animation');
      }, 500);
    }
    
    addToLog(`⚔️ Has atacado al ${currentEnemy.name} causando <span class="damage-dealt">${damage}</span> puntos de daño.`);
    
    // Actualizar la salud del enemigo en la pantalla
    const enemyHealth = document.querySelector('.enemy-health');
    if (enemyHealth) {
      enemyHealth.textContent = currentEnemy.health > 0 ? currentEnemy.health : 0;
    }
    
    // Verificar si el enemigo ha sido derrotado
    if (currentEnemy.health <= 0) {
      // Reproduce sonido de enemigo derrotado
      sounds.enemyDeath.play().catch(e => console.log('Error al reproducir sonido:', e));
      
      enemiesKilled++;
      playerDamage += 5; // Incrementar el daño del jugador por cada enemigo derrotado
      
      addToLog(`🎯 ¡Has derrotado al ${currentEnemy.name}! Tu poder de ataque ha aumentado.`);
      
      currentEnemy = null;
      elements.attackBtn.disabled = true;
      
      // Actualizar el número de enemigos derrotados en la pantalla
      updateStatus();
      
      // Mostrar mensaje de victoria en la pantalla principal
      const enemyEncounter = document.querySelector('.enemy-encounter');
      if (enemyEncounter) {
        enemyEncounter.innerHTML = `
          <h3>🏆 ¡Enemigo derrotado!</h3>
          <p>Has ganado la batalla y tu poder ha aumentado.</p>
        `;
      }
    } else {
      // El enemigo contraataca
      playerHealth -= currentEnemy.damage;
      
      // Animación de daño recibido
      document.body.classList.add('damage-flash');
      setTimeout(() => {
        document.body.classList.remove('damage-flash');
      }, 300);
      
      addToLog(`😱 El ${currentEnemy.name} te ha atacado causando <span class="damage-taken">${currentEnemy.damage}</span> puntos de daño.`);
      updateStatus();
    }
  }
  
  function searchRing() {
    if (ringFound) {
      addToLog("🔍 Ya has encontrado el Anillo Único. ¡Ahora debes derrotar a 5 enemigos!");
      return;
    }
    
    elements.searchBtn.disabled = true;
    
    if (Math.random() < currentLocation.ringChance) {
      // Reproduce sonido de anillo encontrado
      sounds.ringFound.play().catch(e => console.log('Error al reproducir sonido:', e));
      
      ringFound = true;
      addToLog("💍 ¡Has encontrado el Anillo Único! Su poder fluye a través de ti.");
      
      // Efecto visual para el hallazgo del anillo
      const ringAnimation = document.createElement('div');
      ringAnimation.className = 'ring-animation';
      elements.mainScreen.appendChild(ringAnimation);
      
      // Aumentar el daño del jugador como recompensa
      playerDamage += 20;
      
      // Mostrar mensaje en la pantalla
      elements.mainScreen.innerHTML += `
        <div class="ring-found-message">
          <h3>💍 ¡Has encontrado el Anillo Único!</h3>
          <p>Su poder fluye a través de ti, aumentando tu fuerza de ataque.</p>
        </div>
      `;
    } else {
      addToLog("🔍 Has buscado pero no has encontrado nada de valor...");
    }
    
    updateStatus();
  }
  
  function rest() {
    // Reproduce sonido de descanso
    sounds.rest.play().catch(e => console.log('Error al reproducir sonido:', e));
    
    const healthRestored = Math.floor(Math.random() * 100) + 50;
    playerHealth = Math.min(1000, playerHealth + healthRestored);
    
    elements.mainScreen.innerHTML = `
      <h2>🛌 Descansando</h2>
      <p>Has encontrado un lugar seguro para descansar y recuperarte.</p>
      <div class="rest-animation"></div>
      <p>Has recuperado <span class="health-restored">+${healthRestored}</span> puntos de salud.</p>
    `;
    
    addToLog(`🛌 Has descansado y recuperado <span class="health-restored">${healthRestored}</span> puntos de salud.`);
    
    currentEnemy = null;
    elements.attackBtn.disabled = true;
    elements.searchBtn.disabled = true;
    
    updateStatus();
  }
  
  function victory() {
    // Reproduce sonido de victoria
    sounds.victory.play().catch(e => console.log('Error al reproducir sonido:', e));
    
    elements.victoryScreen.style.display = 'flex';
    
    // Añadir confeti o efecto de celebración
    createConfetti();
  }
  
  function gameOver() {
    elements.mainScreen.innerHTML = `
      <h2>☠️ Game Over</h2>
      <p>Has caído en batalla. La oscuridad se cierne sobre la Tierra Media.</p>
      <button id="try-again-btn">🔄 Intentar de nuevo</button>
    `;
    
    document.getElementById('try-again-btn').addEventListener('click', resetGame);
    
    elements.exploreBtn.disabled = true;
    elements.attackBtn.disabled = true;
    elements.searchBtn.disabled = true;
    elements.restBtn.disabled = true;
    
    addToLog("☠️ Has sido derrotado. La Tierra Media está perdida...");
  }
  
  function resetGame() {
    playerHealth = 1000;
    enemiesKilled = 0;
    ringFound = false;
    currentEnemy = null;
    playerDamage = 50;
    
    elements.mainScreen.innerHTML = `
      <h2>🌄 ¡Bienvenido a la Tierra Media!</h2>
      <p>Tu misión es derrotar a 5 enemigos y encontrar el Anillo Único. 🌋 Explora diferentes localizaciones para completar tu misión.</p>
      <p>🕵️♂️ Haz clic en "Explorar" para comenzar tu aventura.</p>
    `;
    
    elements.gameLog.innerHTML = '<p>📜 La aventura está por comenzar...</p>';
    
    elements.exploreBtn.disabled = false;
    elements.attackBtn.disabled = true;
    elements.searchBtn.disabled = true;
    elements.restBtn.disabled = false;
    
    elements.victoryScreen.style.display = 'none';
    elements.mainScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    
    updateStatus();
  }
  
  function createConfetti() {
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 5 + 's';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 6000);
    }
  }
  
  elements.exploreBtn.addEventListener('click', explore);
  elements.attackBtn.addEventListener('click', attack);
  elements.searchBtn.addEventListener('click', searchRing);
  elements.restBtn.addEventListener('click', rest);
  elements.playAgainBtn.addEventListener('click', resetGame);
  
  updateStatus();
});