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
    if (asesoresOcupados.length < numAsesores) {
        log('Hay asesores libres, atención inmediata');
        return 0;
    }
    
    const tiempoMinimo = Math.min(...asesoresOcupados);
    log(`Tiempo mínimo de espera calculado: ${tiempoMinimo} ms`);
    return Math.max(0, tiempoMinimo - Date.now());
}

function asignarTurno() {
    const asesorLibre = asesores.findIndex(a => a === null);
    log(`Buscando asesor libre. Resultado: ${asesorLibre}`);
    if (asesorLibre !== -1) {
        asesores[asesorLibre] = Date.now() + tiempoPorTurno * 60000;
        log(`Asignado al asesor ${asesorLibre + 1}. Terminará en: ${new Date(asesores[asesorLibre]).toISOString()}`);
        return asesorLibre;
    }
    return -1;
}

function actualizarAsesores() {
    const ahora = Date.now();
    log('Actualizando estado de asesores');
    asesores = asesores.map((a, index) => {
        if (a && a <= ahora) {
            log(`Asesor ${index + 1} ahora está libre`);
            return null;
        }
        return a;
    });
    
    log(`Estado de la cola: ${cola.length} en espera`);
    while (cola.length > 0 && asesores.includes(null)) {
        const siguiente = cola.shift();
        const asesorAsignado = asignarTurno();
        if (asesorAsignado !== -1) {
            log(`Procesando turno ${siguiente.turno} de la cola`);
            siguiente.res.json({
                turno: siguiente.turno,
                nombre: siguiente.nombre,
                identificacion: siguiente.identificacion,
                tiempoEspera: 0,
                enCola: false,
                asesor: asesorAsignado + 1
            });
        } else {
            cola.unshift(siguiente);
            break;
        }
    }
}

setInterval(actualizarAsesores, 1000);

app.post('/solicitar-turno', (req, res) => {
    try {
        const { nombre, identificacion } = req.body;
        turnoActual++;
        log(`Nueva solicitud de turno: ${turnoActual} - Nombre: ${nombre}, ID: ${identificacion}`);
        
        const asesorAsignado = asignarTurno();
        if (asesorAsignado !== -1) {
            log(`Atención inmediata para turno ${turnoActual}`);
            res.json({
                turno: turnoActual,
                nombre,
                identificacion,
                tiempoEspera: 0,
                enCola: false,
                asesor: asesorAsignado + 1
            });
        } else {
            const tiempoEspera = calcularTiempoEspera();
            log(`Añadiendo turno ${turnoActual} a la cola. Tiempo estimado: ${Math.ceil(tiempoEspera / 60000)} minutos`);
            res.json({
                turno: turnoActual,
                nombre,
                identificacion,
                tiempoEspera: Math.ceil(tiempoEspera / 60000),
                enCola: true,
                posicionCola: cola.length + 1
            });
            cola.push({ turno: turnoActual, nombre, identificacion, res });
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
    console.log(`Servidor corriendo en http://localhost:${port}`);
});