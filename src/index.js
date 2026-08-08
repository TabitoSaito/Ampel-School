/* -------------------- Card Generator -------------------- */

var cardWidth = 0;
var cardHeight = 0;

window.addEventListener("DOMContentLoaded", async () => {
  // Aufruf der Brücken-Funktion aus preload.js
  const savedCards = await window.cardAPI.loadCards();

  const gridContainer = document.querySelector('.grid-container')

  if (savedCards.length < 1) {
    const h1 = document.createElement('h1');
    h1.textContent = 'Noch keine Ampeln Vorhanden!';
    gridContainer.appendChild(h1);
    return
  } else {
    savedCards.forEach(card => {
      const cardHTML = `
      <div class="card-scaler">
      <div class="card">
        <div class="card-left">
          <div class="traffic-light" id="traffic-light-${card.id}">
            <div
              class="light red ${card.lastState == "red" ? "active" : ""}"
              onclick="switchLight('red', 'traffic-light-${card.id}')"
            ></div>
            <div
              class="light yellow ${card.lastState == "yellow" ? "active" : ""}"
              onclick="switchLight('yellow', 'traffic-light-${card.id}')"
            ></div>
            <div
              class="light green ${card.lastState == "green" ? "active" : ""}"
              onclick="switchLight('green', 'traffic-light-${card.id}')"
            ></div>
          </div>
        </div>
        <div class="card-right">
          <span>${card.firstName}</span>
          <span>${card.lastName}</span>
        </div>
      </div>
    </div>
      `;
    gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
  }

  const cardElements = document.querySelectorAll('.card-scaler');
  cardElements.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.width > cardWidth) {
      cardWidth = rect.width;
    }
    if (rect.height > cardHeight) {
      cardHeight = rect.height;
    }
  });
  cardElements.forEach(card => {
    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;
    card.querySelector(".card").style.width = `${cardWidth}px`;
    card.querySelector(".card").style.height = `${cardHeight}px`;
  });
  fitCards()
});

/* -------------------- Ampeln -------------------- */

async function switchLight(color, id) {
  var traffic_light = document.querySelector(`#${id}`);
  traffic_light.querySelectorAll(".light").forEach((light) => {
    light.classList.remove("active");
  });

  traffic_light.querySelector(`.light.${color}`).classList.add("active");

  try {
    const result = await window.cardAPI.updateLightColor(id, color);
  } catch (err) {
    console.error("Fehler beim Speichern im Store:", err);
  }
}

/* -------------------- Card Scaler -------------------- */

function fitCards() {
  const container = document.querySelector(".grid-container");
  const scalers = document.querySelectorAll(".card-scaler");
  const count = scalers.length;

  if (count === 0) return;

  // Verfügbarer Platz
  const containerWidth = container.clientWidth - 40; // abzüglich Padding
  const containerHeight = container.clientHeight - 40;

  // Optimales Rasterberechnen (Spalten x Zeilen)
  let bestScale = 1;

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);

    // Wie viel Scale passt in die Breite / Höhe?
    const scaleX = containerWidth / cols / cardWidth;
    const scaleY = containerHeight / rows / cardHeight;

    const currentScale = Math.min(scaleX, scaleY);

    if (currentScale > bestScale || cols === 1) {
      bestScale = currentScale;
    }
  }

  // Maximal 1 (Originalgröße), sonst kleiner machen
  const finalScale = Math.min(bestScale * 0.85, 1); // 0.85 für etwas Abstand/Gap

  // CSS Variable auf allen Scalern setzen
  scalers.forEach((scaler) => {
    scaler.style.setProperty("--scale", finalScale);
  });
}

// Beim Laden und bei Fenster-Resizing ausführen
window.addEventListener("resize", fitCards);
