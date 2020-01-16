export default keys={
    socket:null,
    id_chofer_socket: '',
    id_usuario_socket: '',
    id_servicio: '',
    id_recorrido: '',
    // Usuario
    datos_usuario: {
        id_usuario: 1,
        nombreUsuario: 'Luis Oswaldo Tovar Olivera',
        CURP: 'TOOL980302HCMVLS06',
        numeroTelefono: "3121402169",
        correoElectronico: "16460445@itcolima.edu.mx"

    },
    categoriaVehiculo:null,
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
        Reconocimientos: null

    },
    // Información de viajes 
    travelInfo: {
        puntoPartida:null,
        Parada1:null,
        Parada2:null,
        Parada3:null,
     

    },
    Tarifa:0,
    Paradas: null, 
    typePay:1,
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