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
    nombre: "Centro de Zinacantepec",
    coords: [19.285, -99.735],
    descripcion: "Zona central donde se ubica el Palacio Municipal y la Parroquia de San Miguel Arcángel.",
    tipo: "Centro histórico"
  },
  {
    nombre: "Museo Virreinal de Zinacantepec",
    coords: [19.2933, -99.7291],
    descripcion: "Antiguo convento franciscano del siglo XVI con arte y arquitectura colonial.",
    tipo: "Museo"
  },
  {
    nombre: "San Luis Mextepec",
    coords: [19.2985, -99.7351],
    descripcion: "Una de las comunidades más pobladas y con reportes frecuentes de desabasto, especialmente en temporada de estiaje.",
    tipo: "Comunidad"
  },
  {
    nombre: "San Cristóbal Tecolit",
    coords: [19.2667, -99.7457],
    descripcion: "Comunidad que suele presentar cortes prolongados de servicio.",
    tipo: "Comunidad"
  },
  {
    nombre: "San Juan de las Huertas",
    coords: [19.2464, -99.7606],
    descripcion: "El crecimiento desordenado ha superado la capacidad de la infraestructura hídrica.",
    tipo: "Comunidad"
  },
  {
    nombre: "Santa María del Monte",
    coords: [19.28705, -99.82689],
    descripcion: "Comunidad con alta marginación y dificultades para acceder a agua entubada de calidad.",
    tipo: "Comunidad"
  },
  {
    nombre: "San Antonio Acahualco",
    coords: [19.27667, -99.77361],
    descripcion: "Comunidad que experimenta problemas recurrentes en el abastecimiento.",
    tipo: "Comunidad"
  },
  
  {
    nombre: "San Miguel Zinacantepec (Cabecera Municipal)",
    coords: [19.2905, -99.7288],
    descripcion: "La cabecera municipal de Zinacantepec, donde también se registran problemas recurrentes en el suministro de agua.",
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