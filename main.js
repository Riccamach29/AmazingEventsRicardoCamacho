import * as modulos from "./modules/funciones.js";

const contenedorTarjetas = document.getElementById('cardContainer');
const checkboxContainer = document.getElementById('checkboxContainer');
const searchInput = document.querySelector('input[type="search"]');

fetch('https://aulamindhub.github.io/amazing-api/events.json')
    .then(response => response.json())
    .then(data => {
        const events = data.events;

        // Inicializar tarjetas y checkboxes
        modulos.ponerTarjetas(events, contenedorTarjetas);
        const categoriasUnicas = modulos.obtenerCategoriasUnicas(events);
        modulos.pintarCheckbox(categoriasUnicas, checkboxContainer);

        // Agregar eventos a los filtros
        checkboxContainer.addEventListener('change', () => {
            const textoBusqueda = searchInput.value.toLowerCase();
            const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]:checked');
            modulos.aplicarFiltros(events, contenedorTarjetas, textoBusqueda, checkboxes);
        });

        searchInput.addEventListener('input', () => {
            const textoBusqueda = searchInput.value.toLowerCase();
            const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]:checked');
            modulos.aplicarFiltros(events, contenedorTarjetas, textoBusqueda, checkboxes);
        });
        console.log();
    })
    .catch(error => console.error('Error fetching data:', error));




