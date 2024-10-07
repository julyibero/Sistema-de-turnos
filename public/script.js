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
        
        const data = await response.json();
        
        let mensajeEspera;
        if (data.tiempoEspera === 0) {
            mensajeEspera = "Atención inmediata";
        } else {
            const tiempoEnMinutos = Math.ceil(data.tiempoEspera / 60000);
            mensajeEspera = `Tiempo estimado de espera: ${data.tiempoEspera} minutos`;
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
        document.getElementById('resultado').innerHTML = 'Hubo un error al procesar su solicitud.';
    }
});