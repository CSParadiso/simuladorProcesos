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
  // Procesar Tanda
  do {
    // Avanzar al siguiente tiempo t
    tablaSo.siguienteTiempo(); // Más que nada sumar 1 a cada tiempo de los procesos en las colas

    console.log("--------------------Iniciando el tiempo", tablaSo.tiempo, "--------------------");
    //tablaSo.mostrarInformacion();
    
    // PLANIFICADOR DE LARGO PLAZO 
    // en cada momento t
    tablaSo.verificarArrivos(tandaProcesos); // Corroborar si ha llegado un trabajo 

    // PLANIFICADOR DE CORTO PLAZO 
    // Verificar Interrupciones (Bloqueado a Listo)
    if (tablaSo.colaBloqueados.length != 0) { // verificar si ha completado E/S
      tablaSo.verificarInterrupciones();
    }

    // PLANIFICADOR DE LARGO PLAZO 
    // Corroborar si los procesos Nuevos han completado su tip (Nuevo a Listo)
    if (tablaSo.colaNuevos.length  != 0) { tablaSo.verificarTip(); }
    
    // PLANIFICADOR DE LARGO PLAZO
    // Corroborar si los procesos finalizando han completado su tfp(tiempo de finalización de proceso)
    if (tablaSo.colaFinalizando.length != 0) { tablaSo.finalizarProcesos(); }

    // LABORES DEL PLANIFICADOR DE CORTO PLAZO en cada momento t
    // (Corriendo a [Terminado, Bloqueado, Listo])
    if (tablaSo.colaListos.length != 0 ||
      tablaSo.procesador.procesoEnEjecucion != null) { // Verificar cual es el siguiente
      tablaSo.procesador.procesoEnEjecucion = tablaSo.politica.seleccionarSiguiente(tablaSo); 
    }    
    //tablaSo.mostrarInformacion();
   
   
  } while (tablaSo.colaFinalizados.length != tandaProcesos.length) // Mientras haya procesos sin finalizar 
  //} while (tablaSo.tiempo != 600) // Mientras haya procesos sin finalizar 
  tablaSo.mostrarInformacion();
  console.log(tablaSo.colaFinalizados);
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
      this.servicio = true;
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
      this.tiempo = -1;
      this.colaNuevos = [];
      this.colaListos = [];
      this.colaBloqueados = [];
      this.colaFinalizando = [];
      this.colaFinalizados = [];
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
      this.colaNuevos = this.colaNuevos.filter(imagenProceso => { // La cola de nuevos se reconstruye
        if (imagenProceso.tip === this.tip) { // Si el proceso alcanzó su tip
          this.ponerAListo(imagenProceso); // Poner a Listo
          return false; // No incluir en el nuevo arreglo
        }
        return true; // Incluir en el nuevo arreglo
      });
    }

    // Verificar Interrupciones
    verificarInterrupciones() {
      this.colaBloqueados = this.colaBloqueados.filter(imagenProceso => {
        if (imagenProceso.unidadesRafagaES === imagenProceso.proceso.duracionRafagasES) {
          if (imagenProceso.rafagaActual >= imagenProceso.proceso.rafagasCPU) { // Si finalizó su última E/S
            imagenProceso.estado = "Finalizando"; // Cambiar su estado a Finalizado
            this.colaFinalizando.push(imagenProceso); // Agregar a Finalizando
            return false;
          } else { // Si aún no finalizó sus ráfagas
            imagenProceso.estado = "Listo"; // Cambiar su estado a Listo
            this.colaListos.push(imagenProceso); // Agregar a cola de Listos
            return false;
          }
        }
        imagenProceso.unidadesRafagaES += 1; 
        imagenProceso.tBloqueado += 1; 
        return true;  
      });
    }

    // Crear la imagen del proceso en la Tabla del So
    crearImagenProceso(proceso) { 
      let imagenProceso = {
        "proceso" : proceso, // Proceso
        "tip" : 0,
        "tcp" : 0,
        "tfp" : 0,
        "estado" : "Nuevo", // Establecer estado
        "rafagaActual" : 1, // Número de ráfaga actual
        "unidadesRestantesRafagaCPU" : proceso.duracionRafagasCPU, // Contador unidades ráfaga actual
        "unidadesRafagaES" : 0,
        "tBloqueado" : 0, // Contador unidades E/S
        "tInicio" : this.tiempo, // Marca de tiempo de Inicio
        "tListo" : 0, // Contador de tiempo en cola de Listos
        "tFin" : 0 // Marca de tiempo de Fin
      };
      this.colaNuevos.push(imagenProceso);
      console.log("Cambio de estado del proceso", imagenProceso.proceso.nombre, "en el tiempo", this.tiempo, 
      ": agregado a la cola de NUEVOS (creándose)");
    }  

    ponerAListo(imgProceso) {
      imgProceso.tListo = 0; // Se inicializa su tiempo en Listo 
      imgProceso.estado = "Listo"; // Se actualiza su estado a Listo
      this.colaListos.push(imgProceso); // Se añade a la cola de Listos al final
      console.log("Cambio de estado del proceso", imgProceso.proceso.nombre, "en el tiempo", this.tiempo, 
      ": agregado a la cola de LISTOS");
    }

    finalizarProcesos() {
      this.colaFinalizando = this.colaFinalizando.filter(imagenProceso => {
        if (imagenProceso.tfp != this.tfp) {
          imagenProceso.tfp += 1;
          return true;
        }
        imagenProceso.estado = "Finalizado";
        this.colaFinalizados.push(imagenProceso);
        console.log("Cambio de estado del proceso", imagenProceso.proceso.nombre, "en el tiempo", this.tiempo, 
        ": agregado a la cola de FINALIZADOS");
        imagenProceso.tFin = this.tiempo;
        return false
      });
    }

    // +1 en todos los tiempos y cambio de estado y de Cola de acuerdo a condiciones
    siguienteTiempo() {
      this.tiempo += 1;
      // Mostrar proceso en Ejecución
      if (this.procesador.procesoEnEjecucion != null) {
        console.log("Cargado en Procesador el proceso", this.procesador.procesoEnEjecucion.proceso.nombre, 
        "Ráfaga actual", this.procesador.procesoEnEjecucion.rafagaActual, 
        "Unidades restantes ráfaga", this.procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU);
      }
      // Incrementamos el tip de cada proceso Nuevo
      for(var imagenProceso of this.colaNuevos) { 
        imagenProceso.tip += 1; 
        console.log("Incrementando tip de", imagenProceso.proceso.nombre, "a", imagenProceso.tip);
      }
      // Incrementamos el tip de cada proceso Listo
      for (var imagenProceso of this.colaListos) { imagenProceso.tListo += 1; }
      
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

    // Mostrar nombre del Proceso
    verNombre(imagenProceso) {
      console.log(imagenProceso.proceso.nombre);
    }

    // Mostrar información TablaSo
    mostrarInformacion() {
      console.log("-------------------- Arrancando el tiempo", this.tiempo, "--------------------");
      console.log("NUEVOS");
      this.colaNuevos.forEach(imagenProceso => {
        this.verNombre(imagenProceso);
      });
      console.log("LISTOS");
      this.colaListos.forEach(imagenProceso => {
        this.verNombre(imagenProceso);
      });
      console.log("EJECUTANDO")
      if(this.procesador.procesoEnEjecucion != null) { this.verNombre(this.procesador.procesoEnEjecucion); }
      console.log("BLOQUEADOS");
      this.colaBloqueados.forEach(imagenProceso => {
        this.verNombre(imagenProceso);
      });
      console.log("FINALIZANDO (ejecutando TFP)");
      this.colaFinalizando.forEach(imagenProceso => {
        this.verNombre(imagenProceso);
      });
      console.log("FINALIZADOS");
      this.colaFinalizados.forEach(imagenProceso => {
        this.verNombre(imagenProceso);
      });
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
      //console.log("Seleccionando siguiente proceso en tiempo", tablaSo.tiempo);
      if (tablaSo.procesador.primerTCP < tablaSo.tcp ) { // Si es el primer proceso de la tanda
        tablaSo.procesador.primerTCP += 1; // Se ejecuta el primer tcp
        console.log("Ejecutando Inicio de Tanda", tablaSo.procesador.primerTCP);
      } else if (tablaSo.procesador.primerTCP === tablaSo.tcp) { // Una vez consumido el primer tcp 
        tablaSo.procesador.procesoEnEjecucion = tablaSo.colaListos.shift(); // Se asigna al procesador el primer proceso
        tablaSo.procesador.primerTCP += 1; // Sacamos del rango el tcp para que no se ejecute más
        //console.log("Cargado a procesador primer proceso:", tablaSo.procesador.procesoEnEjecucion.proceso.nombre);
        //ver(tablaSo.procesador.procesoEnEjecucion);
      } else { // Si está ejecutando el proceso
        // Si se terminó su ráfaga actual y está usando tcp
        if (tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU < 0 && 
          tablaSo.procesador.procesoEnEjecucion.tcp < tablaSo.tcp) {
          tablaSo.procesador.procesoEnEjecucion.tcp += 1; // Incrementamos tcp  
          console.log("Abandonando el proceso", tablaSo.procesador.procesoEnEjecucion.proceso.nombre, 
          "al consumir una unidad de tcp (Ejecutano en modo SO).");
        // Si aún no consumió sus unidades de ráfaga actual    
        } else if (tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU >= 0 ) { 
          tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU -= 1; // Decrementar uso de CPU
          console.log("Ejecutando ráfaga de CPU del proceso", tablaSo.procesador.procesoEnEjecucion.proceso.nombre);
          //ver(tablaSo.procesador.procesoEnEjecucion);
        // Si ya terminó su rafaga actual y su tcp
        } else  {
          tablaSo.procesador.procesoEnEjecucion.rafagaActual += 1; // Incrementamos en uno la ráfaga
          tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU = 
            tablaSo.procesador.procesoEnEjecucion.proceso.duracionRafagasCPU; // Reseteamos unidades de rafaga actual
          tablaSo.procesador.procesoEnEjecucion.tcp = 0; // Reseteamos tcp
          tablaSo.procesador.procesoEnEjecucion.estado = "Bloqueado"; // Se bloquea en su última E/S
          console.log("Cambio de estado del proceso", tablaSo.procesador.procesoEnEjecucion.proceso.nombre,
           "en el tiempo", this.tiempo, 
          ": agregado a la cola de LISTOS");
          tablaSo.colaBloqueados.push(tablaSo.procesador.procesoEnEjecucion); // Añadimos a la cola 
          tablaSo.procesador.procesoEnEjecucion = null;
          if (tablaSo.colaListos.length != 0) { // Si hay procesos Listos
            tablaSo.procesador.procesoEnEjecucion = tablaSo.colaListos.shift(); // Cambiamos de proceso en ejecución
            tablaSo.procesador.procesoEnEjecucion.estado = "Ejecutando";
            console.log("Comenzando ráfaga del proceso", tablaSo.procesador.procesoEnEjecucion.proceso.nombre, 
            "Rafagas actual", tablaSo.procesador.procesoEnEjecucion.rafagaActual, 
            "Unidades Ráfaga Actual", tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU);
          } 
        }
      }
      return tablaSo.procesador.procesoEnEjecucion;
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



  function ver(imagenProceso) {
    console.log(imagenProceso.proceso);
    console.log(imagenProceso.tip);
    console.log(imagenProceso.tcp);
    console.log(imagenProceso.tfp);
    console.log(imagenProceso.estado);
    console.log(imagenProceso.rafagaActual);
    console.log(imagenProceso.unidadesRestantesRafagaCPU);
    console.log(imagenProceso.tBloqueado);
    console.log(imagenProceso.tInicio);
    console.log(imagenProceso.tListo);
    console.log(imagenProceso.tFin);
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