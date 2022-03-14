require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquerir');

const Tareas = require('./models/tareas');

const main = async() => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDb = leerDB();

    if ( tareasDb ) {
        // Establecer las tareas
        tareas.cargarTareasFronArray(tareasDb);
    }

    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('Descrición:');
                tareas.crearTarea(desc);
            break;
            case '2':
                tareas.listadoCompleto();
            break;
            case '3':
                tareas.listarPendientesCompletadas(true);
            break;
            case '4':
                tareas.listarPendientesCompletadas(false);
            break;
            case '5':
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas(ids);
            break;
            case '6':
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if( id !== '0' ) {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada')
                    }
                }
            break;
        }

        guardarDB( tareas.listadoArr );

        if ( opt !== '0' ) await pausa();

    } while( opt !== '0' );


}


main();






