
// ======= VARIABLES
let filas = 2
let columnas = 2
let contador_azules = 2 // Variable para controlar el numero de azules que ha de haber en cada ronda

// ======== ARRAYS ==========
let circulos_azules = [] // Aqui guardare los circulos azules
let circulos_clicados = [] // Aqui guardo los circulos que el usuario clica

$(document).ready(function () {
    mostrarTodo()
});

//====================== FUNCIONES ========================

// Esta funcion genera el tablero
function generarTablero(circulos_a_mostrar) {
    circulosAleatorios()

    let tablero = `<table class="tabla"><tbody>`

    for (let fila = 0; fila < filas; fila++) {
        tablero += "<tr>"
        for (let columna = 0; columna < columnas; columna++) {
            let clase = 'verde'

            for (let circulo of circulos_a_mostrar) {

                if (circulo.fila == fila && circulo.columna == columna) {
                    clase = 'azul';
                    break;
                }
            }
            tablero += "<td class='circulo " + clase + "' onclick='hagoClick(" + fila + ", " + columna + ")'></td>";
        }
        tablero += '</tr>'
    }

    tablero += '<tbody></table>'

    // Insertamos el tablero
    document.getElementById("tablero").innerHTML = tablero;
}

// Esta funcion hace que se muestren y se oculten los circulos azules
function mostrarTodo() {
    generarTablero([])

    setTimeout(function () {
        generarTablero(circulos_azules)
    }, 1000);

    setTimeout(function () {
        generarTablero([])
    }, 2000);
}

// Esta funcion genera circulos aleatorios
function circulosAleatorios() {

    while (circulos_azules.length < contador_azules) {
        let x = Math.floor(Math.random() * (filas - 0)) + 0
        let y = Math.floor(Math.random() * (columnas - 0)) + 0

        // Creo el circulo con los numeros aleatorios hechos antes
        let circulo_random = {
            fila: x,
            columna: y
        }

        // Aqui miro si en la lista de circulos azules que genero aleatoriamente tengo ya esa posicion. Esto es para que no me meta en la lista de azules la misma  posicion
        let encontrarCirculo = circulos_azules.filter((circulo) => circulo.fila == circulo_random.fila && circulo.columna == circulo_random.columna);
        //Si no la tengo que me la guarde en ese array
        if (encontrarCirculo.length == 0) {
            circulos_azules.push(circulo_random)
        }

    }
}

// Esta funcion crea un objeto con la posicion del circulo que clica el usuario
function hagoClick(filas, columnas) {

    let circulo_clicado = {
        fila: filas,
        columna: columnas
    }

    circulos_clicados.push(circulo_clicado)
    generarTablero(circulos_clicados)

    comprobarAciertos(circulo_clicado)
}

// Esta funcion comprueba los aciertos del usuario
function comprobarAciertos(circulo_a_comprobar) {
    // aqui busco si hay algun circulo en la lista de circulos azules que sea igual al circulo clicado
    let encontrarCirculo = circulos_azules.filter((circulo) => circulo.fila == circulo_a_comprobar.fila && circulo.columna == circulo_a_comprobar.columna);

    /* Aqui veo si el circulo clicado no se haya clicado anteriormente, esto lo hago porque luego compruebo si pasa de nivel por la longitud de la lista,
     por lo que tengo que hacer esto para que no clique mas de una vez en el mismo circulo en cada fase */
    let encontrarCirculoClicks = circulos_clicados.filter((circulo) => circulo.fila == circulo_a_comprobar.fila && circulo.columna == circulo_a_comprobar.columna);

    // Compruebo que en los filtros de antes me devuelva algo o no y compruebo si me devuelve es que acerto
    if (encontrarCirculo.length != 0 && encontrarCirculoClicks.length == 1) {
        console.log("acierto")
    } else { // si no fallo y se vuelve a empezar
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Has Fallado!',
            showConfirmButton: false,
            timer: 800
        })
        restartGame(2, 2)
    }
    /* Aqui compruebo si la longitud de las dos listas son iguales para subir de nivel, 
    no me hace falta comprobar si tienen los mismos objetos pq eso lo comprobe antes de meterlos*/
    if (circulos_clicados.length == circulos_azules.length) {

        if (columnas < 6 && filas <= 6) {

            //alert("Correcto! Pasas a la siguiente fase.")
            Swal.fire({
                icon: 'success',
                title: 'Correcto!',
                text: 'Pasas a la siguiente fase',
                showConfirmButton: false,
                timer: 1000
            })
            if (filas == columnas) { filas++ } else { columnas++ }

        } else { // si ya tiene un tablero de 6x6 el juego termino
            Swal.fire({
                title: 'Enhorabuena!',
                text: 'Has Completado el juego.',
                imageUrl: 'img/copas.gif',
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
            })
            restartGame(2, 2)
        }

        contador_azules++
        circulos_clicados = []
        mostrarTodo()
    }
}

// Esta funcion hace que el juego se vuelva a empezar con un tablero 2x2
function restartGame(valor_fila, valor_columna) {
    filas = valor_fila
    columnas = valor_columna
    circulos_clicados = []
    circulos_azules = []
    contador_azules = 2
    mostrarTodo()
}
