document.addEventListener('DOMContentLoaded', function() {
    let playerHealth = 1000;
    let enemiesKilled = 0;
    let ringFound = false;
    let currentEnemy = null;
    let currentLocation = null;
  
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
      playAgainBtn: document.getElementById('play-again-btn')
    };
  
    const enemies = [
      { name: 'Orco 👹', health: 100, damage: 30, image: '/api/placeholder/100/100' },
      { name: 'Uruk-hai 🧌', health: 150, damage: 40, image: '/api/placeholder/100/100' },
      { name: 'Nazgûl 🧟♂️', health: 200, damage: 60, image: '/api/placeholder/100/100' },
      { name: 'Araña Gigante 🕷️', health: 120, damage: 35, image: '/api/placeholder/100/100' },
      { name: 'Troll de las Cavernas 👾', health: 250, damage: 50, image: '/api/placeholder/100/100' }
    ];
  
    const locations = [
      { name: 'Bosque Negro 🌳', description: 'Un bosque oscuro y peligroso, hogar de arañas gigantes y otros peligros.', image: '/api/placeholder/100/100', enemyChance: 0.7, ringChance: 0.1 },
      { name: 'Montañas Nubladas ⛰️', description: 'Montañas altas y traicioneras donde los goblins acechan.', image: '/api/placeholder/100/100', enemyChance: 0.6, ringChance: 0.15 },
      { name: 'Mordor 🌋', description: 'La tierra oscura dominada por Sauron.', image: '/api/placeholder/100/100', enemyChance: 0.9, ringChance: 0.2 },
      { name: 'Rivendell 🏞️', description: 'El último hogar acogedor al este del mar.', image: '/api/placeholder/100/100', enemyChance: 0.3, ringChance: 0.1 },
      { name: 'Minas de Moria ⚒️', description: 'Un laberinto de túneles antiguos bajo las montañas.', image: '/api/placeholder/100/100', enemyChance: 0.8, ringChance: 0.25 }
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
      
      if (enemiesKilled >= 5 && ringFound) victory();
    }
  
    function explore() {
      currentEnemy = null;
      elements.attackBtn.disabled = true;
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      elements.mainScreen.innerHTML = `
        <h2>${location.name}</h2>
        <div class="location-image" style="background-image: url('${location.image}')"></div>
        <p>${location.description}</p>
      `;
      
      addToLog(`🗺️ Has llegado a: <strong>${location.name}</strong>`);
      elements.searchBtn.disabled = false;
  
      if (Math.random() < location.enemyChance) {
        const enemy = JSON.parse(JSON.stringify(enemies[Math.floor(Math.random() * enemies.length)]);
        
        elements.mainScreen.innerHTML += `
          <div class="enemy-encounter">
            <h3>⚠️ ¡Has encontrado un enemigo!</h3>
            <div class="enemy-avatar" style="background-image: url('${enemy.image}')"></div>
            <p>Un <span class="enemy">${enemy.name}</span> te ataca. ❤️ Salud: ${enemy.health}</p>
          </div>
        `;
        
        addToLog(`⚔️ ¡Un <span class="enemy">${enemy.name}</span> te ha encontrado!`);
        elements.attackBtn.disabled = false;
        currentEnemy = enemy;
      }
    }
  
    // Resto de funciones (attack, searchRing, rest, victory, gameOver, resetGame) 
    // mantienen la misma lógica pero con emojis añadidos en los mensajes
    
    elements.exploreBtn.addEventListener('click', explore);
    elements.attackBtn.addEventListener('click', attack);
    elements.searchBtn.addEventListener('click', searchRing);
    elements.restBtn.addEventListener('click', rest);
    elements.playAgainBtn.addEventListener('click', resetGame);
    updateStatus();
  });