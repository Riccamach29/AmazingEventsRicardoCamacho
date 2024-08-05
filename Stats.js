import { recorrerFechas } from './modules/funciones.js';

// Función para calcular el porcentaje de asistencia
function calcularPorcentajeAsistencia(evento) {
    if (evento.assistance) {
        return (evento.assistance / evento.capacity) * 100;
    } else if (evento.estimate) {
        return (evento.estimate / evento.capacity) * 100;
    }
    return 0;
}

// Función para calcular las ganancias y el porcentaje de asistencia por categoría
function calcularEstadisticasPorCategoria(eventos) {
    let gananciasPorCategoria = {};

    eventos.forEach(evento => {
        if (!gananciasPorCategoria[evento.category]) {
            gananciasPorCategoria[evento.category] = {
                ganancia: 0,
                totalAsistencia: 0,
                totalCapacidad: 0
            };
        }
        gananciasPorCategoria[evento.category].ganancia += evento.eventoGanancia;

        if (evento.assistance || evento.estimate) {
            let asistencia = evento.assistance ? evento.assistance : evento.estimate;
            gananciasPorCategoria[evento.category].totalAsistencia += asistencia;
            gananciasPorCategoria[evento.category].totalCapacidad += evento.capacity;
        }
    });

    return Object.entries(gananciasPorCategoria).map(([categoria, data]) => ({
        categoria,
        ganancia: data.ganancia,
        porcentajeAsistencia: data.totalCapacidad > 0 ? (data.totalAsistencia / data.totalCapacidad) * 100 : 0
    }));
}

// Función para encontrar el evento con el mayor porcentaje de asistencia
function obtenerEventoMayorPorcentaje(eventos) {
    return eventos.reduce((max, evento) => evento.porcentajeAsistencia > max.porcentajeAsistencia ? evento : max, eventos[0]);
}

// Función para encontrar el evento con el menor porcentaje de asistencia
function obtenerEventoMenorPorcentaje(eventos) {
    return eventos.reduce((min, evento) => evento.porcentajeAsistencia < min.porcentajeAsistencia ? evento : min, eventos[0]);
}

// Función para encontrar el evento con mayor capacidad
function obtenerEventoMayorCapacidad(eventos) {
    return eventos.reduce((max, evento) => evento.capacity > max.capacity ? evento : max, eventos[0]);
}

// Función para procesar y mostrar los datos
function procesarDatos(data) {
    const eventos = data.events;
    const fechaActual = data.currentDate;

    // Calcular el porcentaje de asistencia y las ganancias
    const eventosConGanancias = eventos.map(evento => {
        const porcentajeAsistencia = calcularPorcentajeAsistencia(evento);
        const eventoGanancia = evento.price * (evento.assistance || evento.estimate || 0);
        return { ...evento, porcentajeAsistencia, eventoGanancia };
    });

    // Dividir los eventos entre futuros y pasados
    const { eventosPasados, eventosFuturos } = recorrerFechas(eventosConGanancias, fechaActual);

    // Calcular estadísticas para eventos futuros y pasados
    const estadisticasFuturos = calcularEstadisticasPorCategoria(eventosFuturos);
    const estadisticasPasados = calcularEstadisticasPorCategoria(eventosPasados);

    // Obtener eventos con mayor y menor porcentaje de asistencia, y mayor capacidad
    const eventoMayorAsistencia = obtenerEventoMayorPorcentaje(eventosConGanancias);
    const eventoMenorAsistencia = obtenerEventoMenorPorcentaje(eventosConGanancias);
    const eventoMayorCapacidad = obtenerEventoMayorCapacidad(eventosConGanancias);

    // Asignar estos eventos a los elementos de la tabla
    document.getElementById('highest-assistance-event').innerText = eventoMayorAsistencia.name;
    document.getElementById('lowest-assistance-event').innerText = eventoMenorAsistencia.name;
    document.getElementById('largest-capacity-event').innerText = eventoMayorCapacidad.name;

    // Llenar la tabla de estadísticas de eventos futuros
    const tablaFuturos = document.getElementById('upcoming-events-stats');
    if (tablaFuturos) {
        estadisticasFuturos.forEach(stat => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${stat.categoria}</td>
                <td>$${stat.ganancia.toFixed(2)}</td>
                <td>${stat.porcentajeAsistencia.toFixed(2)}%</td>
            `;
            tablaFuturos.appendChild(fila);
        });
    }

    // Llenar la tabla de estadísticas de eventos pasados
    const tablaPasados = document.getElementById('past-events-stats');
    if (tablaPasados) {
        estadisticasPasados.forEach(stat => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${stat.categoria}</td>
                <td>$${stat.ganancia.toFixed(2)}</td>
                <td>${stat.porcentajeAsistencia.toFixed(2)}%</td>
            `;
            tablaPasados.appendChild(fila);
        });
    }
}

// Obtener datos de la API
fetch('https://aulamindhub.github.io/amazing-api/events.json')
    .then(response => response.json())
    .then(data => {
        procesarDatos(data);
    })
    .catch(error => console.error('Error al obtener los datos:', error));
