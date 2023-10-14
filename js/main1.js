let tandaProcesos = []; // Variable Global

let nombreEstadoYTiempo = function (imagenProceso) {
  console.log(imagenProceso.proceso.nombre, imagenProceso.estado);
}

let imagen = function (imagenProceso) {
  console.log(imagenProceso.proceso);
  console.log("TIP:", imagenProceso.tip);
  console.log("TCP:", imagenProceso.tcp);
  console.log("TFP:", imagenProceso.tfp);
  console.log("ESTADO:", imagenProceso.estado);
  console.log("Ráfagas Restantes:", imagenProceso.rafagasRestantes);
  console.log("Unidades Restantes Ráfaga CPU:", imagenProceso.unidadesRestantesRafagaCPU);
  console.log("Tiempo Bloqueado:", imagenProceso.tBloqueado);
  console.log("Tiempo de inicio:", imagenProceso.tInicio);
  console.log("Tiempo Listo:", imagenProceso.tListo);
  console.log("Tiempo de finalización:", imagenProceso.tFin);
} 

let nombre = function(imagenProceso) {
  console.log(imagenProceso.proceso.nombre);
} 

// Acceder al archivo subido por el usuario
document.getElementById("processFile").addEventListener("click", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  // Obtener el archivo subido (no aceptamos más de uno)
  const archivoSeleccionado = document.getElementById("inputFile").files[0];
  if (archivoSeleccionado) { // Si el archivo existe
    procesarArchivo(archivoSeleccionado); // se procesa
  }
})

// Disparar Procesamiento de Tanda
document.getElementById("startSimulation").addEventListener("click", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  const valoresObtenidos = obtenerDatosSO(); // Obtener parámetros SO ingresados por el usuario
  const datosSo = new TablaSo(valoresObtenidos.politica, valoresObtenidos.valorTip, 
                         valoresObtenidos.valorTfp, valoresObtenidos.valorTcp,
                         valoresObtenidos.valorQuantum); // Crear Tabla de SO de acuerdo a los valores
  simularProcesamiento(datosSo);
  mostrarResultados(datosSo);

  
  
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

// Crear Tabla de Trabajos en HTML
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

// Mostrar Trabajos en HTML
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

// TODO #2 Implementar Simulación
function simularProcesamiento(tablaSo) {

  //console.log(`-------- ESTADOS de los procesos al comenzar el tiempo ${tablaSo.tiempo}--------`);

  do {
    console.log(`-------- EVENTOS SUCEDIDOS EN EL TIEMPO ${tablaSo.tiempo}--------`);

    tablaSo.verificarArrivos();

    tablaSo.verificarBloqueados();

    tablaSo.verificarFinalizaciones();

    tablaSo.verificarListos();

    tablaSo.determinarSiguiente();

    tablaSo.ejecutar();
    
    tablaSo.pasarAlSiguienteTiempo(); 
    
    //console.log(`-------- ESTADOS de los procesos al comenzar el tiempo ${tablaSo.tiempo}--------`);
    //tablaSo.mostrarInformacion(nombreYestado);

  } while (tandaProcesos.length != tablaSo.colaFinalizados.length);
  //} while (tablaSo.tiempo != 100);

}

class TablaSo {
  constructor(valorPolitica, valorTip, valorTfp, valorTcp, valorQuantum) {
    this.tip = valorTip; 
    this.tfp = valorTfp; 
    this.tcp = valorTcp;
    this.q = valorQuantum;
    this.tiempo = 0;
    this.procesosArrivados = 0;
    this.colaNuevos = [];
    this.colaListos = [];
    this.colaBloqueados = [];
    this.colaFinalizando = [];
    this.colaFinalizados = [];  
    this.procesador = new Procesador(this); // Crear Procesador y pasarle la instancia de la clase TablaSo
    this.politica = valorPolitica;
  }

  estados = {
    NUEVO: "Nuevo",
    LISTO: "Listo",
    EJECUTANDO: "Ejecutando",
    BLOQUEADO: "Bloqueado",
    FINALIZADO: "Finalizado"
  }

  ejecutar() {
    this.procesador.ejecutar();
  }

  verificarFinalizaciones() {
    if (this.colaFinalizando.length != 0) { // Si hay procesos finalizando
      this.colaFinalizando = this.colaFinalizando.filter( // se construye una nueva cola verificando
        imagenProceso => { // para cada proceso
          if (imagenProceso.tfp != 0) { // Si aún está haciendo labores de finalización
            imagenProceso.tfp -= 1; // Consumimos una unidad
            return true; // Continúa Finalizando
          } else { // Si ya finalizó imagenProceso.tfp === 0
            imagenProceso.tFin = this.tiempo;
            imagenProceso.estado = this.estados.FINALIZADO;
            this.colaFinalizados.push(imagenProceso);
            console.log(`--> FINALIZANDO a FINALIZADO: "${imagenProceso.proceso.nombre}" en t${this.tiempo}`);
            return false;
          }
        }
      );
    }
  }

  verificarBloqueados() {
    this.politica.verificarBloqueados(this);
  }

  verificarArrivos() {
    if (this.procesosArrivados != tandaProcesos.length) { // Si aún no arrivaron todos los procesos
      for (var proceso of tandaProcesos) {
        if(proceso.tArrivo === this.tiempo) {
          const imagenProceso = {
            "proceso" : proceso, // Proceso
            "tip" : this.tip,
            "tcp" : this.tcp,
            "tfp" : this.tfp,
            "estado" : this.estados.NUEVO, // Establecer estado
            "rafagasRestantes" : proceso.rafagasCPU, // Número de ráfaga actual
            "unidadesRestantesRafagaCPU" : proceso.duracionRafagasCPU, // Contador unidades ráfaga actual
            "unidadesRestantesRafagaES" : proceso.duracionRafagasES, // Contador unidades ráfaga actual
            "tBloqueado" : 0, // Contador unidades E/S
            "tInicio" : this.tiempo, // Marca de tiempo de Inicio
            "tListo" : 0, // Contador de tiempo en cola de Listos
            "tFin" : 0 // Marca de tiempo de Fin
          }
          this.procesosArrivados += 1; // Incrementamos los procesos arrivados
          console.log(`--> a NUEVO: "${imagenProceso.proceso.nombre}" en t${this.tiempo}`);
          this.colaNuevos.push(imagenProceso);
        }
      }  
    }
  }

  verificarListos() {
    if(this.colaNuevos.length != 0) { // Si hay procesos Nuevos
      this.colaNuevos = this.colaNuevos // se construye una nueva cola verificando
      .filter( imagenProceso => { // por cada proceso
        if (imagenProceso.tip === 0) { // Si ha finalizado su tip
          imagenProceso.estado = this.estados.LISTO; // Cambiamos estado
          this.colaListos.push(imagenProceso); // Agregamos a cola de Listos
          console.log(`--> NUEVO a LISTO: "${imagenProceso.proceso.nombre}" en t${this.tiempo}`);
          return false; // Retiramos proceso de cola de Nuevos
        } else { // Si no ha finalizado su tip
          imagenProceso.tip -= 1; // Consumimos una unidad
          return true; // Se mantiene en la cola de Nuevos
        }
      });
    }
  }

  determinarSiguiente() {
    this.politica.determinarSiguiente(this);
  }

  liberarProcesador(imagenProceso) {
    this.politica.liberarProcesador(imagenProceso, this);
  }

  pasarAlSiguienteTiempo() {
    this.tiempo += 1; // Incrementar en uno el tiempo t
    this.colaListos.forEach(imagenProceso => { // Aumentamos en uno el tiempo Listo
      imagenProceso.tListo += 1;
    });
  }

  seCambiaProceso(imagenProceso) {
    return this.politica.seCambiaProceso(imagenProceso);
  }

  mostrarInformacion(funcion) {
    console.log("NUEVOS: ");
    this.colaNuevos.forEach(imagenProceso => {
      funcion(imagenProceso);
    });
    console.log("LISTOS");
    this.colaListos.forEach(imagenProceso => {
      funcion(imagenProceso);
    });
    console.log("EJECUTANDO")
    if(this.procesador.procesoEnEjecucion != null) { funcion(this.procesador.procesoEnEjecucion); }
    console.log("BLOQUEADOS");
    this.colaBloqueados.forEach(imagenProceso => {
      funcion(imagenProceso);
    });
    console.log("FINALIZANDO (ejecutando TFP)");
    this.colaFinalizando.forEach(imagenProceso => {
      funcion(imagenProceso);
    });
    console.log("FINALIZADOS");
    this.colaFinalizados.forEach(imagenProceso => {
      funcion(imagenProceso);
    });

    let nombreYestado = function (imagenProceso) {
      console.log(imagenProceso.proceso.nombre, imagenProceso.estado);
    }
    
    let imagen = function (imagenProceso) {
      console.log(imagenProceso.proceso);
      console.log("TIP:", imagenProceso.tip);
      console.log("TCP:", imagenProceso.tcp);
      console.log("TFP:", imagenProceso.tfp);
      console.log("ESTADO:", imagenProceso.estado);
      console.log("Ráfagas Restantes:", imagenProceso.rafagasRestantes);
      console.log("Unidades Restantes Ráfaga CPU:", imagenProceso.unidadesRestantesRafagaCPU);
      console.log("Tiempo Bloqueado:", imagenProceso.tBloqueado);
      console.log("Tiempo de inicio:", imagenProceso.tInicio);
      console.log("Tiempo Listo:", imagenProceso.tListo);
      console.log("Tiempo de finalización:", imagenProceso.tFin);
    } 
    
    let nombre = function(imagenProceso) {
      console.log(imagenProceso.proceso.nombre);
    }  
    

  }

}

class Procesador {
  constructor(tablaSo) {
    this.tablaSo = tablaSo; // Conoce la tabla del SO
    this.procesoEnEjecucion = null;
    this.procesadorLibre = false; // El procesador arranca ocupado (debe iniciar)
    this.tiempoInutil = 0;
    this.inicioTanda = tablaSo.tcp; // El tiempo de inicio es igual al tcp del SO
    this.servicio = true;
    this.tiempoServicio = 0;
    var cambiarEnSiguienteTiempo = false; // Variable bandera
  }

  ejecutar() { 
    if (this.inicioTanda > 0) { // Si recién se inicia la tanda
      this.inicioTanda -= 1; // Se consume una unidad de tiempo 
      this.tiempoServicio += 1; // Incrementamos tiempo de servicio
      console.log("PROCESADOR: Iniciando...");
      if (this.inicioTanda === 0) { // Si es momento de recibir procesos
        //this.procesadorLibre = true;
        console.log("PROCESADOR: Listo. En el siguiente tiempo puede ejecutar ráfaga de proceso.");
      } // Si terminó su inicio
    } else if (this.procesoEnEjecucion != null && // Si hay un proceso cargado
      this.tablaSo.politica.seCambiaProceso(this.procesoEnEjecucion)) { // y debe cambiarse
        if (this.procesoEnEjecucion.tcp > 0) { // Si está cambiando de proceso aún
          console.log(`PROCESADOR: Retirando "${this.procesoEnEjecucion.proceso.nombre}"`, );
          this.procesoEnEjecucion.tcp -= 1; // Consumimos una unidad de tiempo
        } 
        if (this.procesoEnEjecucion.tcp === 0){
          this.tablaSo.liberarProcesador(this.procesoEnEjecucion); // Según política
        }
      } else if(this.procesoEnEjecucion != null && // Si hay un proceso cargado
      !this.tablaSo.politica.seCambiaProceso(this.procesoEnEjecucion)) {// y no debe cambiarse   
        if (this.procesoEnEjecucion.unidadesRestantesRafagaCPU != 0) { // Aún tiene ráfagas por ejecutar
          console.log(`PROCESADOR: Ejecutando "${this.procesoEnEjecucion.proceso.nombre}"`);
          this.procesoEnEjecucion.unidadesRestantesRafagaCPU -= 1; // Se consume una unidad de tiempo
        }
      } else { // Si no hay nada para ejecutar
        console.log("PROCESADOR: Ocioso");
        this.tiempoInutil += 1;
      }
    }
 
  }

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

class FirstComeFirstServed {
  seCambiaProceso(imagenProceso) {
   //console.log("¿Es momento de cambiar proceso", imagenProceso.proceso.nombre, "?");
   return imagenProceso.unidadesRestantesRafagaCPU <= 0; // ¿Ha finalizado su ráfaga?
  }

  verificarBloqueados(tablaSo) {
    if(tablaSo.colaBloqueados.length != 0) { // Si hay procesos bloqueados
      tablaSo.colaBloqueados = tablaSo.colaBloqueados // se construye una nueva cola verificando
      .filter( imagenProceso => { // para cada proceso
        if(imagenProceso.unidadesRestantesRafagaES != 0) {// si no ha finalizado su ráfaga de ES
          imagenProceso.unidadesRestantesRafagaES -= 1; // Consumimos una unidad
          imagenProceso.tBloqueado += 1; // Incrementamos tiempo Bloqueado
          return true; // Se mantiene Bloqueado
        } else { // si ha finalizado su rafaga de ES
          if(imagenProceso.rafagasRestantes > 1) { // Si aún le quedan ráfagas
            imagenProceso.rafagasRestantes -= 1; // Consumimos una unidad
            imagenProceso.tcp = tablaSo.tcp; // Reiniciamos tcp de ráfaga
            imagenProceso.estado = tablaSo.estados.LISTO; // Cambiar estado
            imagenProceso.unidadesRestantesRafagaCPU = imagenProceso.proceso.duracionRafagasCPU; // Reiniciar unidades
            tablaSo.colaListos.push(imagenProceso); // Agregamos a cola de Listos
            console.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}" en t${tablaSo.tiempo}`);
          } else {
            imagenProceso.estado = tablaSo.estados.FINALIZANDO; // Cambiar estado
            tablaSo.colaFinalizando.push(imagenProceso); // Agregamos a cola de Listos
            console.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
          }
          return false; // Lo sacamos de la cola de Bloqueados
        } 
      } );
    }
  }

  determinarSiguiente(tablaSo) {
    // Como el procesador es quien demanda a la política que libere el procesador, corroboramos
    if (tablaSo.procesador.procesoEnEjecucion === null && tablaSo.colaListos.length != 0) { // Debería el procesador nulear el proceso al finalizar ráfaga
      tablaSo.procesador.procesoEnEjecucion = tablaSo.colaListos.shift(); // Seleccionamos el primer elemento
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.EJECUTANDO; // Cambiar estado
      console.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}" en t${tablaSo.tiempo}`);
    }
  }

  liberarProcesador(imagenProceso, tablaSo) {
    console.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
    tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.BLOQUEADO; // Cambiar estado
    tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaES = tablaSo.procesador.procesoEnEjecucion.proceso.duracionRafagasES; 
    tablaSo.colaBloqueados.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Bloqueados
    tablaSo.procesador.procesoEnEjecucion = null;
  }

}

class Utilidad {
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




