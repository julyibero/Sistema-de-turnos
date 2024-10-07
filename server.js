const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const tiempoPorTurno = 10; // minutos
const numAsesores = 5;

let turnoActual = 0;
let asesores = Array(numAsesores).fill(null); // null significa asesor libre
let cola = [];

function log(mensaje) {
    console.log(`[${new Date().toISOString()}] ${mensaje}`);
}

function calcularTiempoEspera() {
    const asesoresOcupados = asesores.filter(a => a !== null).length;
    log(`Asesores ocupados: ${asesoresOcupados}`);
    if (asesoresOcupados < numAsesores) {
        log('Hay asesores libres, atención inmediata');
        return 0;
    } else{
        log('No hay asesores libres, atención en: ');
    }
    
    const tiempoMinimo = Math.min(...asesoresOcupados);
    const tiempoEspera = Math.max(0, tiempoMinimo - Date.now());
    log(`Tiempo mínimo de espera calculado: ${tiempoEspera} ms`);
    return tiempoEspera;
}

function asignarTurno() {
    const asesorLibre = asesores.findIndex(a => a === null);
    log(`Buscando asesor libre. Resultado: ${asesorLibre}`);
    if (asesorLibre !== -1) {
        asesores[asesorLibre] = Date.now() + tiempoPorTurno * 60000;
        log(`Asignado al asesor ${asesorLibre}. Terminará en: ${new Date(asesores[asesorLibre]).toISOString()}`);
        return 0;
    } else {
        const tiempoEspera = calcularTiempoEspera();
        log(`Todos los asesores ocupados. Tiempo de espera: ${tiempoEspera} ms`);
        return tiempoEspera;
    }

let mensajeEspera = data.tiempoEspera !== undefined ? 
`Tiempo estimado de espera: ${data.tiempoEspera} minutos` : 
"Hubo un problema con la asignación del turno.";

}

function actualizarAsesores() {
    const ahora = Date.now();
    log('Actualizando estado de asesores');
    asesores = asesores.map((a, index) => {
        if (a && a <= ahora) {
            log(`Asesor ${index} ahora está libre`);
            return null;
        }
        return a;
    });
    
    log(`Estado de la cola: ${cola.length} en espera`);
    while (cola.length > 0 && asesores.includes(null)) {
        const siguiente = cola.shift();
        log(`Procesando siguiente en cola: Turno ${siguiente.turno}`);
        const tiempoEspera = asignarTurno();
        siguiente.callback(tiempoEspera);
    }
}

setInterval(actualizarAsesores, 1000);

app.post('/solicitar-turno', (req, res) => {
    try {
        const { nombre, identificacion } = req.body;
        turnoActual++;
        log(`Nueva solicitud de turno: ${turnoActual} - Nombre: ${nombre}, ID: ${identificacion}`);
        
        const procesarSolicitud = (tiempoEspera) => {
            log(`Procesando solicitud para turno ${turnoActual}. Tiempo de espera: ${tiempoEspera} ms`);
            res.json({
                turno: turnoActual,
                nombre,
                identificacion,
                tiempoEspera: Math.ceil(tiempoEspera / 60000)
            });
        };
        
        const tiempoEspera = asignarTurno();
        if (tiempoEspera === 0) {
            log(`Atención inmediata para turno ${turnoActual}`);
            procesarSolicitud(0);
        } else {
            log(`Añadiendo turno ${turnoActual} a la cola. Tiempo estimado: ${tiempoEspera} ms`);
            cola.push({ turno: turnoActual, callback: procesarSolicitud });
        }
    } catch (error) {
        log(`Error en la solicitud de turno: ${error.message}`);
        res.status(500).json({ error: 'Error al procesar la solicitud de turno' });
    }
});

app.get('/estado', (req, res) => {
    log('Solicitud de estado del sistema');
    res.json({
        turnoActual,
        asesores: asesores.map(a => a ? 'ocupado' : 'libre'),
        colaLength: cola.length
    });

});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
