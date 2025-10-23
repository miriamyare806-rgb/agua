const map = L.map('map').setView([19.285, -99.736], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const statusEl = document.getElementById('status');
const metaEl = document.getElementById('meta');
const zoneListEl = document.getElementById('zoneList');

const zonas = [
  {
    nombre: "Museo Virreinal de Zinacantepec",
    coords: [19.2831, -99.7349],
    descripcion: "La zona cercana al museo presenta servicio intermitente de agua, con cortes ocasionales que se atienden mediante pipas municipales.",
    tipo: "Museo"
},

  {
    nombre: "San Luis Mextepec",
    coords: [19.2985, -99.7351],
    descripcion: "Comunidad con escasez frecuente de agua; muchas familias dependen de pipas, especialmente durante los meses de estiaje.",
    tipo: "Comunidad"
  },
  {
  nombre: "San Cristóbal Tecolit",
  coords: [19.2719, -99.7478],
  descripcion: "Comunidad que suele presentar cortes prolongados de servicio.",
  tipo: "Comunidad"
  },
  {
    nombre: "San Juan de las Huertas",
    coords: [19.2464, -99.7606],
    descripcion: "El suministro de agua es irregular; en épocas secas muchas viviendas se quedan sin servicio por varios días consecutivos.",
    tipo: "Comunidad"
  },
  {
    nombre: "Santa María del Monte",
    coords: [19.28705, -99.82689],
    descripcion: "Comunidad con alta marginación y graves problemas de escasez; gran parte de los hogares depende del reparto de agua por pipas.",
    tipo: "Comunidad"
  },
  {
    nombre: "San Antonio Acahualco",
    coords: [19.27667, -99.77361],
    descripcion: "Frecuentes problemas de abasto; el suministro llega con baja presión y los vecinos dependen del llenado por pipas varias veces al mes.",
    tipo: "Comunidad"
  },
  {
    nombre: "San Miguel Zinacantepec (Cabecera Municipal)",
    coords: [19.285, -99.735],
    descripcion: "Aunque cuenta con red de distribución, la cabecera municipal también enfrenta cortes periódicos y apoyo con pipas en zonas altas.",
    tipo: "Cabecera municipal"
  }
];

zonas.forEach((zona, i) => {
  const marker = L.marker(zona.coords).addTo(map);
  marker.bindPopup(`<b>${zona.nombre}</b><br>${zona.tipo}`);

  marker.on('mouseover', function() {
    this.openPopup();
    this._icon.classList.add('marker-hover');
  });
  
  marker.on('mouseout', function() {
    this.closePopup();
    this._icon.classList.remove('marker-hover');
  });

  marker.on('click', function() {
    mostrarInfoZona(zona);
  });

  const li = document.createElement('div');
  li.className = 'zone-item';
  li.textContent = zona.nombre;
  li.onclick = () => {
    map.setView(zona.coords, 15);
    marker.openPopup();
    mostrarInfoZona(zona);
  };
  zoneListEl.appendChild(li);
});

function mostrarInfoZona(zona) {
  metaEl.innerHTML = `
    <p><strong>Nombre:</strong> ${zona.nombre}</p>
    <p><strong>Tipo:</strong> ${zona.tipo}</p>
    <p>${zona.descripcion}</p>
    <button id="ocultarBtn" class="btn-ocultar">Ocultar información</button>
  `;

  const btn = document.getElementById('ocultarBtn');
  btn.onclick = () => metaEl.innerHTML = "";
}

async function cargarMunicipio(nombre) {
  try {
    statusEl.textContent = 'Cargando límites del municipio...';
    const q = encodeURIComponent(nombre + ', México');
    const url = `https://nominatim.openstreetmap.org/search.php?q=${q}&format=jsonv2&polygon_geojson=1&accept-language=es`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data[0]) {
      statusEl.textContent = 'No se encontró el municipio.';
      return;
    }

    const item = data[0];
    const geoLayer = L.geoJSON(item.geojson, {
      style: defaultStyle,
      onEachFeature: (feature, layer) => {
        layer.on('mouseover', () => layer.setStyle(highlightStyle));
        layer.on('mouseout', () => geoLayer.resetStyle(layer));
        layer.on('click', () => map.fitBounds(layer.getBounds()));
      }
    }).addTo(map);

    map.fitBounds(geoLayer.getBounds());
    statusEl.textContent = `Límites de ${item.display_name.split(',')[0]} cargados.`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Error al cargar datos del municipio.';
  }
}

cargarMunicipio('Zinacantepec, Estado de México');

statusEl.textContent = "Mapa interactivo cargado correctamente.";
