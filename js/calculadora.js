function calcularAgua(techo, lluvia, tipoTecho) {
  const coeficiente = { lamina: 0.9, concreto: 0.7, teja: 0.8 };
  return techo * lluvia * coeficiente[tipoTecho];
}

document.getElementById("formulario").addEventListener("submit", function(e) {
  e.preventDefault();

  let techo = parseFloat(document.getElementById("area").value);
  let lluvia = parseFloat(document.getElementById("precipitacion").value);
  let tipoTecho = document.getElementById("material").value;
  let correo = document.getElementById("correo").value.trim();

  if (validarDatos(techo, lluvia, tipoTecho, correo)) {
    let aguaTotal = calcularAgua(techo, lluvia, tipoTecho);
    mostrarDatos(techo, lluvia, tipoTecho, aguaTotal, correo);
    guardarLocalStorage(techo, lluvia, tipoTecho, aguaTotal, correo);
  }
});

function mostrarDatos(techo, lluvia, tipoTecho, aguaTotal, correo) {
  let tinacos = aguaTotal / 1100;
  let ahorroPesos = (aguaTotal / 1000) * 15;
  let duchas = aguaTotal / 50;
  let riegos = aguaTotal / 10;
  let costo = 4000;
  let recuperacion = (costo / ahorroPesos).toFixed(1);

  let vasos = aguaTotal / 0.25;
  let lavadoras = aguaTotal / 150;
  let inodoros = aguaTotal / 6;
  let lavaplatos = aguaTotal / 12;
  let piscinas = aguaTotal / 50000;

  const nombreTecho = { lamina:"Lámina galvanizada", concreto:"Concreto", teja:"Teja" };

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `
    <h2>💦 RESULTADOS</h2>
    <p><strong>Área:</strong> ${techo} m²</p>
    <p><strong>Material:</strong> ${nombreTecho[tipoTecho]}</p>
    <p><strong>Lluvia anual:</strong> ${lluvia} mm</p>
    <hr>
    <p><strong>Agua captada:</strong> ${aguaTotal.toLocaleString()} L</p>
    <p><strong>Equivale a:</strong></p>
    <ul>
      <li>${tinacos.toFixed(0)} tinacos (1,100 L)</li>
      <li>${duchas.toFixed(0)} duchas</li>
      <li>${riegos.toFixed(0)} riegos</li>
      <li>${vasos.toFixed(0)} vasos de agua (250 ml)</li>
      <li>${lavadoras.toFixed(0)} lavadoras de ropa</li>
      <li>${inodoros.toFixed(0)} descargas de inodoro</li>
      <li>${lavaplatos.toFixed(0)} lavadas de platos</li>
      <li>${piscinas.toFixed(2)} piscinas pequeñas (50,000 L)</li>
    </ul>
    <hr>
    <p><strong>Ahorro anual estimado:</strong> $${ahorroPesos.toFixed(0)}</p>
    <p><strong>💡 Concejo de inversión:</strong> ${recuperacion} años</p>
    <hr>
    <p><strong>Correo registrado:</strong> ${correo}</p>
    <hr>
    <h3>Historial de cálculos:</h3>
    <div id="historial"></div>
    <button id="borrarHistorial">🗑 Borrar historial</button>
  `;
  resultado.style.display = "block";
  mostrarHistorial();
}

function validarDatos(techo, lluvia, tipoTecho, correo) {
  if (isNaN(techo) || techo < 1) { alert("Ingresa un valor válido para el Área del techo (mínimo 1)."); return false; }
  if (isNaN(lluvia) || lluvia < 1) { alert("Ingresa una cantidad válida para la precipitación anual (mínimo 1)."); return false; }
  if (!tipoTecho) { alert("Selecciona el tipo de material del techo."); return false; }
  if (!correo) { alert("Por favor, ingresa tu correo electrónico."); return false; }
  if (!correo.includes("@") || !correo.includes(".")) { alert("Ingresa un correo válido."); return false; }
  return true;
}

function guardarLocalStorage(techo, lluvia, tipoTecho, aguaTotal, correo) {
  const datos = { techo, lluvia, tipoTecho, aguaTotal, correo, fecha: new Date().toLocaleString() };
  let historial = JSON.parse(localStorage.getItem("historialAgua")) || [];
  historial.push(datos);
  localStorage.setItem("historialAgua", JSON.stringify(historial));
}

function mostrarHistorial() {
  const historialDiv = document.getElementById("historial");
  let historial = JSON.parse(localStorage.getItem("historialAgua")) || [];
  const btnBorrar = document.getElementById("borrarHistorial");

  if (historial.length === 0) {
    historialDiv.innerHTML = "<p>No hay cálculos guardados.</p>";
    if (btnBorrar) btnBorrar.style.display = "none";
    return;
  }

  if (btnBorrar) btnBorrar.style.display = "block";
  historialDiv.innerHTML = historial.map(item => `
    <div class="historial-item">
      <p><strong>Fecha:</strong> ${item.fecha}</p>
      <p><strong>Área:</strong> ${item.techo} m², <strong>Material:</strong> ${item.tipoTecho}, <strong>Lluvia:</strong> ${item.lluvia} mm</p>
      <p><strong>Agua captada:</strong> ${item.aguaTotal.toLocaleString()} L</p>
      <p><strong>Correo:</strong> ${item.correo}</p>
      <hr>
    </div>
  `).join("");

  if (btnBorrar) {
    btnBorrar.onclick = () => {
      if (confirm("¿Deseas borrar todo el historial?")) {
        localStorage.removeItem("historialAgua");
        mostrarHistorial();
      }
    }
  }
}

window.addEventListener("load", mostrarHistorial);
