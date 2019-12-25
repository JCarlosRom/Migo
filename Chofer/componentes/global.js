export default keys={
    socket:null,
    timerCoordenadas:null,
    id_chofer_socket:'',
    id_usuario_socket:'',
    id_chofer: 1,
    myPosition: null,
    stateConductor: false,
    id_servicio: '',
    id_recorrido: '',
    travelInfo: {
        puntoPartida: null,
        Parada1: null,
        Parada2: null,
        Parada3: null,
        Distancia: null, 
        Tiempo: null
    },
    positionUser:{
        longitude:null, 
        latitude:null
    },
    type:'',
    datos_usuario: {
        id_usuario: '',
        nombreUsuario: '',
        CURP: '',
        numeroTelefono: "",
        correoElectronico: ''

    },
    datos_vehiculo: {
        id_unidad: 2,
        modelo:'Dodge attitude',
        Matricula:'FRS408A',
        // Taxi: 1, Van: 2, Camioneta: 3
        categoriaVehiculo: 1,
        // Estandar: 1, Lujo: 2
        tipoVehiculo:1,
        // Express: 1, Pool: 2
        tipoServicio: 1

    },
    datos_chofer:{
        idChofer:1,
        nombreChofer:'Oscar Dario Leyva',
        Estrellas:'4.5',
        Reconocimientos:'Habla inglés y español'

    },
    GOOGLE_MAPS_APIKEY : 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY',
    Tarifa: 0,
    Peaje:0,
    intervalBroadcastCoordinates:null,
    intervalUpdateChoferCoordinates: null,
    Chat: [],
    socketUrl:'http://192.168.0.13:3001',
    // socketUrl:'http://35.203.42.33:3001/'
    
}


