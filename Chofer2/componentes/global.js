export default keys={
    socket:null,
    timerCoordenadas:null,
    id_chofer_socket:'',
    id_usuario_socket:'',
    id_chofer: 5,
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
        id_unidad: 71,
        modelo:'Bocho',
        Matricula:'HSJSJ',
        // Taxi: 1, Van: 2, Camioneta: 3
        categoriaVehiculo: 1,
        // Estandar: 1, Lujo: 2
        tipoVehiculo:1,
        // Express: 1, Pool: 2
        tipoServicio: 2

    },
    datos_chofer:{
        idChofer:5,
        nombreChofer:'Noel Noel',
        Estrellas:'4.7',
        Reconocimientos:'Excelente servicio, buena ruta, amable, buena conversación, Heroe',
        Idiomas: "Español e Italiano",
        Telefono:'3122091462'

    },
    GOOGLE_MAPS_APIKEY : 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY',
    Tarifa: 0,
    Peaje:0,
    HoraServicio:null,
    intervalBroadcastCoordinates:null,
    intervalUpdateChoferCoordinates: null,
    Chat: [],
    travelType: true,
    // socketUrl:'http://192.168.0.13:3001',
    socketUrl:'http://35.203.42.33:3001/'
    
}


