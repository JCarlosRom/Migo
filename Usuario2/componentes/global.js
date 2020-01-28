export default keys={
    socket:null,
    id_chofer_socket: '',
    id_usuario_socket: '',
    id_servicio: '',
    id_recorrido: '',
    // Usuario
    datos_usuario: {
        id_usuario: 2,
        nombreUsuario: 'Anónimo',
        CURP: 'GUGL970208MCMTRR05',
        numeroTelefono: "3121942513",
        correoElectronico: "15460810@itcolima.edu.mx"

    },
    categoriaVehiculo:1,
    tipoVehiculo:null, 
    tipoServicio:null,
    // Chofer
    datos_vehiculo: {
        id_unidad: null,
        modelo: null,
        Matricula: null,
        tipoVehiculo: null,
        categoriaVehiculo: null,

    },
    datos_chofer: {
        idChofer: null,
        nombreChofer: null,
        Estrellas: null,
        Reconocimientos: null,
        Telefono: null 

    },
    // Información de viajes 
    travelInfo: {
        puntoPartida:null,
        Parada1:null,
        Parada2:null,
        Parada3:null,
     

    },
    Tarifa:{
        Solicitud: 0,
        tarifaBase: 0, 
        tarifaMinima:0,
        porMinuto: 0,
        porKilometro: 0, 
        recargosEstimados: 0,
        Gob:0,
        Peaje: 0,
        Propina:0,
        Total:0,
        tarifa_cancelacion: 0
         
    },
    Paradas: null, 
    typePay:1,
    typePropina:1,
    // Punteros
    flag: null,
    type: "",
    data_driver_response: null,
    addressInput:"",
    Chat: [],
    HoraServicio:null,
    // urlSocket: 'http://192.168.0.13:3001', 
    urlSocket: 'http://35.203.42.33:3001/',

}