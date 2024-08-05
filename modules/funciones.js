// Función para poner tarjetas en el contenedor
export function ponerTarjetas(array, contenedorTarjetas) {
    contenedorTarjetas.innerHTML = '';

    if (array.length === 0) {
        contenedorTarjetas.innerHTML = `
            <div class="col-12 text-center">
                <p class="h5">No se encontraron eventos que coincidan con los filtros aplicados.</p>
            </div>
        `;
        return;
    }

    for (let i = 0; i < array.length; i++) {
        const evento = array[i];

        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.className = 'col tarjeta mb-4';
        nuevaTarjeta.innerHTML = `
            <div class="card h-100">
                <img src="${evento.image}" class="card-img-top" alt="${evento.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${evento.name}</h5>
                    <p class="card-text">${evento.description}</p>
                    <div class="mt-auto d-flex justify-content-around align-items-center">
                        <h3 class="text-success mb-0">$${evento.price}</h3>
                        <a id="details-${evento._id}" href="./details.html?id=${evento._id}" class="btn btn-primary">Detalles</a>
                    </div>
                </div>
            </div>
        `;
        contenedorTarjetas.appendChild(nuevaTarjeta);
    }
}
//Funcion que separa 2 array en eventos futuros y eventos pasados
export function recorrerFechas(array, fechaActual) {
    const eventosPasados = [];
    const eventosFuturos = [];
  
    for (let i = 0; i < array.length; i++) {
        const fechaUno = array[i].date;
        if (fechaActual < fechaUno) {
            eventosFuturos.push(array[i]);
        } else {
            eventosPasados.push(array[i]);
        }
    }
  
    return { eventosPasados, eventosFuturos };
  }

// Función para obtener categorías únicas de un array de eventos
export function obtenerCategoriasUnicas(array) {
    const categoriasUnicas = new Set();
    array.forEach(event => {
        if (event.category) {
            categoriasUnicas.add(event.category);
        }
    });
    return Array.from(categoriasUnicas);
}

// Función para pintar checkboxes de categorías
export function pintarCheckbox(array, checkboxContainer) {
    checkboxContainer.innerHTML = '';
    array.forEach((categoria, index) => {
        const newCheckbox = document.createElement('div');
        newCheckbox.className = 'form-check';
        newCheckbox.innerHTML = `
            <input class="form-check-input" type="checkbox" id="check${index}" value="${categoria}">
            <label class="form-check-label" for="check${index}">${categoria}</label>
        `;
        checkboxContainer.appendChild(newCheckbox);
    });
}

// Función para filtrar eventos por categorías seleccionadas 
export function filtrarPorCategorias(array, checkboxes) {
    const categoriasSeleccionadas = Array.from(checkboxes).map(checkbox => checkbox.value);
    return array.filter(event => categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(event.category));
}


// Función para filtrar eventos por texto de búsqueda
export function filtrarPorBusqueda(array, textoBusqueda) {
    textoBusqueda = textoBusqueda.toLowerCase();
    return array.filter(evento => 
        evento.name.toLowerCase().includes(textoBusqueda) ||
        evento.description.toLowerCase().includes(textoBusqueda)
    );
}

// Función para aplicar filtros y actualizar tarjetas
export function aplicarFiltros(events, contenedorTarjetas, textoBusqueda, checkboxes) {
    let eventosFiltrados = filtrarPorCategorias(events, checkboxes);
    eventosFiltrados = filtrarPorBusqueda(eventosFiltrados, textoBusqueda);
    ponerTarjetas(eventosFiltrados, contenedorTarjetas);
}
