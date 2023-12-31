/*
Autor: Paradiso, Cayetano Simón
Fecha: 2023-10-28
*/

let tandaProcesos = []; // Variable Global

// Acceder al archivo subido por el usuario
document.getElementById("processFile").addEventListener("click", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  let seccion = document.getElementById("ingresos");
  if (seccion) { // Borrar todo lo que haya, si había algo, al procesar el nuevo archivo
    let siguienteElemento = seccion.nextElementSibling;
    while (siguienteElemento) {
        const toRemove = siguienteElemento;
        siguienteElemento = siguienteElemento.nextElementSibling;
        toRemove.remove();
    }
}
  // Obtener el archivo subido (no aceptamos más de uno)
  const archivoSeleccionado = document.getElementById("inputFile").files[0];
  if (archivoSeleccionado) { // Si el archivo existe
    procesarArchivo(archivoSeleccionado); // se procesa
  }
})

// Disparar Procesamiento de Tanda
document.getElementById("startSimulation").addEventListener("click", function (e) {
  e.preventDefault(); // Evitar que la página se actualice luego del submit
  if (window.getComputedStyle(document.getElementById("datosTandaIngresada")).display != "none") { // Si el archivo ha sido procesado
    const valoresObtenidos = obtenerDatosSO(); // Obtener parámetros SO ingresados por el usuario
    const datosSo = new TablaSo(valoresObtenidos.politica, valoresObtenidos.valorTip, 
                         valoresObtenidos.valorTfp, valoresObtenidos.valorTcp,
                         valoresObtenidos.valorQuantum); // Crear Tabla de SO de acuerdo a los valores
    simularProcesamiento(datosSo);
    mostrarResultados(datosSo);
    document.getElementById(`gant${Auditor.simulaciones}`).scrollIntoView({ behavior: 'smooth' });
    Auditor.simulaciones += 1; // Incrementar cantidad de simulaciones
  } else {
    alert("Antes de Simular debe Procesar un archivo.");
  }
})

// Procesar archivo
function procesarArchivo(archivo) {
  const lector = new FileReader(); // Permite manipular archivos asincrónicamente
  lector.readAsText(archivo); // Leer el archivo como texto
  lector.onload = function (event) { // Una vez que el archivo carga completamente, 
    const contenidoArchivo = event.target.result; // Obtener contenido tipo String
    tandaProcesos = toArray(contenidoArchivo); // Convertir contenido a Array de Objetos
    if (tandaProcesos !=  [] ) { // Si la tanda no está vacía, trabajamos
      const tabla = crearTabla(archivo.name); // Crear tabla con nombre del archivo
      agregarItemsTabla(tabla, tandaProcesos); // agregar trabajos del archivo a la tanda
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
function crearTabla(nombreArchivo) {
  // Crear tabla, caption, separador y fila de encabezados
  const tablaProcesos = document.createElement("table");
  const captionTabla = document.createElement("caption");
  captionTabla.innerHTML = `Datos obtenidos del archivo ${nombreArchivo}`;
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
    case "SJN (Shortest Job Next)" :
      politica = new ShortestJobNext();
      break;
    case "SRT (Shortest Remaining Time)" :
      politica = new ShortestRemainingTime();
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

// Bucle de lógica Principal
function simularProcesamiento(tablaSo) {

  AnimacionTiempoReal.iniciarGrafico();
  
  do {
    console.log();
    console.log(`%c-------- EVENTOS SUCEDIDOS EN EL TIEMPO ${tablaSo.tiempo} --------`, 
    "color: green; font-weight: bold");
    console.log();

    Auditor.log();
    Auditor.log(`-------- EVENTOS SUCEDIDOS EN EL TIEMPO ${tablaSo.tiempo} --------`);
    Auditor.log();

    tablaSo.verificarArrivos();

    tablaSo.verificarBloqueados();

    tablaSo.verificarFinalizaciones();

    tablaSo.verificarListos();

    tablaSo.determinarSiguiente();

    tablaSo.ejecutar();

    AnimacionTiempoReal.generarTGrafico(tablaSo);
    
    tablaSo.pasarAlSiguienteTiempo(); 

  } while (tandaProcesos.length != tablaSo.colaFinalizados.length);

}

// Mostrar Resultados en pantalla y habilitar descarga de eventos
function mostrarResultados(tablaSo) {
  const seccionResultados = document.createElement("section"); // crear sección Resultados
  seccionResultados.id = `resultados${Auditor.simulaciones}`; // Asignar id
  const campoDatos = document.createElement("fieldset"); // crear campo de datos

  // const tablaSeguimiento = AnimacionTiempoReal.iniciarGrafico();
  const tablaCabecera = crearCabeceraResultados(tablaSo);
  const tablaIndicadoresProceso = crearTablaIndicadoresProceso(tablaSo.colaFinalizados);
  const tablaIndicadoresTanda = crearTablaIndicadoresTanda(tablaSo);
  const tablaIndicadoresCPU = crearTablaIndicadoresCPU(tablaSo);
  
  campoDatos.appendChild(tablaCabecera); // agregar cabecera simulación
  campoDatos.appendChild(document.createElement("br")); // // agregar un salto de línea
  campoDatos.appendChild(tablaIndicadoresProceso); // agregar tablaProcesos campo de datos
  campoDatos.appendChild(document.createElement("br")); // agregar un salto de línea
  campoDatos.appendChild(tablaIndicadoresTanda); // agregar tablaTanda campo de datos
  campoDatos.appendChild(document.createElement("br")); // agregar un salto de línea
  campoDatos.appendChild(tablaIndicadoresCPU); // agregar tablaTanda campo de datos
  campoDatos.appendChild(document.createElement("br")); // agregar un salto de línea
  
  const botonDescarga = document.createElement("button"); // crear botón descarga
  botonDescarga.id = "botonDescargaResultados"; 
  botonDescarga.innerHTML = "Descargar";
  const contenedorBotonDescarga = document.createElement("div"); // crear contenedor botón
  contenedorBotonDescarga.id = `descargar${Auditor.simulaciones}`; // Cada botón descargar asociado a una simualción
  contenedorBotonDescarga.classList.add("descargar");
  contenedorBotonDescarga.appendChild(botonDescarga); // agregar botón a contenedor

  campoDatos.appendChild(contenedorBotonDescarga);
  seccionResultados.appendChild(campoDatos);
  document.body.appendChild(seccionResultados);
  Auditor.toHtml(tablaSo.politica); // Mostrar botón de descarga de los resultados

}

// Crear tabla HTML de indicadores Proceso
function crearTablaIndicadoresProceso(procesosFinalizados) {
  const tablaProcesos = document.createElement("table"); // crear tabla
  const caption = document.createElement("caption"); // crear caption
  caption.innerHTML = "Indicadores de Proceso";

  const filaEncabezados = document.createElement("tr"); // crear fila de tabla
  const encabezadoIdProceso = document.createElement("th"); // crear encabezado Id Proceso
  encabezadoIdProceso.innerHTML = "Id Proceso";
  const encabezadoTrProceso = document.createElement("th"); // crear encabezado Tiempo de Retorno de Proceso
  encabezadoTrProceso.innerHTML = "Tiempo de Retorno";
  const encabezadoTrnProceso = document.createElement("th"); // crear encabezado Tiempo de Retorno Normalizado
  encabezadoTrnProceso.innerHTML = "Tiempo de Retorno Normalizado";
  const encabezadoTListoProceso = document.createElement("th"); // crear encabezado Tiempo Listo de Proceso
  encabezadoTListoProceso.innerHTML = "Tiempo en Estado de Listo";
  filaEncabezados.appendChild(encabezadoIdProceso);
  filaEncabezados.appendChild(encabezadoTrProceso);
  filaEncabezados.appendChild(encabezadoTrnProceso);
  filaEncabezados.appendChild(encabezadoTListoProceso);
  tablaProcesos.appendChild(filaEncabezados);
  tablaProcesos.appendChild(caption);

  for (var imagenProceso of procesosFinalizados) { // por cada una de las imágenes del proceso
    const filaTabla = document.createElement("tr"); // crear fila de tabla
    const id = document.createElement("td"); // crear columna id
    id.innerHTML = imagenProceso.proceso.nombre; // cargar nombre Proceso
    filaTabla.appendChild(id); // agregar a la fila
    const tr = document.createElement("td"); // crear columna Tiempo de Retorno
    tr.innerHTML = UtilidadCalculos.calcularTRp(imagenProceso); // cargar nombre Proceso
    filaTabla.appendChild(tr); // agregar a la fila
    const trn = document.createElement("td"); // crear columna Tiempo de Retorno Normalizado
    trn.innerHTML = UtilidadCalculos.calcularTRNp(imagenProceso); // cargar Tiempo de Retorno Normalizado
    filaTabla.appendChild(trn); // agregar a la fila
    const tel = document.createElement("td"); // crear columna Tiempo Estado Listo
    tel.innerHTML = UtilidadCalculos.calcularTEL(imagenProceso); // cargar Tiempo Estado Listo
    filaTabla.appendChild(tel); // agregar a la fila
    tablaProcesos.appendChild(filaTabla); // agregar fila a la tabla
  }
  return tablaProcesos;
  }

// Crear tabla HTML de indicadores Tanda
function crearTablaIndicadoresTanda(tablaSo) {
  const tablaTanda = document.createElement("table"); // crear tabla
  const caption = document.createElement("caption"); // crear caption
  caption.innerHTML = "Indicadores de Tanda";

  const filaEncabezados = document.createElement("tr"); // crear fila de tabla
  const encabezadoTRTanda = document.createElement("th"); // crear encabezado Tiempo de Retorno Tanda
  encabezadoTRTanda.innerHTML = "Tiempo de Retorno Tanda";
  const encabezadoTMRTanda = document.createElement("th"); // crear encabezado Tiempo Medio de Retorno de Tanda
  encabezadoTMRTanda.innerHTML = "Tiempo Medio de Retorno Tanda";
  filaEncabezados.appendChild(encabezadoTRTanda);
  filaEncabezados.appendChild(encabezadoTMRTanda);
  tablaTanda.appendChild(filaEncabezados);
  tablaTanda.appendChild(caption);

  const filaDatos = document.createElement("tr");
  const datoTRT = document.createElement("td");
  datoTRT.innerHTML = UtilidadCalculos.calcularTiempoRetornoTanda(tablaSo);
  const datoTMRT = document.createElement("td");
  datoTMRT.innerHTML = UtilidadCalculos.calcularTiempoMedioRetornoTanda(tablaSo.colaFinalizados);
  filaDatos.appendChild(datoTRT);
  filaDatos.appendChild(datoTMRT);
  tablaTanda.appendChild(filaDatos);

  return tablaTanda;
  }  

// Crear tabla HTML de indicadores CPU
function crearTablaIndicadoresCPU(tablaSo) {
  const tablaCPU = document.createElement("table"); // crear tabla
  const caption = document.createElement("caption"); // crear caption
  caption.innerHTML = "Indicadores de CPU";

  const filaEncabezados = document.createElement("tr"); // crear fila de tabla
  const encabezadoCPUInutil = document.createElement("th"); // crear encabezado Tiempo CPU Inútil
  encabezadoCPUInutil.innerHTML = "Tiempo CPU Inútil";
  const encabezadoCPUServicio = document.createElement("th"); // crear encabezado Tiempo Servicio CPU
  encabezadoCPUServicio.innerHTML = "Tiempo Servicio CPU";
  const encabezadoCPUUtilAbsoluto = document.createElement("th"); // crear encabezado Tiempo CPU Útil Absoluto
  encabezadoCPUUtilAbsoluto.innerHTML = "Tiempo CPU Útil (Absoluto)";
  const encabezadoCPUUtilPorcentual = document.createElement("th"); // crear encabezado Tiempo CPU Útil Porcentaje
  encabezadoCPUUtilPorcentual.innerHTML = "Tiempo CPU Útil (Porcentaje)";
  filaEncabezados.appendChild(encabezadoCPUInutil);
  filaEncabezados.appendChild(encabezadoCPUServicio);
  filaEncabezados.appendChild(encabezadoCPUUtilAbsoluto);
  filaEncabezados.appendChild(encabezadoCPUUtilPorcentual);
  tablaCPU.appendChild(filaEncabezados);
  tablaCPU.appendChild(caption);

  const filaTabla = document.createElement("tr"); // crear fila de tabla
  const inutil = document.createElement("td"); // crear columna inutil
  inutil.innerHTML = UtilidadCalculos.calcularTiempoCpuDesocupada(tablaSo.procesador);
  filaTabla.appendChild(inutil); // agregar a la fila
  
  const servicio = document.createElement("td"); // crear columna servicio
  servicio.innerHTML = UtilidadCalculos.calcularTiempoServicio(tablaSo.procesador);
  filaTabla.appendChild(servicio); // agregar a la fila
  
  const utilAbsoluto = document.createElement("td"); // crear columna util absoluto
  utilAbsoluto.innerHTML = UtilidadCalculos.calcularTiempoUtilCPUAbsoluto(tablaSo.colaFinalizados);
  filaTabla.appendChild(utilAbsoluto); // agregar a la fila
  
  const utilPorcentaje = document.createElement("td"); // crear columna util porventaje
  utilPorcentaje.innerHTML = UtilidadCalculos.calcularTiempoUtilCPUPorcentual(tablaSo);
  filaTabla.appendChild(utilPorcentaje); // agregar a la fila

  tablaCPU.appendChild(filaTabla); // agregar fila a la tabla
  
  return tablaCPU;
}  

// Crear cabecera de resultados
function crearCabeceraResultados(tablaSo) {
  const tablaCabecera = document.createElement("table"); // crear tabla

  const filaEncabezados = document.createElement("tr"); // crear fila de tabla
  const encabezadoPolitica = document.createElement("th"); // crear encabezado Política
  encabezadoPolitica.innerHTML = "Política";
  const encabezadoTIP = document.createElement("th"); // crear encabezado TIP
  encabezadoTIP.innerHTML = "TIP";
  const encabezadoTCP = document.createElement("th"); // crear encabezado TCP
  encabezadoTCP.innerHTML = "TCP";
  const encabezadoTFP = document.createElement("th"); // crear encabezado TFP
  encabezadoTFP.innerHTML = "TFP";
  const encabezadoQuantum = document.createElement("th"); // crear encabezado Quantum
  encabezadoQuantum.innerHTML = "Quantum";

  filaEncabezados.appendChild(encabezadoPolitica);
  filaEncabezados.appendChild(encabezadoTIP);
  filaEncabezados.appendChild(encabezadoTCP);
  filaEncabezados.appendChild(encabezadoTFP);
  if(tablaSo.politica.constructor.name === "RoundRobin") { filaEncabezados.appendChild(encabezadoQuantum); }

  const filaDatos = document.createElement("tr"); // crear fila de tabla
  const politica = document.createElement("td"); // crear columna Política
  politica.innerHTML = tablaSo.politica.constructor.name;
  const tip = document.createElement("td"); // crear columna TIP
  tip.innerHTML = tablaSo.tip;
  const tcp = document.createElement("td"); // crear columna TCP
  tcp.innerHTML = tablaSo.tcp;
  const tfp = document.createElement("td"); // crear columna TFP
  tfp.innerHTML = tablaSo.tfp;
  const quantum = document.createElement("td"); // crear columna Quantum
  quantum.innerHTML = tablaSo.quantum;

  filaDatos.appendChild(politica);
  filaDatos.appendChild(tip);
  filaDatos.appendChild(tcp);
  filaDatos.appendChild(tfp);
  if(tablaSo.politica.constructor.name === "RoundRobin") { filaDatos.appendChild(quantum); } 


  tablaCabecera.appendChild(filaEncabezados);
  tablaCabecera.appendChild(filaDatos);

  return tablaCabecera;
}

class TablaSo {
  constructor(valorPolitica, valorTip, valorTfp, valorTcp, valorQuantum) {
    this.tip = valorTip; 
    this.tfp = valorTfp; 
    this.tcp = valorTcp;
    this.quantum = valorQuantum;
    this.tiempo = 0;
    this.procesosArrivados = 0;
    this.inicio = 0;
    this.fin = 0;
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
    FINALIZANDO: "Terminando",
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
            if(this.colaFinalizados.length === tandaProcesos.length) { // Si finaliza el último proceso
              this.fin = this.tiempo;
            }
            console.log(`--> FINALIZANDO a FINALIZADO: "${imagenProceso.proceso.nombre}"`);// en t${this.tiempo}`);
            Auditor.log(`--> FINALIZANDO a FINALIZADO: "${imagenProceso.proceso.nombre}"`);// en t${this.tiempo}`);
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
            "tLlegadaListo" : 0, // Marca de tiempo más recientemente agregado a Listos 
            "tFin" : 0 // Marca de tiempo de Fin
          }
          if(this.procesosArrivados === 0) { this.inicio = this.tiempo; } // Establecemos inicio de tanda
          this.procesosArrivados += 1; // Incrementamos los procesos arrivados
          console.log(`--> a NUEVO: "${imagenProceso.proceso.nombre}"`);// en t${this.tiempo}`);
          Auditor.log(`--> a NUEVO: "${imagenProceso.proceso.nombre}"`);// en t${this.tiempo}`);
          this.colaNuevos.push(imagenProceso);
          AnimacionTiempoReal.registrarProceso(imagenProceso); // Registramos el proceso seguimiento
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
          imagenProceso.tLlegadaListo = this.tiempo; // Registramos ingreso a Listos
          this.colaListos.push(imagenProceso); // Agregamos a cola de Listos
          console.log(`--> NUEVO a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${this.tiempo}`);
          Auditor.log(`--> NUEVO a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${this.tiempo}`);
          return false; // Retiramos proceso de cola de Nuevos
        } else { // Si no ha finalizado su tip
          imagenProceso.tip -= 1; // Consumimos una unidad
          return true; // Se mantiene en la cola de Nuevos
        }
      });
      if(this.politica.constructor.name === "PrioridadExterna" ||
         this.politica.constructor.name === "ShortestJobNext" ||
         this.politica.constructor.name === "ShortestRemainingTime") {
        this.politica.ordenarListos(this.colaListos); // Cada política ordena su cola de Listos
      }
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


}

class Procesador {
  constructor(tablaSo) {
    this.tablaSo = tablaSo; // Conoce la tabla del SO
    this.procesoEnEjecucion = null;
    this.tiempoInutil = 0;
    this.inicioTanda = tablaSo.tcp; // El tiempo de inicio que necesita es igual al tcp del SO
    this.tiempoServicio = 0;
    this.quantum = tablaSo.quantum; // El quantum inicial es igual al brindado por el usuario
    this.estado = this.estados.SERVICIO;
  }

  estados = {
    SERVICIO: "Servicio",
    EJECUTANDO: "Ejecutando",
    OCIOSO: "Ocioso"
  }

  ejecutar() { 
    if (this.inicioTanda > 0) { // Si recién se inicia la tanda
      this.inicioTanda -= 1; // Se consume una unidad de tiempo 
      this.tiempoServicio += 1; // Incrementamos tiempo de servicio
      this.estado = this.estados.SERVICIO;
      console.log("--> PROCESADOR: Iniciando...");
      Auditor.log("--> PROCESADOR: Iniciando...");
      if (this.inicioTanda === 0) { // Si es momento de recibir procesos
        console.log("--> PROCESADOR: Listo. En el siguiente tiempo puede ejecutar ráfaga de proceso.");
        Auditor.log("--> PROCESADOR: Listo. En el siguiente tiempo puede ejecutar ráfaga de proceso.");
      } // Si terminó su inicio
    } else if (this.procesoEnEjecucion != null && // Si hay un proceso cargado
      this.tablaSo.politica.seCambiaProceso(this)) { // y debe cambiarse
        if (this.procesoEnEjecucion.tcp > 0) { // Si está cambiando de proceso aún
          console.log(`--> PROCESADOR: Retirando "${this.procesoEnEjecucion.proceso.nombre}"`, );
          Auditor.log(`--> PROCESADOR: Retirando "${this.procesoEnEjecucion.proceso.nombre}"`, );
          this.estado = this.estados.SERVICIO;
          this.procesoEnEjecucion.tcp -= 1; // Consumimos una unidad de tiempo
          this.tiempoServicio += 1; // Incrementamos tiempo de servicio
        } 
        if (this.procesoEnEjecucion.tcp === 0){
          this.tablaSo.liberarProcesador(this.procesoEnEjecucion); // Según política
          this.quantum = this.tablaSo.quantum; // Reiniciamos el quantum
        }
      } else if(this.procesoEnEjecucion != null && // Si hay un proceso cargado
      !this.tablaSo.politica.seCambiaProceso(this)) {// y no debe cambiarse   
        if (this.procesoEnEjecucion.unidadesRestantesRafagaCPU != 0) { // Aún tiene ráfagas por ejecutar
          console.log(`--> PROCESADOR: Ejecutando "${this.procesoEnEjecucion.proceso.nombre}"`);
          Auditor.log(`--> PROCESADOR: Ejecutando "${this.procesoEnEjecucion.proceso.nombre}"`);
          this.procesoEnEjecucion.unidadesRestantesRafagaCPU -= 1; // Se consume una unidad de tiempo
          this.quantum -= 1;
          this.estado = this.estados.EJECUTANDO;
        }
      } else { // Si no hay nada para ejecutar
        console.log("--> PROCESADOR: Ocioso");
        Auditor.log("--> PROCESADOR: Ocioso");
        this.tiempoInutil += 1;
        this.estado = this.estados.OCIOSO;
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
  seCambiaProceso(procesador) {
   return procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU <= 0; // ¿Ha finalizado su ráfaga?
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
            console.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
          } else {
            imagenProceso.estado = tablaSo.estados.FINALIZANDO; // Cambiar estado
            tablaSo.colaFinalizando.push(imagenProceso); // Agregamos a cola de Listos
            console.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
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
      console.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
      Auditor.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
    }
  }

  liberarProcesador(imagenProceso, tablaSo) {
    console.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
    Auditor.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
    tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.BLOQUEADO; // Cambiar estado
    tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaES = tablaSo.procesador.procesoEnEjecucion.proceso.duracionRafagasES; 
    tablaSo.colaBloqueados.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Bloqueados
    tablaSo.procesador.procesoEnEjecucion = null;
  }

}

class RoundRobin {
  seCambiaProceso(procesador) {
    return procesador.quantum === 0 || procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU === 0;  
  }

  verificarBloqueados(tablaSo) { // IGUAL QUE FCFS
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
            console.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
          } else {
            imagenProceso.estado = tablaSo.estados.FINALIZANDO; // Cambiar estado
            tablaSo.colaFinalizando.push(imagenProceso); // Agregamos a cola de Listos
            console.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
          }
          return false; // Lo sacamos de la cola de Bloqueados
        } 
      } );
    }
  }

  determinarSiguiente(tablaSo) { // IGUAL QUE FCFS
    // Como el procesador es quien demanda a la política que libere el procesador, corroboramos
    if (tablaSo.procesador.procesoEnEjecucion === null && tablaSo.colaListos.length != 0) { // Debería el procesador nulear el proceso al finalizar ráfaga
      tablaSo.procesador.procesoEnEjecucion = tablaSo.colaListos.shift(); // Seleccionamos el primer elemento
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.EJECUTANDO; // Cambiar estado
      console.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
      Auditor.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
    }
  }

  liberarProcesador(imagenProceso, tablaSo) { 
    if(imagenProceso.unidadesRestantesRafagaCPU > 0) { // Si no ha terminado su ráfaga
      console.log(`--> EJECUTANDO a LISTO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      Auditor.log(`--> EJECUTANDO a LISTO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.LISTO; // Cambiar estado
      imagenProceso.tcp = tablaSo.tcp; // Reiniciamos tcp de ráfaga
      tablaSo.colaListos.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Listos
      tablaSo.procesador.procesoEnEjecucion = null;
    } else { // Si ha terminado su ráfaga
      console.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      Auditor.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.BLOQUEADO; // Cambiar estado
      tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaES = tablaSo.procesador.procesoEnEjecucion.proceso.duracionRafagasES; 
      tablaSo.colaBloqueados.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Bloqueados
      tablaSo.procesador.procesoEnEjecucion = null;
    }
  }
}

class ShortestJobNext {
  ordenarListos(colaListos) {
    colaListos.sort((a, b) => (a.proceso.duracionRafagasCPU - b.proceso.duracionRafagasCPU));
  }

  seCambiaProceso(procesador) { 
   return procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU <= 0; // ¿Ha finalizado su ráfaga?
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
            this.ordenarListos(tablaSo.colaListos); // Ordenar la cola de Listos
            console.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
          } else {
            imagenProceso.estado = tablaSo.estados.FINALIZANDO; // Cambiar estado
            tablaSo.colaFinalizando.push(imagenProceso); // Agregamos a cola de Listos
            console.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
          }
          return false; // Lo sacamos de la cola de Bloqueados
        } 
      } );
    }
  }

  determinarSiguiente(tablaSo) { 
    // Como el procesador es quien demanda a la política que libere el procesador, corroboramos
    if (tablaSo.procesador.procesoEnEjecucion === null && tablaSo.colaListos.length != 0) { // Debería el procesador nulear el proceso al finalizar ráfaga
      this.ordenarListos(tablaSo.colaListos); // Ordenar la cola de Listos
      tablaSo.procesador.procesoEnEjecucion = tablaSo.colaListos.shift(); // Asignamos al procesador el primer elemento
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.EJECUTANDO; // Cambiar estado
      console.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
      Auditor.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
    }
  }

  liberarProcesador(imagenProceso, tablaSo) { 
    console.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
    Auditor.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
    tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.BLOQUEADO; // Cambiar estado
    tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaES = tablaSo.procesador.procesoEnEjecucion.proceso.duracionRafagasES; 
    tablaSo.colaBloqueados.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Bloqueados
    tablaSo.procesador.procesoEnEjecucion = null;
  }

}

class ShortestRemainingTime { // Consultar con Luis porque las rafagas son todas iguales, no hay que calcular
  ordenarListos(colaListos) {
    colaListos.sort((a, b) => (a.unidadesRestantesRafagaCPU - b.unidadesRestantesRafagaCPU));
  }
  
  seCambiaProceso(procesador) { 
    var procesosRecienListos = procesador.tablaSo.colaListos.filter( proceso => // Determinar nuevos LISTOS
      proceso.tLlegadaListo ===  procesador.tablaSo.tiempo); // Si se suma en este tiempo
    if (procesosRecienListos.length != 0) { // Si hay recién llegados a Listos
      var rafagaMasCortaDeListos = procesosRecienListos.reduce((minimo, proceso) =>  // Elegir la ráfaga más corta
      (proceso.unidadesRestantesRafagaCPU < minimo.unidadesRestantesRafagaCPU ? proceso : minimo), procesosRecienListos[0]); // tomando como referencia el primer proceso de la cola de listos
      return rafagaMasCortaDeListos.unidadesRestantesRafagaCPU < procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU 
        || procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU === 0;
    } else {
      return procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU === 0 ||
        procesador.procesoEnEjecucion.tcp != procesador.tablaSo.tcp;  
    }
  }

  verificarBloqueados(tablaSo) { // Igual que FCFS
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
            this.ordenarListos(tablaSo.colaListos); // Ordenar cola de Listos
            console.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
          } else {
            imagenProceso.estado = tablaSo.estados.FINALIZANDO; // Cambiar estado
            tablaSo.colaFinalizando.push(imagenProceso); // Agregamos a cola de Listos
            console.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
          }
          return false; // Lo sacamos de la cola de Bloqueados
        } 
      } );
    }
  }

  determinarSiguiente(tablaSo) { // Igual que SJN
    // Como el procesador es quien demanda a la política que libere el procesador, corroboramos
    this.ordenarListos(tablaSo.colaListos); // Ordenar cola de Listos
    if (tablaSo.procesador.procesoEnEjecucion === null && tablaSo.colaListos.length != 0) { // Debería el procesador nulear el proceso al finalizar ráfaga
      var siguienteProceso = tablaSo.colaListos.reduce((minimo, proceso) =>  // Elegir la ráfaga más corta
        (proceso.unidadesRestantesRafagaCPU < minimo.unidadesRestantesRafagaCPU ? proceso : minimo), tablaSo.colaListos[0]); // tomando como referencia el primer proceso de la cola de listos
      tablaSo.procesador.procesoEnEjecucion = siguienteProceso; // Asignamos al procesador
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.EJECUTANDO; // Cambiar estado
      tablaSo.colaListos.splice(tablaSo.colaListos.indexOf(siguienteProceso), 1); // Sacamos de cola de Listos el proceso
      console.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
      Auditor.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
    }
  }

  liberarProcesador(imagenProceso, tablaSo) { // Igual que RR
    if(imagenProceso.unidadesRestantesRafagaCPU > 0) { // Si no ha terminado su ráfaga
      console.log(`--> EJECUTANDO a LISTO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      Auditor.log(`--> EJECUTANDO a LISTO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.LISTO; // Cambiar estado
      imagenProceso.tcp = tablaSo.tcp; // Reiniciamos tcp de ráfaga
      tablaSo.colaListos.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Listos
      tablaSo.procesador.procesoEnEjecucion = null;
      this.ordenarListos(tablaSo.colaListos); // Ordenar cola de Listos
    } else { // Si ha terminado su ráfaga
      console.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      Auditor.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.BLOQUEADO; // Cambiar estado
      tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaES = tablaSo.procesador.procesoEnEjecucion.proceso.duracionRafagasES; 
      tablaSo.colaBloqueados.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Bloqueados
      tablaSo.procesador.procesoEnEjecucion = null;
    }
  }
}

class PrioridadExterna {
  ordenarListos(colaListos) {
    colaListos.sort((a, b) => (b.proceso.prioridad - a.proceso.prioridad));
  }

  seCambiaProceso(procesador) {
    if(procesador.tablaSo.colaListos.length != 0 &&
      procesador.tablaSo.colaListos[0].proceso.prioridad > procesador.procesoEnEjecucion.proceso.prioridad &&
      procesador.tablaSo.colaListos[0].tLlegadaListo === procesador.tablaSo.tiempo) {
        console.log("Cambiar proceso");
        return true;
    } else {
      // console.log("No cumple condiciones por prioridad");
      return procesador.procesoEnEjecucion.unidadesRestantesRafagaCPU === 0 ||  // Si termina su rafaga, ó
        procesador.procesoEnEjecucion.tcp != procesador.tablaSo.tcp; // Si se está retirando
      }
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
            imagenProceso.tLlegadaListo = tablaSo.tiempo; // Actualizamos último arribo a Listos
            imagenProceso.estado = tablaSo.estados.LISTO; // Cambiar estado
            imagenProceso.unidadesRestantesRafagaCPU = imagenProceso.proceso.duracionRafagasCPU; // Reiniciar unidades
            tablaSo.colaListos.push(imagenProceso); // Agregamos a cola de Listos
            this.ordenarListos(tablaSo.colaListos);
            console.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a LISTO: "${imagenProceso.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
          } else {
            imagenProceso.estado = tablaSo.estados.FINALIZANDO; // Cambiar estado
            tablaSo.colaFinalizando.push(imagenProceso); // Agregamos a cola de Listos
            console.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
            Auditor.log(`--> BLOQUEADO POR E/S a FINALIZANDO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
          }
          return false; // Lo sacamos de la cola de Bloqueados
        } 
      } );
    }
  }  

  determinarSiguiente(tablaSo) { 
    // Como el procesador es quien demanda a la política que libere el procesador, corroboramos
    if (tablaSo.procesador.procesoEnEjecucion === null && tablaSo.colaListos.length != 0) { // Debería el procesador nulear el proceso al finalizar ráfaga
      var siguienteProceso = tablaSo.colaListos.reduce((maximo, imagenProceso) =>  // Elegir la prioridad más alta
        (imagenProceso.proceso.prioridad > maximo.proceso.prioridad ? imagenProceso : maximo), tablaSo.colaListos[0]); // tomando como referencia el primer proceso de la cola de listos
      tablaSo.procesador.procesoEnEjecucion = siguienteProceso; // Asignamos al procesador
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.EJECUTANDO; // Cambiar estado
      tablaSo.colaListos.splice(tablaSo.colaListos.indexOf(siguienteProceso), 1); // Sacamos de cola de Listos el proceso
      console.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
      Auditor.log(`--> LISTO a EJECUTANDO: "${tablaSo.procesador.procesoEnEjecucion.proceso.nombre}"`);// en t${tablaSo.tiempo}`);
    }
  }

  liberarProcesador(imagenProceso, tablaSo) { 
    if(imagenProceso.unidadesRestantesRafagaCPU > 0) { // Si no ha terminado su ráfaga
      console.log(`--> EJECUTANDO a LISTO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      Auditor.log(`--> EJECUTANDO a LISTO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.LISTO; // Cambiar estado
      imagenProceso.tcp = tablaSo.tcp; // Reiniciamos tcp de ráfaga
      imagenProceso.tLlegadaListo = tablaSo.tiempo; // Actualizamos último arribo a Listos
      tablaSo.colaListos.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Listos
      tablaSo.procesador.procesoEnEjecucion = null;
      this.ordenarListos(tablaSo.colaListos);
    } else { // Si ha terminado su ráfaga
      console.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      Auditor.log(`--> EJECUTANDO a BLOQUEADO: "${imagenProceso.proceso.nombre}" al finalizar t${tablaSo.tiempo}`);
      tablaSo.procesador.procesoEnEjecucion.estado = tablaSo.estados.BLOQUEADO; // Cambiar estado
      tablaSo.procesador.procesoEnEjecucion.unidadesRestantesRafagaES = tablaSo.procesador.procesoEnEjecucion.proceso.duracionRafagasES; 
      tablaSo.colaBloqueados.push(tablaSo.procesador.procesoEnEjecucion); // Agregar a cola de Bloqueados
      tablaSo.procesador.procesoEnEjecucion = null;
    }
  }

}

// Clase para realizar los cálculos de los resultados
class UtilidadCalculos {
    // Tiempo de Retorno de un proceso (TRp): es desde que arriba el proceso hasta 
    // que termina (después de su TFP, incluyendo éste).
    static calcularTRp(imagenProceso) {
      return (imagenProceso.tFin - imagenProceso.tInicio);
    }
    //  Tiempo de retorno normalizado (TRn)= Es el tiempo de Retorno del proceso 
    // dividido el tiempo efectivo de CPU que utilizó.
    static calcularTRNp(imagenProceso) {
      var tiempoCPUtotal = imagenProceso.proceso.rafagasCPU * imagenProceso.proceso.duracionRafagasCPU;
      return `${this.calcularTRp(imagenProceso)} / ${tiempoCPUtotal}`;
    }
    // Suma de los tiempos en la cola de Listos
    static calcularTEL(imagenProceso) {
      return imagenProceso.tListo;
    }
    // Tiempo de retorno de la tanda (TRt)= desde que arriba el primer proceso 
    // hasta que se realiza el último TFP (incluyendo el tiempo de éste).
    static calcularTiempoRetornoTanda(tablaSo) {
      return tablaSo.fin - tablaSo.inicio;
    }
    // Tiempo Medio de retorno de la tanda (TMRt)= la suma de los tiempos de 
    // retorno de los procesos, dividido la cantidad de procesos.
    static calcularTiempoMedioRetornoTanda(procesosFinalizados) {
      var sumaTiemposRetorno = procesosFinalizados.reduce((suma, imagenProceso) => 
        suma + this.calcularTRp(imagenProceso), 0);
      return sumaTiemposRetorno / procesosFinalizados.length;
    }
    // Tiempos de CPU desocupada
    static calcularTiempoCpuDesocupada(procesador) {
      return procesador.tiempoInutil + 1; 
    }
    // Tiempo de CPU utilizada por el SO
    static calcularTiempoServicio(procesador) {
      return procesador.tiempoServicio;
    }
    // Tiempos de CPU utilizada por los procesos (en tiempos absolutos y porcentuales)
    static calcularTiempoUtilCPUAbsoluto(procesosFinalizados) {
      var sumaTiemposCPUProcesos = procesosFinalizados.reduce((suma, imagenProceso) =>
        suma + (imagenProceso.proceso.rafagasCPU * imagenProceso.proceso.duracionRafagasCPU), 0);
      return `${sumaTiemposCPUProcesos}`;
    }
    static calcularTiempoUtilCPUPorcentual(tablaSo) {
      var sumaTiemposCPUProcesos = tablaSo.colaFinalizados.reduce((suma, imagenProceso) =>
        suma + (imagenProceso.proceso.rafagasCPU * imagenProceso.proceso.duracionRafagasCPU), 0);
      return `${(sumaTiemposCPUProcesos / this.calcularTiempoRetornoTanda(tablaSo)* 100).toFixed(2)}%`;
    }


}

// Clase auditora y que escribe en el archivo generado para cada simulación
class Auditor {
  static simulaciones = 0;
  static mensajesLoggeados = []; // Arreglo de mensajes 

  static log(mensaje) {
    if (!this.mensajesLoggeados[this.simulaciones]) { // Si aún no existe esta simulación
      this.mensajesLoggeados[this.simulaciones] = []; // Inicializar el arreglo de mensajes de la simualción actual
    }
    this.mensajesLoggeados[this.simulaciones].push(mensaje); // Agregar mensaje
  }

  static toHtml(politica) {
    // Recuperar logs de la simulacióna ctual
    const logsSimulacionActual = this.mensajesLoggeados[this.simulaciones];
    const tabla = document.getElementById(`salidas${Auditor.simulaciones}`).outerHTML;
    const seccionResultados = document.getElementById(`resultados${Auditor.simulaciones}`).cloneNode(true);
    const fieldset = seccionResultados.querySelector('fieldset');
    var divBoton = fieldset.lastElementChild;
    fieldset.removeChild(divBoton);    

    if(logsSimulacionActual) {

      // Generar archivo Html con el contenido
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Log de eventos de ${politica.constructor.name}</title>
          <style>
          /* GLOBAL STYLES */
            body {
              background-color: #FFB703;
              background-size: cover;
              font-family: 'Times New Roman', Times, serif, sans-serif;
              color: #023047;
              margin: 0;
              padding: 0;
            }

            h2 {
              background-image: url("/fondo.png") no-repeat fixed;
              text-align: center;
              text-shadow: 2px 2px 2px #FB8500;
              font-weight: lighter;
              color: #023047;
              margin: 20px 0;
            }

            table {
              width: 100%;
              text-align: center;
              overflow-x: auto;
              border-collapse: collapse;
              margin: auto;
            }

            th, td {
              border: 1px solid #023047;
              padding: 8px;
            }

            .button {
              background-color: #023047;
              color: #FFB703;
              padding: 10px 20px;
              border: none;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }

            .button:hover {
              background-color: #219EBC;
            }

            .descargar, #descargar {
              display: flex;
              justify-content: center;
            }

            .contenedorAnimacion {
              width: 90%;
              overflow-x: auto;
              margin: auto;
            }

            .contenedorAnimacion table tr td {
              overflow-x: auto;
              width: 100%;
              background-color: #FB8500;
            }

            .tablaGant {
              border-collapse: collapse;
            }

            /* Añadir color para estados específicos */
            /* Estados */
            .contenedorAnimacion table td.nuevo {
              color: #023047;
              background-color: #8ECAE6; 
            }

            .contenedorAnimacion table td.listo {
              color: #023047;
              background-color: #FFB703; 
            }

            .contenedorAnimacion table td.ejecutando {
              color: #023047;
              background-color: #4CAF50; 
            }

            .contenedorAnimacion table td.bloqueado {
              color: #023047;
              background-color: #FF3333; 
            }

            .contenedorAnimacion table td.terminando {
              color: #FFB703;
              background-color: #9C27B0; /* Purple for "Terminando" */
            }

            .contenedorAnimacion table td.finalizado {
              color: #023047;
              background-color: #E0E0E0; /* Light Gray for "Finalizado" */
            }

            /* Procesador */
            .contenedorAnimacion table td.servicio {
              background-color: #2196F3; /* Blue for "Procesador Servicio" */
            }

            .contenedorAnimacion table td.ocioso {
              color: #023047;
              background-color: #757575; /* Gray for "Procesador Ocioso" */
            }

            .contenedorAnimacion table td.defecto {
              color: #023047;
              background-color: #CCCCCC; /* Light Gray for "Defecto" */
            }

            /* RESPONSIVE DESIGN */
            @media (max-width: 768px) {
              /* Add responsive styling here */
            }
          </style>
        </head>
        <body>
          <h1>${politica.constructor.name}</h1>
          ${tabla}
          ${seccionResultados.outerHTML}
          <pre>${logsSimulacionActual.join('<br>')}</pre>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" }); // Crear archivo

      const enlaceDescarga = document.createElement("a"); // crear enlace html
      enlaceDescarga.href = URL.createObjectURL(blob); // vincular enlace a url
      enlaceDescarga.download = `${politica.constructor.name}_${new Date().getUTCDate()
        + 1}${new Date().getMonth() 
        + 1}${new Date().getFullYear()}_${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}.html`; // Nombre del archivo a descargar

      // Disparar un evento de click cuando se clickea el botón de descarga 
      document.getElementById(`descargar${this.simulaciones}`).addEventListener("click", function () {
          enlaceDescarga.click();
      });

    }

  }

}

// Clase generadora de Gant
class AnimacionTiempoReal {
  static procesosActuales = [];

  static registrarProceso(imagenProceso) {
    this.procesosActuales.push(imagenProceso);
  }

  static iniciarGrafico() {
    this.procesosActuales = [];
    const div = document.createElement("div"); // crear sección Resultados
    div.id = `salidas${Auditor.simulaciones}`; // Asignar id
    div.classList.add("contenedorAnimacion");
    const campoDatos = document.createElement("fieldset"); // crear campo de datos
    campoDatos.id = `animaciones${Auditor.simulaciones}`; // Asignar id
    //campoDatos.classList.add("contenedorAnimacion");
    
    const tablaGant = document.createElement("table"); // Crear tabla
    tablaGant.classList.add("tablaGant");
    const filaTiempo = document.createElement("tr"); // Crear fila tiempo
    const datoTiempo = document.createElement("td"); // Crear dato tiempo
    const filaCPU = document.createElement("tr"); // Crear fila tiempo
    const datoCPU = document.createElement("td"); // Crear dato tiempo
    datoTiempo.innerHTML = "t / Proceso"; // Agregar encabezado único
    datoCPU.innerHTML = "CPU"; // Agregar encabezado CPU
    filaTiempo.appendChild(datoTiempo); 
    filaCPU.appendChild(datoCPU);
    tablaGant.appendChild(filaTiempo); // Agregar fila de tiempo a tabla Gant
    tablaGant.appendChild(filaCPU); // Agregar fila cpu a tabla Gant
    tablaGant.id = `gant${Auditor.simulaciones}`; // Asignar id
    campoDatos.appendChild(tablaGant); // Asignar Gant a Campo Datos

    div.appendChild(document.createElement("br")); // agregar un salto de línea
    div.appendChild(campoDatos); // Asignar campo de datos a Sección Resultados
    div.appendChild(document.createElement("br")); // agregar un salto de línea

    document.body.appendChild(div); // agregar sección a cuerpo

    // Por cada proceso de la tanda, hacer el seguimiento
    for (var proceso of tandaProcesos) {
      var tr = document.createElement("tr"); // Crear una nueva fila
      var td = document.createElement("td"); // Create a nueva celda
    
      td.innerHTML = proceso.nombre; // Asignar nombre del proceso a la celda
    
      tr.appendChild(td); // Anexar celda a fila
      tablaGant.appendChild(tr); // Anexar fila de proceso a Tabla
    }
    
    return tablaGant; // retornamos la tabla iniciada
  }
  
  static generarTGrafico(tablaSo) {
    const gant = document.getElementById(`gant${Auditor.simulaciones}`); // Obtener tabla gant
    const filasGant = gant.getElementsByTagName("tr"); // Obtener filas
    const celdaTiempo = document.createElement("td"); // crear celda tiempo 
    const celdaCPU = document.createElement("td"); // crear celda cpu 
    celdaTiempo.innerHTML = tablaSo.tiempo; // registrar estado cpu
    celdaCPU.innerHTML = tablaSo.procesador.estado.charAt(0); // registrar estado cpu
    filasGant[0].appendChild(celdaTiempo); // añadir tiempo a tabla
    filasGant[1].appendChild(this.aplicarClase(celdaCPU)); // añadir tiempo a tabla
    for (var i = 2; i < filasGant.length; i++) { // Iterar sobre las filas
      const fila = filasGant[i]; // Obtener fila
      const celda = document.createElement("td"); // crear celda
      if (this.procesosActuales.length != 0) { // Si hay procesos que registrar
        const imagenProceso = this.procesosActuales.find(imagenProceso =>  // averiguar proceso de fila
        imagenProceso.proceso.nombre === fila.cells[0].innerHTML); 
        // TODO Resolver caracter a mostrar, tcp falla  
        let caracter = imagenProceso ? imagenProceso.estado.charAt(0) : "";
        let estadoPrevio = i > 0 && fila.cells[tablaSo.tiempo] ? fila.cells[tablaSo.tiempo].innerHTML : "";
        //console.log("Tiempo", tablaSo.tiempo, "Fila", i, "Estado Previo", estadoPrevio);
        if (tablaSo.tiempo != 0 && // Si no es el tiempo 0
            filasGant[1].cells[tablaSo.tiempo + 1].innerHTML === "S" && // Si hay servicio
              ((imagenProceso === tablaSo.procesador.procesoEnEjecucion) || // Si se está ejecutando ahora 
              (estadoPrevio === "E" || estadoPrevio === "TCP")) // O se ejecutó en el tiempo anterior
        //   (caracter === "B" && // Si está bloqueado y es su primera unidad de E/S
        //     imagenProceso.unidadesRestantesRafagaES === imagenProceso.proceso.duracionRafagasES) ||
        //   (imagenProceso === tablaSo.procesador.procesoEnEjecucion &&
          //   (tablaSo.tiempo != 0 && filasGant[1].cells[tablaSo.tiempo - 1].innerHTML === "S"  || 
          //   filasGant[1].cells[tablaSo.tiempo].innerHTML === "S") && // O está ejecutando y hay servicio
          // ((tablaSo.tiempo != 0 && (fila.cells[tablaSo.tiempo].innerHTML === "E")) ||
          // (tablaSo.tiempo != 0 && imagenProceso === tablaSo.procesador.procesoEnEjecucion))
          ) // && filasGant[0].cells[tablaSo.tiempo].innerHTML === "S") // Si antes estuvo ejecutando
        {
          celda.innerHTML = "TCP";
          console.log("Tiempo", tablaSo.tiempo);
          console.log("estado Previo", estadoPrevio);
          console.log("fila.cells[tablaSo.tiempo].innerHTML", fila.cells[tablaSo.tiempo].innerHTML, fila.cells[tablaSo.tiempo]);
          console.log("filasGant[1].cells[tablaSo.tiempo + 1].innerHTML", filasGant[1].cells[tablaSo.tiempo + 1].innerHTML, filasGant[1].cells[tablaSo.tiempo + 1]);
          console.log("filasGant[1].cells[tablaSo.tiempo].innerHTML", filasGant[1].cells[tablaSo.tiempo].innerHTML, filasGant[1].cells[tablaSo.tiempo]);
        } else { // Cualquier otro valor
          celda.innerHTML = caracter;
          console.log("Tiempo", tablaSo.tiempo);
          console.log("estado Previo", estadoPrevio);
          console.log("fila.cells[tablaSo.tiempo].innerHTML", fila.cells[tablaSo.tiempo].innerHTML, fila.cells[tablaSo.tiempo]);
          console.log("filasGant[1].cells[tablaSo.tiempo + 1].innerHTML", filasGant[1].cells[tablaSo.tiempo + 1].innerHTML, filasGant[1].cells[tablaSo.tiempo + 1]);
          console.log("filasGant[1].cells[tablaSo.tiempo].innerHTML", filasGant[1].cells[tablaSo.tiempo].innerHTML, filasGant[1].cells[tablaSo.tiempo]);
        }
      } else { // si no hay procesos que registrar
         celda.innerHTML = ""; // no se registra
      };
      fila.appendChild(this.aplicarClase(celda));
    }  
  }

  static aplicarClase(celda) {
    
    switch (celda.innerHTML) {
      case "N":
        celda.classList.add("nuevo");
        break;
      case "L":
        celda.classList.add("listo");
        break;
      case "E":
        celda.classList.add("ejecutando");
        break;
      case "B":
        celda.classList.add("bloqueado");
        break;
      case "T":
        celda.classList.add("terminando");
        break;
      case "F":
        celda.classList.add("finalizado");
        break;
      case "O":
        celda.classList.add("ocioso");
        break;
      case "S":
        celda.classList.add("servicio");
        break;
      default:
        celda.classList.add("defecto");
  }


    return celda;

  }

}
