/* -------------------- Ampeln -------------------- */

function switchLight(color, id) {
  // Entferne 'active' von allen Lichtern
  var traffic_light = document.querySelector(`#${id}`)
  traffic_light.querySelectorAll(".light").forEach((light) => {
    light.classList.remove("active");
  });

  // Füge 'active' dem angeklickten Licht hinzu
  traffic_light.querySelector(`.light.${color}`).classList.add("active");
}

/* -------------------- Card Scaler -------------------- */

function fitCards() {
  const container = document.querySelector('.grid-container');
  const scalers = document.querySelectorAll('.card-scaler');
  const count = scalers.length;

  console.log(document.querySelectorAll('.card-scaler')[0].getBoundingClientRect())

  if (count === 0) return;

  // Verfügbarer Platz
  const containerWidth = container.clientWidth - 40; // abzüglich Padding
  const containerHeight = container.clientHeight - 40;

  // Unskalierte Original-Breite/Höhe einer Karte (ca. 420px x 120px)
  const cardWidth = 478;
  const cardHeight = 290;

  // Optimales Rasterberechnen (Spalten x Zeilen)
  let bestScale = 1;

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    
    // Wie viel Scale passt in die Breite / Höhe?
    const scaleX = (containerWidth / cols) / cardWidth;
    const scaleY = (containerHeight / rows) / cardHeight;
    
    const currentScale = Math.min(scaleX, scaleY);
    
    if (currentScale > bestScale || cols === 1) {
      bestScale = currentScale;
    }
  }

  // Maximal 1 (Originalgröße), sonst kleiner machen
  const finalScale = Math.min(bestScale * 0.85, 1); // 0.85 für etwas Abstand/Gap

  // CSS Variable auf allen Scalern setzen
  scalers.forEach(scaler => {
    scaler.style.setProperty('--scale', finalScale);
  });
}

// Beim Laden und bei Fenster-Resizing ausführen
window.addEventListener('resize', fitCards);

