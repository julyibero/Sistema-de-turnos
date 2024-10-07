# Actividad utilizando estructura enfocada en Cliente
# Proyecto Sistema de Gestión de Turnos
## Descripción
Este proyecto es una aplicación web sencilla para la gestión de turnos en una entidad concurrida. Utiliza HTML5, CSS y JavaScript para crear una interfaz fácil de usar donde los clientes pueden solicitar un turno y recibir un tiempo estimado de espera. La lógica del sistema considera la disponibilidad de asesores para ofrecer una estimación precisa del tiempo de atención.

## Instalación

1. Asegúrase de tener Node.js instalado
2. Clone este repositorio
3. Ejecute `npm install` para instalar las dependencias
4. Ejecute `npm start` para iniciar el servidor

El servidor estará disponible en `http://localhost:3000`

## Explicación del Código y Su Operación

### HTML y CSS:

- **HTML5**: Se utiliza para estructurar la página web, proporcionando los campos de formulario necesarios para que los clientes ingresen su nombre e identificación.
- **Tailwind CSS**: La página utiliza un diseño moderno y responsivo gracias a esta librería CSS, aplicada a través de CDN.
- **Formulario**: Contiene campos para que el cliente ingrese su nombre e identificación, esenciales para la asignación de turnos.

### JavaScript:

- **Manejo del formulario**: Usamos un `event listener` para gestionar el envío del formulario.
- **Cálculo del turno**: Cuando se envía el formulario, se incrementa un contador para asignar un número de turno al cliente.
- **Tiempo estimado de espera**: El tiempo se calcula basado en la cantidad de asesores disponibles y los turnos anteriores.
- **Interfaz dinámica**: La información del turno asignado y el tiempo estimado de espera se muestra dinámicamente en la página.

  ### Estructura del Proyecto:
```
sistema-de-turnos/
├── package.json
├── server.js
└── public/
    └── index.html
    └── script.js
    └── styles.css
```

### Lógica de Negocio:

- **Incremento de turnos**: Cada nuevo turno incrementa un contador, que garantiza que cada cliente reciba un turno único.
- **Estado de los asesores**: Utilizamos un array asesores para representar el estado de cada asesor, null significa que el asesor está libre. Un valor numérico representa el tiempo (en milisegundos) en que el asesor terminará su atención actual.
- **Cola de espera**: Implementamos una estructura de datos tipo cola (cola) para manejar los turnos cuando todos los asesores están ocupados.
- **Cálculo del tiempo de espera**: Se estima que cada turno dura 10 minutos, con 5 asesores disponibles. El tiempo de espera se calcula según estos parámetros. La función calcularTiempoEspera() determina el tiempo mínimo de espera basado en cuándo estará disponible el próximo asesor. Si hay asesores libres, el tiempo de espera es 0 (atención inmediata).
- **Asignación de turnos**: asignarTurno() intenta asignar un turno a un asesor libre. Si todos están ocupados, calcula el tiempo de espera.
- **Actualización periódica**: actualizarAsesores() se ejecuta cada segundo para actualizar el estado de los asesores y procesar la cola si hay asesores disponibles.
- **Manejo de solicitudes**: Cuando llega una nueva solicitud, se intenta asignar inmediatamente.
Si no es posible la atención inmediata, se añade a la cola.
- **Respuesta al cliente**: El cliente recibe información sobre su turno y el tiempo estimado de espera.
Si el tiempo de espera es 0, se indica "Atención inmediata".

## Montaje y Herramientas Utilizadas

### Herramientas Sugeridas:

- **Editor de código**: Puede usar cualquier editor de texto como Visual Studio Code, Sublime Text, o Notepad++.
- **Navegador web**: Para visualizar y probar la aplicación (Chrome, Firefox, etc.).
- **Servidor web local**: Se puede usar una extensión como "Live Server" en Visual Studio Code o simplemente abrir el archivo HTML directamente en el navegador.
- **Control de versiones**: Se recomienda usar Git para el control de versiones del código, lo cual facilita el manejo de cambios y colaboraciones.

No se requieren herramientas adicionales ya que estamos usando **Tailwind CSS** a través de un CDN.

## Objetivo de la Aplicación

El objetivo principal de esta aplicación es mejorar la experiencia del cliente en una entidad estatal muy concurrida, reduciendo las filas físicas y optimizando la gestión del tiempo de espera. Entre los beneficios se incluyen:

- **Reducción de filas físicas**: Los clientes pueden solicitar su turno desde cualquier dispositivo con acceso a internet, lo que disminuye las aglomeraciones.
- **Mejor gestión del tiempo**: Al conocer el tiempo estimado de espera, los clientes pueden organizarse mejor.
- **Distribución eficiente de recursos**: El sistema calcula el tiempo de espera basado en la cantidad de asesores disponibles, maximizando la eficiencia.
- **Experiencia de usuario mejorada**: La interfaz es simple, clara y fácil de usar.

## Mejoras Futuras

Algunas posibles mejoras que podrías implementar para extender las funcionalidades de la aplicación incluyen:

- **Almacenamiento en una base de datos**: Para persistir la información de los turnos y poder analizar datos históricos.
- **Autenticación de usuarios**: Implementar un sistema de autenticación para que solo usuarios registrados puedan solicitar turnos.

  ### Objetivos del Ejercicio:

1. **Implementar y Comprender la Arquitectura Cliente-Servidor**: Este proyecto se enfoca en la estructura de la aplicación con un enfoque en el cliente. Demuestra cómo se distribuye la funcionalidad entre el cliente (interfaz web) y el servidor (aplicación backend con Express.js), resaltando los principios clave de esta arquitectura esencial para el desarrollo web moderno.
2. **Aplicar Conceptos de Desarrollo Web**: Utilizar tecnologías web como HTML, CSS y JavaScript para crear una interfaz de usuario interactiva que se comunica con el servidor para la gestión de turnos.
3. **Gestionar Flujo de Turnos y Tiempos de Espera en Tiempo Real**: Implementar la lógica que asigna turnos a los clientes en función de la disponibilidad de asesores, calculando los tiempos estimados de espera para mejorar la experiencia del usuario.
4. **Crear una Interfaz de Usuario Amigable**: Diseñar una UI simple pero efectiva utilizando HTML5 y CSS para que los usuarios puedan interactuar fácilmente con el sistema, solicitando turnos y visualizando su tiempo de espera.
5. **Familiarizarse con Frameworks de Desarrollo Web**: Implementar un servidor web utilizando Express.js en Node.js, manejando rutas y solicitudes HTTP, lo cual permite comprender cómo funcionan las aplicaciones del lado del servidor.
6. **Implementar una Simulación de Sistema de Gestión de Turnos**: Simular el flujo de un sistema de atención con asesores, gestionando la lógica del cliente en cola, asignación de turnos y estimaciones de tiempo mediante el manejo de datos en memoria.
7. **Control de Versiones y Colaboración**: Utilizar Git y GitHub para el control de versiones y la documentación del proyecto, asegurando una gestión de código adecuada y facilitando la colaboración en equipo.

Este ejercicio tiene como finalidad que los desarrolladores comprendan y practiquen cómo una solución tecnológica estructurada en la arquitectura cliente-servidor puede mejorar procesos cotidianos, enfocándose en una experiencia centrada en el usuario.
