document.getElementById('turnoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const identificacion = document.getElementById('identificacion').value;
    
    try {
        const response = await fetch('/solicitar-turno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, identificacion }),
        });
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        
        const data = await response.json();
        
        let mensajeEspera;
        if (data.enCola) {
            mensajeEspera = `En cola. Posición: ${data.posicionCola}. Tiempo estimado de espera: ${data.tiempoEspera} minutos`;
        } else {
            mensajeEspera = `Atención inmediata`;
        }
        
        document.getElementById('resultado').innerHTML = `
            <p>Turno asignado: ${data.turno}</p>
            <p>Nombre: ${data.nombre}</p>
            <p>Identificación: ${data.identificacion}</p>
            <p>${mensajeEspera}</p>
        `;
        
        this.reset();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('resultado').innerHTML = 'Hubo un error al procesar su solicitud. Por favor, intente nuevamente.';
    }
});

async function actualizarEstado() {
    try {
        const response = await fetch('/estado');
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        const data = await response.json();
        document.getElementById('estadoSistema').innerHTML = `
            <p>Turno actual: ${data.turnoActual}</p>
            <p>Asesores: ${data.asesores.map((a, i) => `Asesor ${i + 1}: ${a}`).join(', ')}</p>
            <p>En cola: ${data.colaLength}</p>
        `;
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        document.getElementById('estadoSistema').innerHTML = 'Error al obtener el estado del sistema';
    }
}

// Actualizar el estado cada 5 segundos
setInterval(actualizarEstado, 5000);
