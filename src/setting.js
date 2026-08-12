let dataset = [];
let nextId = 0;

// 1. Daten asynchron vom Backend laden
async function init() {
  try {
    // Empfangene Daten von Electron (Backend)
    dataset = await window.cardAPI.loadCards();

    // Höchste ID ermitteln, damit neue Zeilen eindeutige IDs bekommen
    if (dataset && dataset.length > 0) {
      nextId = dataset.length
    }

    renderTable();
  } catch (error) {
    console.error("Fehler beim Laden der Cards:", error);
    showStatus("Fehler beim Laden der Daten!", true);
  }
}

// 2. Tabelle rendern
function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if (dataset.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Keine Einträge vorhanden.</td></tr>`;
    return;
  }

  dataset.forEach((row, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <!-- ID bleibt schreibgeschützt -->
          <td class="readonly" data-id="${index}">${index}</td>

          <td>
            <input type="text" class="input-firstName" value="${row.firstName || ""}">
          </td>
          <td>
            <input type="text" class="input-lastName" value="${row.lastName || ""}">
          </td>
          <td>
            <select class="input-lastState">
                <option value="red" ${row.lastState === "red" ? "selected" : ""}>red</option>
                <option value="yellow" ${row.lastState === "yellow" ? "selected" : ""}>yellow</option>
                <option value="green" ${row.lastState === "green" ? "selected" : ""}>green</option>
            </select>
          </td>

          <td>
            <button class="btn btn-danger" onclick="deleteRow(this)">Löschen</button>
          </td>
        `;

    tbody.appendChild(tr);
  });
}

// 3. Zeile im DOM hinzufügen
function addRow() {
  const tbody = document.getElementById("tableBody");

  // Falls die "Keine Einträge"-Meldung noch steht, vorher leeren
  if (tbody.querySelector("td[colspan]")) {
    tbody.innerHTML = "";
  }

  const tr = document.createElement("tr");

  tr.innerHTML = `
        <td class="readonly" data-id="${nextId}">${nextId++}</td>
        <td><input type="text" class="input-firstName" value=""></td>
        <td><input type="text" class="input-lastName" value=""></td>
        <td><select class="input-lastState">
                <option value="red" selected>red</option>
                <option value="yellow">yellow</option>
                <option value="green">green</option>
            </select></td>
        <td><button class="btn btn-danger" onclick="deleteRow(this)">Löschen</button></td>
      `;

  tbody.appendChild(tr);
}

// 4. Zeile löschen
function deleteRow(buttonElement) {
  const row = buttonElement.closest("tr");
  row.remove();
}

// 5. Tabelle auslesen und übers Backend speichern
async function saveDataset() {
  const rows = document.querySelectorAll("#tableBody tr");
  const updatedDataset = [];

  rows.forEach((tr) => {
    const idTd = tr.querySelector(".readonly");
    // Überspringe Platzhalter-Zeilen (z. B. "Lade Daten...")
    if (!idTd) return;

    const id = parseInt(idTd.getAttribute("data-id"));
    const firstName = tr.querySelector(".input-firstName").value;
    const lastName = tr.querySelector(".input-lastName").value;
    const lastState = tr.querySelector(".input-lastState").value || "red";

    updatedDataset.push({ id, firstName, lastName, lastState });
  });

  // Lokales Array aktualisieren
  dataset = updatedDataset;

  try {
    // Falls du eine Speichermethode in der Preload hast (z.B. saveCards):
    if (window.cardAPI.saveCards) {
      await window.cardAPI.saveCards(dataset);
    }

    showStatus("✓ Dataset erfolgreich gespeichert!");
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    showStatus("Fehler beim Speichern!", true);
  }
}

// Statusmeldung anzeigen
function showStatus(message, isError = false) {
  const status = document.getElementById("statusMessage");
  status.textContent = message;
  status.className = `status ${isError ? "error" : "success"}`;
  status.style.display = "block";
  setTimeout(() => (status.style.display = "none"), 3000);
}

// Beim Laden der Seite initialisieren
init();
