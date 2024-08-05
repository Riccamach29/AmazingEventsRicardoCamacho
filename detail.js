document.addEventListener('DOMContentLoaded', () => {
  // Función para obtener parámetros de la URL
  function obtenerParametroUrl(nombre) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(nombre);
  }

  // Obtener el ID del evento de los parámetros de la URL
  const eventoId = obtenerParametroUrl('id');
  console.log(eventoId);
  

  if (eventoId) {
      // Fetch para obtener los datos de la API
      fetch('https://aulamindhub.github.io/amazing-api/events.json')
          .then(response => response.json())
          .then(data => {
              // Buscar el evento en el array data.events
              const eventoDetails = data.events.find(evento => evento._id == eventoId);
              console.log(eventoDetails);
              

              if (eventoDetails) {
                  // Pintar la tarjeta con la información del evento
                  const contenedorDetalle = document.getElementById('detalleEvento');
                  const detalleTarjeta = `
                  <div class="col-md-6 text-center">
                        ${eventoDetails.image ? `<img src="${eventoDetails.image}" alt="${eventoDetails.name}" class="img-tarjeta">` : ''}
                  </div>
                  <div class="col-md-6">
                      <ul class="list-group">
                          ${eventoDetails.date ? `<li class="list-group-item"><strong>Date:</strong> ${eventoDetails.date}</li>` : ''}
                          ${eventoDetails.description ? `<li class="list-group-item"><strong>Description:</strong> ${eventoDetails.description}</li>` : ''}
                          ${eventoDetails.category ? `<li class="list-group-item"><strong>Category:</strong> ${eventoDetails.category}</li>` : ''}
                          ${eventoDetails.place ? `<li class="list-group-item"><strong>Place:</strong> ${eventoDetails.place}</li>` : ''}
                          ${eventoDetails.capacity ? `<li class="list-group-item"><strong>Capacity:</strong> ${eventoDetails.capacity}</li>` : ''}
                          ${eventoDetails.assistance ? `<li class="list-group-item"><strong>Assistance:</strong> ${eventoDetails.assistance}</li>` : ''}
                          ${eventoDetails.price ? `<li class="list-group-item"><strong>Price:</strong> ${eventoDetails.price}</li>` : ''}
                      </ul>
                  </div>
                  `;
                  contenedorDetalle.innerHTML = detalleTarjeta;
              } else {
                  // Mostrar un mensaje si no se encuentra el evento
                  const contenedorDetalle = document.getElementById('detalleEvento');
                  contenedorDetalle.innerHTML = '<p>No se encontraron detalles del evento.</p>';
              }
          })
          .catch(error => {
              console.error('Error al obtener los datos:', error);
              const contenedorDetalle = document.getElementById('detalleEvento');
              contenedorDetalle.innerHTML = '<p>Error al cargar la información del evento.</p>';
          });
  } else {
      // Mostrar un mensaje si no hay ID en la URL
      const contenedorDetalle = document.getElementById('detalleEvento');
      contenedorDetalle.innerHTML = '<p>No se proporcionó un ID de evento.</p>';
  }
});
