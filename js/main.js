let tandaProcesos; // Variable Global

// Acceder al archivo subido por el usuario
document.getElementById("processFile").addEventListener("click", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  // Obtener el archivo subido (no aceptamos más de uno)
  const archivoSeleccionado = document.getElementById("inputFile").files[0];
  if (archivoSeleccionado) { // Si el archivo existe
    procesarArchivo(archivoSeleccionado); // se procesa
  }
})

// Simular Dispatcher
document.getElementById("startSimulation").addEventListener("click", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  // Obtener parámetros SO ingresados por el usuario
  const tiemposSO = obtenerDatosSO();
  // console.log(tiemposSO);
  simularTanda(tiemposSO, tandaProcesos);
})

// Procesar archivo
function procesarArchivo(archivo) {
  const lector = new FileReader(); // Permite manipular archivos asincrónicamente
  lector.readAsText(archivo); // Leer el archivo como texto
  lector.onload = function (event) { // Una vez que el archivo carga completamente, 
    const contenidoArchivo = event.target.result; // Obtener contenido tipo String
    tandaProcesos = toJsonArray(contenidoArchivo); // Convertir contenido a JsonArray
    if (tandaProcesos.length != 0) { // Si la tanda no está vacía, mostramos su contenido
      const tabla = crearTabla(); 
      agregarItemsTabla(tabla, tandaProcesos);
    }
  };
}

// Convertir archivo a JsonArray
function toJsonArray(fileContent) {
  // Obtener cada uno de los procesos del archivo (lineas del String)
  var procesos = fileContent.split("\n"); // Dividir String (btener procesos)
  const tandaProcesos = []; // Arreglo contenedor de Objetos Proceso
  for (var proceso of procesos) { // Por cada uno de los procesos (items del arreglo) 
    var campos = proceso.split(","); // Dividir String (obtener campos)
    const objetoProceso = { // Agregar sus campos al objeto
      "name" :campos[0],
      "arriveTime" : parseInt(campos[1], 10),
      "nroRafagas" : parseInt(campos[2], 10),
      "rCpuTime" : parseInt(campos[3], 10),
      "rIoTime" : parseInt(campos[4], 10),
      "priority" : parseInt(campos[5], 10)
    };
    tandaProcesos[procesos.indexOf(proceso)] = objetoProceso; // Agregar Objeto Proceso a Tanda
  }
  return tandaProcesos;
}

// Crear Tabla de Procesos
function crearTabla() {
  // Crear tabla, caption, separador y fila de encabezados
  const tablaProcesos = document.createElement("table");
  const captionTabla = document.createElement("caption");
  captionTabla.innerHTML = "Datos obtenidos del Archivo";
  const separador = document.createElement("hr");
  const filaTabla = document.createElement("tr");
  // Crear encabezados 
  const encabezadoNombre = document.createElement("th");
  encabezadoNombre.innerHTML = "Nombre Proceso";
  const encabezadoTiempoArribo = document.createElement("th");
  encabezadoTiempoArribo.innerHTML = "Tiempo de arribo";
  const encabezadoRafagasCpu = document.createElement("th");
  encabezadoRafagasCpu.innerHTML = "Ráfagas de CPU para completarse";
  const encabezadoDuracionRafagasCPU = document.createElement("th");
  encabezadoDuracionRafagasCPU.innerHTML = "Duración ráfagas CPU";
  const encabezadoDuracionRafagasIO = document.createElement("th");
  encabezadoDuracionRafagasIO.innerHTML = "Duración ráfagas I/O";
  const encabezadoPrioridad = document.createElement("th");
  encabezadoPrioridad.innerHTML = "Prioridad";
  // Añadir elementos a sus respectivos contenedores en la página
  // document.getElementById("selectFile").insertBefore(separador, 
  //   document.getElementById("datosTandaIngresada"));
  tablaProcesos.appendChild(captionTabla);
  tablaProcesos.appendChild(filaTabla);
  filaTabla.appendChild(encabezadoNombre);
  filaTabla.appendChild(encabezadoTiempoArribo);
  filaTabla.appendChild(encabezadoRafagasCpu);
  filaTabla.appendChild(encabezadoDuracionRafagasCPU);
  filaTabla.appendChild(encabezadoDuracionRafagasIO);
  filaTabla.appendChild(encabezadoPrioridad);
  // Obtener contenedor fijo en HTML
  const contenedorTabla = document.getElementById("datosTandaIngresada");
  contenedorTabla.innerHTML = ""; // Borrar contenido antiguo
  contenedorTabla.style.display = "block"; // Hacer visible
  contenedorTabla.appendChild(separador);
  contenedorTabla.appendChild(tablaProcesos); // Añadir tabla generada
  return tablaProcesos;
}

// Mostrar Procesos
function agregarItemsTabla(tabla, tandaProcesos) {
  for (var procesito of tandaProcesos) { // Por cada proceso
    // Crear fila
    var filaTablaDatos = document.createElement("tr");
    // Crear columnas de campos ...  
    var datoNombre = document.createElement("td"); 
    var datoTiempoArribo = document.createElement("td");
    var datoRafagasCPU = document.createElement("td");
    var datoDuracionRafagasCPU = document.createElement("td");
    var datoDuracionRafagasIO = document.createElement("td");
    var datoPrioridad = document.createElement("td");
    // Cada campo de proceso se escribe en su columna
    datoNombre.innerHTML = procesito.name;
    datoTiempoArribo.innerHTML = procesito.arriveTime;
    datoRafagasCPU.innerHTML = procesito.nroRafagas;
    datoDuracionRafagasCPU.innerHTML = procesito.rCpuTime;
    datoDuracionRafagasIO.innerHTML = procesito.rIoTime;
    datoPrioridad.innerHTML = procesito.priority;
    // Añadir elementos en sus respectivos contenedores
    tabla.appendChild(filaTablaDatos);
    filaTablaDatos.appendChild(datoNombre);
    filaTablaDatos.appendChild(datoTiempoArribo);
    filaTablaDatos.appendChild(datoRafagasCPU);
    filaTablaDatos.appendChild(datoDuracionRafagasCPU);
    filaTablaDatos.appendChild(datoDuracionRafagasIO);
    filaTablaDatos.appendChild(datoPrioridad);
  };
}

// Obtener Datos del Usuario
function obtenerDatosSO() {
  // Seleccionar política
  let politica = document.getElementById("politics").value; // Recuperar valor
  console.log(politica);
  // Tiempo que utiliza el SO para aceptar nuevos procesos
  let valorTip = document.getElementById("tip").value; // Recuperar valor
  valorTip = valorTip == "" ? 1 : parseInt(valorTip, 10); // Por defecto 1
  // Tiempo que utiliza el SO para terminar procesos
  let valorTfp = document.getElementById("tfp").value; // Recuperar valor
  valorTfp = valorTfp == "" ? 1 : parseInt(valorTfp, 10); // Por defecto 1
  // Tiempo de conmutación entre procesos
  let valorTcp = document.getElementById("tcp").value; // Recuperar valor
  valorTcp = valorTcp == "" ? 1 : parseInt(valorTcp, 10); // Por defecto 1
  // Quantum
  let valorQuantum = document.getElementById("quantum").value; // Recuperar valor
  valorQuantum = valorQuantum == "" ? 1 : parseInt(valorQuantum, 10); // Por defecto 1
  return { "politica" : politica,
           "tip" : valorTip, 
           "tfp" : valorTfp, 
           "tcp" : valorTcp, 
           "quantum" : valorQuantum }
}
// TODO #2 Implementar Simulación
function simularTanda(so, tanda) {
  console.log(so);
  console.log(tanda);
}

// TODO #3 
// Diseñar algoritmos de las políticas

  // TODO #3.1 Diseñar FCFS (First Come First Served)
  // 

  // TODO #3.2 Prioridad Externa
  //

  // TODO #3.3 Round-Robin
  //

  // TODO #3.4 SPN (Shortest Process Next)
  //

  // TODO #3.5 SRTN (Shortest Remaining Time Next)
  //

// TODO #4 Mostrar en la página los resultados

// TODO #5 Producir archivo de TRAZA y descargar

// FIXME #1 Analizar si conviene usar solo JSON o arreglo de JSON

// FIXME #2 Refactorizar lo que se repite

// FIXME #3 Analizar si se puede usar más de un archivo