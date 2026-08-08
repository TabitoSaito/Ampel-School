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
