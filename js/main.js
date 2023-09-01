// Acceder al archivo subido una vez que se
// clikea el botón "Procesar Archivo"

document.getElementById("manejadorArchivos").addEventListener("submit", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  // console.log("Botón Apretado");

  // Obtener el archivo subido (no aceptamos más de uno)
  const archivoSeleccionado = document.getElementById("inputFile").files[0];


  // Si el archivo existe, lo procesamos
  if (archivoSeleccionado) {
    procesarArchivo(archivoSeleccionado);
    // console.log("Archivo subido");
  }
})

function procesarArchivo(archivo) {
  // Crear Objeto JavaScript que permite manipular archivos asincrónicamente
  const lector = new FileReader(); 

  // Une vez que el archivo carga completamente, 
  lector.onload = function (event) {
    // Obtener el contenido del archivo
    const contenidoArchivo = event.target.result; // String

    // Convertir el contenido del archivo a un JSON
      // Obtener cada uno de los procesos del archivo
    var procesos = contenidoArchivo.split("\n"); // Arreglo
    console.log("Procesos como arreglo de texto: ", procesos);
      // Colocar en un objeto cada campo del proceso
    const tandaProcesos = []; // Nuevo contenedor de Objetos Proceso
    for (var proceso of procesos) { // Por cada uno de los procesos
      // console.log("Proceso como indice de arreglo (tipo String): ", proceso);
      var campos = proceso.split(","); // Dividir sus campos
      // console.log("Campos del proceso: ", campos);
      const objetoProceso = { // Agregar sus campos al objeto
        "name":campos[0],
        "arriveTime":campos[1],
        "nroRafagas":campos[2],
        "rCpuTime":campos[3],
        "rIoTime":campos[4],
        "priority":campos[5]
      };
      tandaProcesos[procesos.indexOf(proceso)] = objetoProceso; // Agregar Proceso a Tanda
    }
    
    console.log(tandaProcesos);

    // Si la tanda no está vacía
    if (tandaProcesos.length != 0) {
      const tablaProcesos = document.createElement("table");
      const captionTabla = document.createElement("caption");
      const filaTabla = document.createElement("tr");
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

      captionTabla.innerHTML = "Datos obtenidos del Archivo";

      tablaProcesos.appendChild(captionTabla);
      tablaProcesos.appendChild(filaTabla);
      filaTabla.appendChild(encabezadoNombre);
      filaTabla.appendChild(encabezadoTiempoArribo);
      filaTabla.appendChild(encabezadoRafagasCpu);
      filaTabla.appendChild(encabezadoDuracionRafagasCPU);
      filaTabla.appendChild(encabezadoDuracionRafagasIO);
      filaTabla.appendChild(encabezadoPrioridad);
      
      const archivoProcesado = document.getElementById("datosTandaIngresada");
      archivoProcesado.innerHTML = "";
      archivoProcesado.style.display = "block";
      archivoProcesado.appendChild(tablaProcesos);
      
      for (var procesito of tandaProcesos) {
        var filaTablaDatos = document.createElement("tr");
        var datoNombre = document.createElement("td");
        var datoTiempoArribo = document.createElement("td");
        var datoRafagasCPU = document.createElement("td");
        var datoDuracionRafagasCPU = document.createElement("td");
        var datoDuracionRafagasIO = document.createElement("td");
        var datoPrioridad = document.createElement("td");

        datoNombre.innerHTML = procesito.name;
        datoTiempoArribo.innerHTML = procesito.arriveTime;
        datoRafagasCPU.innerHTML = procesito.nroRafagas;
        datoDuracionRafagasCPU.innerHTML = procesito.rCpuTime;
        datoDuracionRafagasIO.innerHTML = procesito.rIoTime;
        datoPrioridad.innerHTML = procesito.priority;

        tablaProcesos.appendChild(filaTablaDatos);
        filaTablaDatos.appendChild(datoNombre);
        filaTablaDatos.appendChild(datoTiempoArribo);
        filaTablaDatos.appendChild(datoRafagasCPU);
        filaTablaDatos.appendChild(datoDuracionRafagasCPU);
        filaTablaDatos.appendChild(datoDuracionRafagasIO);
        filaTablaDatos.appendChild(datoPrioridad);
      }
      // var filaTabla = document.createElement("tr");
      // var columnaTabla = document.createElement("td");
      // var encabezadoTabla = document.createElement("th");
      // var captionTabla = document.createElement("caption");
    }

  };

  // Leer el archivo como texto (sinó no se puede manipular como tal)
  lector.readAsText(archivo); 

}