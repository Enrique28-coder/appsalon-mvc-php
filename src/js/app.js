let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la sección cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente(); // Añadir el id del cliente al objeto cita
    nombreCliente(); // Añadir el nombre del cliente al objeto cita
    seleccionarFecha(); // Añadir la fecha en el objeto cita
    seleccionarHora(); // Añadir la hora en el objeto cita

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
    // Ocultar la sección que tenga la clase mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }
    
    // Seleccionar la sección con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quitar la clase actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');

}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();

            paso = parseInt(e.target.dataset.paso);
            
            mostrarSeccion(); // Para agregar estilos a los tabs
            botonesPaginador(); // Para agregar estilos a los botones del paginador
        })
    })
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        // Mostrar el resumen si está en el último paso
        mostrarResumen();

    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');  
    }

    mostrarSeccion(); // Mostrar u ocultar en base a los pasos
}

function paginaSiguiente() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener('click', function() {
        
        if (paso <= pasoInicial) return; // Para que no baje del paso inicial
        paso--; // Disminuir el paso en 1

        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener('click', function() {
        
        if (paso >= pasoFinal) return; // Para que no suba del paso final
        paso++; // Aumentar el paso en 1

        botonesPaginador();
    })
}

// Async permite que otras funciones se realicen mientras está aun no termina
async function consultarAPI() {

    // Try-catch intenta la ejecución del código, y si se tiene un error, no detiene la ejecución del código
    try {
        const url = '/api/servicios';

        // Await detiene la ejecución del código hasta que no se complete la función de Async, fetch consulta el api
        const resultado = await fetch(url);

        const servicios = await resultado.json();

        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}

// Mostrar los servicios en el frontend
function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicios');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;

        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        // Mostrar los servicios en el div con id servicios
        document.querySelector("#servicios").appendChild(servicioDiv);
    } )
}

function seleccionarServicio(servicio) {
    // Extraer los atributos "id" del servicio, y "servicios" del objeto cita
    const { id } = servicio;
    const { servicios } = cita;

    // Obtener el div al que se da click con su dataset y el id
    const divServicio = document.querySelector(`[data-id-servicio ="${id}"]`)

    // Comprobar si el servicio ya fué agregado o quitarlo (some verifica si existe el elemento, true o false)
    // Se verifica si el Id del elemento seleccionado ya pertenece al arreglo servicios de la cita
    if ( servicios.some( agregado => agregado.id === id ) ) {

        // Eliminarlo con la función filter
        cita.servicios = servicios.filter( agregado => agregado.id !== id );

        divServicio.classList.remove('seleccionado');

    } else {
        // Agregar el nuevo servicio al arreglo servicios
        cita.servicios = [...servicios, servicio];

        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    // Asignar valor del input del id al atributo id del objeto "cita"
    cita.id = document.querySelector("#id").value;
}

function nombreCliente() {
    // Asignar valor del input del nombre al atributo nombre del objeto "cita"
    cita.nombre = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector("#fecha");
    inputFecha.addEventListener('input', function(e) {

        // Obtener el nro de día (0 domingo, 1 lunes ... 6 sabado)
        const dia = new Date(e.target.value).getUTCDay();

        // Revisar si eligió sabado, domingo u otro día
        if( [6, 0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');

        } else {
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHora() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener('input', function(e) {

        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];

        if (hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Hora no válida', 'error', '.formulario');
            
        } else {
            cita.hora = horaCita;
        }

    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    // Borrar la alerta si ya existe
    const alertaAnterior = document.querySelector('.alerta');
    if (alertaAnterior) {
        alertaAnterior.remove();
    }

    // Scriptiing para crear alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    // Mostrar alerta despues de la referencia
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (desaparece) {
        // Borrar la alerta despues de 3s
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    // Object.values itera sobre el objeto "cita" y verifica si algun campo está vacío
    // Se verifica si falta algun dato (fecha y hora), o si no eligió servicios
    if ( Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de servicios, fecha y hora', 'error', '.contenido-resumen', false);
        return;
    }

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para servicios en el resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    // Heading para cita en el resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de la cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha); // Cada vez que se utiliza new Date, se resta 1 día
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2; // Se suma 2 al día porque se usan 2 new Date
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia) );

    // Se asigna el formato de la fecha con parámetros para dia, mes y año
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fechaFormateada = fechaUTC.toLocaleDateString('es-PE', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

// Función para reservar cita
async function reservarCita() {

    const { fecha, hora, servicios, id } = cita;

    // Colocar los servicios en la variable idServicios
    const idServicios = servicios.map(servicio => servicio.id);

    const datos = new FormData();

    // Append agrega datos al FormData
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);
    datos.append('usuarioId', id);

    // Ejecutar la consulta al API en un try-catch
    try {

        // Petición hacia la API
        const url = '/api/servicios';
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos // Se envia el FormData
        });

        const resultado = await respuesta.json();

        if (resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita creada",
                text: "Tu cita fue creada correctamente!",
                button: 'OK'
            }).then( () => {
                window.location.reload(); // Recargar la página
            })    
        }
        
    // Si no se comunica con el API, mostrar error
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita!",
          });
    }
}