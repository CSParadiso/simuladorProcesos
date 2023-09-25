let tandaProcesos = []; // Variable Global

// Acceder al archivo subido por el usuario
document.getElementById("processFile").addEventListener("click", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  // Obtener el archivo subido (no aceptamos más de uno)
  const archivoSeleccionado = document.getElementById("inputFile").files[0];
  if (archivoSeleccionado) { // Si el archivo existe
    procesarArchivo(archivoSeleccionado); // se procesa
  }
})

// Procesar archivo
function procesarArchivo(archivo) {
  const lector = new FileReader(); // Permite manipular archivos asincrónicamente
  lector.readAsText(archivo); // Leer el archivo como texto
  lector.onload = function (event) { // Una vez que el archivo carga completamente, 
    const contenidoArchivo = event.target.result; // Obtener contenido tipo String
    tandaProcesos = toArray(contenidoArchivo); // Convertir contenido a Array de Objetos
    if (tandaProcesos !=  [] ) { // Si la tanda no está vacía, mostramos su contenido
      const tabla = crearTabla(); 
      agregarItemsTabla(tabla, tandaProcesos);
    }
  };
}

// Convertir archivo a Array de Objetos
function toArray(fileContent) {
  // Obtener cada uno de los procesos del archivo (lineas del String)
  var procesos = fileContent.split("\n"); // Dividir String (btener procesos)
  const tandaProcesos = []; // Arreglo contenedor de Objetos Proceso
  for (var proceso of procesos) { // Por cada uno de los procesos (items del arreglo) 
    var campos = proceso.split(","); // Dividir String (obtener campos)
    const objetoProceso = new Proceso(campos[0], // Crear objeto Proceso
      parseInt(campos[1], 10), parseInt(campos[2], 10), 
      parseInt(campos[3], 10), parseInt(campos[4], 10),
      parseInt(campos[5], 10));
    tandaProcesos.push(objetoProceso) // Agregar Objeto Proceso a Tanda
  }
  return tandaProcesos;
}

// Crear Tabla de Procesos en HTML
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

// Mostrar Procesos en HTML
function agregarItemsTabla(tabla, tandaProcesos) {
  for (var proceso of tandaProcesos) { // Por cada proceso
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
    datoNombre.innerHTML = proceso.nombre;
    datoTiempoArribo.innerHTML = proceso.tArrivo;
    datoRafagasCPU.innerHTML = proceso.rafagasCPU;
    datoDuracionRafagasCPU.innerHTML = proceso.duracionRafagasCPU;
    datoDuracionRafagasIO.innerHTML = proceso.duracionRafagasES;
    datoPrioridad.innerHTML = proceso.prioridad;
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

// Disparar Procesamiento de Tanda
document.getElementById("startSimulation").addEventListener("click", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  const valoresObtenidos = obtenerDatosSO(); // Obtener parámetros SO ingresados por el usuario
  const datosSo = new TablaSo(valoresObtenidos.politica, valoresObtenidos.valorTip, 
                         valoresObtenidos.valorTfp, valoresObtenidos.valorTcp,
                         valoresObtenidos.valorQuantum); // Crear Tabla de SO de acuerdo a los valores
  simularProcesamiento(datosSo);

  // Obtener Datos del Usuario
  function obtenerDatosSO() {
    // Seleccionar política
    let politica;
    let politicaIngresada = document.getElementById("politics").value; // Recuperar valor
    switch(politicaIngresada) {
      case "FCFS (First Come First Served)":
        politica = new FirstComeFirstServed();
        break;
      case "Prioridad Externa" : 
        politica = new PrioridadExterna();
        break;
      case "Round-Robin" : 
        politica = new RoundRobin();
        break;
      case "SPN (Shortest Process Next)" :
        politica = new ShortestProcessNext();
        break;
      case "SRTN (Shortest Remaining Time Next" :
        politica = new ShortestRemainingTimeNext();
        break;
      default:
        politica = new FirstComeFirstServed();
    }
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
    
    return { politica, valorTip, valorTfp, valorTcp, valorQuantum };
  }
})


// TODO #2 Implementar Simulación
function simularProcesamiento(tablaSo) {
  // console.log("Datos del SO especificados por el usuario: ", so);
  // console.log("Datos de la tanda cargada en el archivo: ", tandaProcesos);
  
  // Procesar Tanda
  do {
    console.log("En el tiempo", tablaSo.tiempo);
    
    // LABORES DEL PLANIFICADOR DE LARGO PLAZO en cada momento t
    tablaSo.verificarArrivos(tandaProcesos); // Corroborar si ha llegado un trabajo 
    // Corroborar si los procesos Nuevos han finalizado su tip (tiempo de inicio de proceso)
    if (tablaSo.colaNuevos.length != 0) { tablaSo.verificarTip(); }
    // Corroborar si los procesos Finalizados han finalizado su tfp(tiempo de finalización de proceso)
    if (tablaSo.colaFinalizados.length != 0) { tablaSo.finalizarProcesos(); }

    // LABORES DEL PLANIFICADOR DE CORTO PLAZO en cada momento t
    if (tablaSo.colaListos.length != 0) { 
      tablaSo.procesador.procesoEnEjecucion = tablaSo.politica.seleccionarSiguiente(tablaSo); 
    } // Verificar cual es el siguiente
    // Avanzar al siguiente tiempo t
    tablaSo.ejecutar(); // Más que nada sumar 1 a cada tiempo de los procesos en las colas
  
    // Seguimiento
    //console.log(tablaSo);
    // console.log("Tiempo:", tablaSo.tiempo);
    // console.log("Nuevos:", tablaSo.colaNuevos);
    // console.log("Listos:", tablaSo.colaListos);
    // console.log("Bloqueados:", tablaSo.colaBloqueados);
    // console.log("Finalizados:", tablaSo.colaFinalizados);
    // console.log("Cantidad Finalizados:", tablaSo.procesosFinalizados);

    console.log("-------------------------------------------------------------------------------------")

  // } while (tablaSo.procesosFinalizados != tandaProcesos.length) // Mientras haya procesos sin finalizar 
  } while (tablaSo.tiempo != 50) // Mientras haya procesos sin finalizar 
  
  
  
}

  //Procesos
  class Proceso {
    constructor(name, arriveTime, nroRafagas, rCpuTime, rIoTime, priority) {
      this.nombre = name;
      this.tArrivo = arriveTime;
      this.rafagasCPU = nroRafagas;
      this.duracionRafagasCPU = rCpuTime;
      this.duracionRafagasES = rIoTime;
      this.prioridad = priority;
    }
  }

  // CPU
  class Procesador {
    constructor(tablaSo) {
      console.log("Desde", this.constructor.name);
      this.tablaSo = tablaSo; // Conoce la tabla del SO
      this.procesoEnEjecucion = null;
      this.primerTCP = 0;
    }
  }  

  // Tabla SO
  class TablaSo {
    constructor(valorPolitica, valorTip, valorTfp, valorTcp, valorQuantum) {
      this.procesador = new Procesador(this); // Crear Procesador y pasarle la instancia de la clase TablaSo
      this.politica = valorPolitica;
      this.tip = valorTip; 
      this.tfp = valorTfp; 
      this.tcp = valorTcp;
      this.q = valorQuantum;
      this.tiempo = 0;
      this.colaNuevos = [];
      this.colaListos = [];
      this.colaBloqueados = [];
      this.colaFinalizados = [];
      this.procesosFinalizados = 0;
    }

    // Verificar Arrivos
    verificarArrivos(tandaProcesos) {
      for (var proceso of tandaProcesos) { // Por cada proceso de la tanda
        if (proceso.tArrivo === this.tiempo) { // Si arriva en este t,  
          this.crearImagenProceso(proceso); // Crea la imagen del proceso
        }
      }
    }
  
    // Verificar Tips
    verificarTip() {
      for (var imagenProceso of this.colaNuevos) { // Por cada proceso Nuevo
        if (imagenProceso.tip === this.tip) { // Si ha finalizado su tip
          this.ponerAListo(imagenProceso);  // Poner a Listo
          this.colaNuevos.splice(this.colaNuevos.indexOf(imagenProceso), 1); // Sacar de Nuevos
        } 
      }
    }

    // Crear la imagen del proceso en la Tabla del So
    crearImagenProceso(proceso) { 
      let imagenProceso = {
        "proceso" : proceso, // Proceso
        "tip" : 0,
        "tcp" : 0,
        "tfp" : 0,
        "estado" : "Nuevo", // Establecer estado
        "rafagaActual" : 0, // Número de ráfaga actual
        "unidadesRafagaCPUActual" : 0, // Contador unidades ráfaga actual
        "tBloqueado" : 0, // Contador unidades E/S
        "tInicio" : this.tiempo, // Marca de tiempo de Inicio
        "tListo" : 0, // Contador de tiempo en cola de Listos
        "tFin" : 0 // Marca de tiempo de Fin
      };
      this.colaNuevos.push(imagenProceso);
      console.log("Creada la imagen del proceso", imagenProceso.proceso.nombre, "en el tiempo", this.tiempo, 
      "y agregado a la cola de Nuevos.");
    }  

    ponerAListo(imgProceso) {
      imgProceso.tListo = 0; // Se inicializa su tiempo en Listo 
      imgProceso.estado = "Listo"; // Se actualiza su estado a Listo
      this.colaListos.push(imgProceso); // Se añade a la cola de Listos al final
      console.log("Puesto a Listo el proceso", imgProceso.proceso.nombre, "en el tiempo", this.tiempo, 
      "y agregado a la cola de Listos");
    }

    finalizarProcesos() {
      for (var imagenProceso of this.procesosFinalizados) { // Por cada proceso Finalizad
        if (imagenProceso.tfp = this.tfp) { // Si ha finalizado su tip
          this.imagenProceso.tFin = this.tiempo; // Se registra el tiempo de finalización
          this.colaFinalizados.splice(this.colaFinalizados.indexOf(imagenProceso), 1); // Se elimina 
          this.procesosFinalizados += 1;
        }
      }
    }

    // +1 en todos los tiempos y cambio de estado y de Cola de acuerdo a condiciones
    ejecutar() {
      this.tiempo += 1;
      // Incrementamos el tip de cada proceso Nuevo
      for(var imagenProceso of this.colaNuevos) { 
        imagenProceso.tip += 1; 
        console.log("Incrementando tip de", imagenProceso.proceso.nombre, "a", imagenProceso.tip);
      }
      for (var imagenProceso of this.colaListos) { imagenProceso.tListo += 1; }
      // Verificar si Bloqueados ya finalizaron su rafaga de E/S
      for (var imagenProceso of this.colaBloqueados) {  // Por cada proceso Bloqueado
        if (imagenProceso.tBloqueado == imagenProceso.proceso.duracionRafagasES && 
          imagenProceso.rafagaActual > imagenProceso.proceso.rafagasCPU) { // Si finalizó su última E/S
          imagenProceso.estado = "Finalizado"; // Cambiar su estado a Finalizado
          this.colaBloqueados.splice(this.procesosBloqueados.indexOf(imagenProceso), 1); // Se elimina de Bloqueados
          this.colaFinalizados.push(imagenProceso); // Se añade a Finalizados
        } else { // Sinó, aumentamos su tiempo bloqueado
          imagenProceso.tBloqueado += 1;  // Aumentamos su tiempo en uno
        }
      }      
    }


    // TODO #4.1 Calcular Indicadores Proceso
    // TODO #4.1.1 Tiempo de Retorno 
    // Tiempo de Retorno de un proceso (TRp): es desde que arriba el proceso hasta 
    // que termina (después de su TFP, incluyendo éste).
    calcularTRp(imagenProceso) {
      return imagenProceso.tFin - imagenProceso.tInicio;
    }
    // TODO #4.1.2 Tiempo de Retorno Normalizado
    //  Tiempo de retorno normalizado (TRn)= Es el tiempo de Retorno del proceso 
    // dividido el tiempo efectivo de CPU que utilizó.
    calcularTRNp(imagenProceso) {
      var tiempoCPUtotal = imagenProceso.proceso.rafagasCPU * imagenProceso.proceso.duracionRafagasCPU;
      return this.calcularTRp(imagenProceso) * tiempoCPUtotal;
    }
    // TODO #4.1.3 Tiempo en estado Listo
    // Suma de los tiempos en la cola de Listos
    calcularTCL(imagenProceso) {
      return imagenProceso.tListo;
    }

    
  }

// TODO #3 
// Diseñar algoritmos de las políticas
  // TODO #3.1 Diseñar FCFS (First Come First Served)
  class FirstComeFirstServed {
    constructor() {
      // console.log("Desde", this.constructor.name);
    }

    seleccionarSiguiente(tablaSo) {
      console.log("Seleccionando siguiente proceso en tiempo", tablaSo.tiempo);
      if (tablaSo.procesador.procesoEnEjecucion === null) {
        return null;
      } else {
        // Si se terminó su ráfaga actual y está usando tcp
        if (tablaSo.procesador.procesoEnEjecucion.unidadesRafagaCPUActual = tablaSo.duracionRafagasCPU && 
          tablaSo.procesador.procesoEnEjecucion.tcp < tablaSo.tcp) {
          tablaSo.procesador.procesoEnEjecucion.tcp += 1; // Incrementamos tcp  
          return tablaSo.procesador.procesoEnEjecucion  
        // Si aún no consumió sus unidades de ráfaga actual    
        } else if (tablaSo.procesador.procesoEnEjecucion.unidadesRafagaCPUActual < tablaSo.duracionRafagasCPU) { 
          tablaSo.procesador.procesoEnEjecucion.unidadesRafagaCPUActual += 1; // Incrementar uso de CPU
          return tablaSo.procesador.procesoEnEjecucion  
        // Si ya terminó su rafaga actual y su tcp
        } else  {
          tablaSo.procesador.procesoEnEjecucion.rafagaActual += 1; // Incrementamos en uno la ráfaga
          tablaSo.procesador.procesoEnEjecucion.unidadesRafagaCPUActual = 0; // Reseteamos unidades de rafaga actual
          tablaSo.procesador.procesoEnEjecucion.tcp = 0; // Reseteamos tcp
          if (tablaSo.colaListos.isEmpty() != 0) { // Si hay procesos Listos
            tablaSo.procesador.procesoEnEjecucion.estado = "Bloqueado"; // Se bloquea en su última E/S
            tablaSo.colaBloqueados.push(tablaSo.procesador.procesoEnEjecucion); // Añadimos a la cola 
            tablaSo.procesador.procesoEnEjecucion = tablaSo.colaListos[0]; // Cambiamos de proceso en ejecución
            tablaSo.procesador.procesoEnEjecucion.estado = "Ejecutando";
            return tablaSo.procesador.procesoEnEjecucion
          } else {
            return null;
          }
        }
      }
      
    }

    // seleccionarSiguiente(listos) {
    //   if (Procesador.isRunningProcess) { // Si hay algo en Ejecución
    //     return Procesador.procesoEnEjecucion; // 
    //   } else { // si no se está ejecutando nada
    //     this.proceso = listos.pop(0); // Retira de la cola de Listos el primero  
    //     return this.proceso;
    //   }      
    // }
  }

  // TODO #3.2 Prioridad Externa
  class PrioridadExterna {
    constructor() {
      console.log("Desde", this.constructor.name);
    }
    
    ponerAListo(imgProceso) {
      console.log(imgProceso.proceso.nombre, "puesto a Listo");
    }

    seleccionarSiguiente() {
      console.log("Seleccionando siguiente proceso en tiempo", tiempo);
    }

  }

  // TODO #3.3 Round-Robin
  class RoundRobin {
    constructor() {
      console.log("Desde", this.constructor.name);
    }
    
    ponerAListo(imgProceso) {
      console.log(imgProceso.proceso.nombre, "puesto a Listo");
    }

    seleccionarSiguiente() {
      console.log("Seleccionando siguiente proceso en tiempo", tiempo);
    }

  }

  // TODO #3.4 SPN (Shortest Process Next)
  class ShortestProcessNext {
    constructor() {
      console.log("Desde", this.constructor.name);
    }
    
    ponerAListo(imgProceso) {
      console.log(imgProceso.proceso.nombre, "puesto a Listo");
    }

    seleccionarSiguiente() {
      console.log("Seleccionando siguiente proceso en tiempo", tiempo);
    }

  }

  // TODO #3.5 SRTN (Shortest Remaining Time Next)
  class ShortestRemainingTimeNext {
    constructor() {
      console.log("Desde", this.constructor.name);
    }
    
    ponerAListo(imgProceso) {
      console.log(imgProceso.proceso.nombre, "puesto a Listo");
    }

    seleccionarSiguiente() {
      console.log("Seleccionando siguiente proceso en tiempo", tiempo);
    }

  }

// TODO #4 Calcular resultados 
 

    
    
    
    
    
  // TODO #4.2 Calcular Indicadores Tanda

  // TODO #4.3 Calcular Indicadores CPU

  // TODO #5.1 Mostrar Indicadores Proceso
  // TODO #5.2 Mostrar Indicadores Tanda
  // TODO #5.3 Mostrar Indicadores CPU

// TODO #6 Producir archivo de TRAZA y descargar

// FIXME #1 Analizar si conviene usar solo JSON o arreglo de JSON

// FIXME #2 Refactorizar lo que se repite

// FIXME #3 Analizar si se puede usar más de un archivo

// function toJsonArray(fileContent) {
//   // Obtener cada uno de los procesos del archivo (lineas del String)
//   var procesos = fileContent.split("\n"); // Dividir String (btener procesos)
//   const tandaProcesos = {}; // Objeto contenedor de Objetos Proceso
//   for (var proceso of procesos) { // Por cada uno de los procesos (items del arreglo) 
//     var campos = proceso.split(","); // Dividir String (obtener campos)
//     tandaProcesos[campos[0].trim()] = { // Por cada nombre de proceso, creamos un objeto
//       "arriveTime" : parseInt(campos[1], 10),
//       "nroRafagas" : parseInt(campos[2], 10),
//       "rCpuTime" : parseInt(campos[3], 10),
//       "rIoTime" : parseInt(campos[4], 10),
//       "priority" : parseInt(campos[5], 10)
//     }
//   }
//   return tandaProcesos;
// }