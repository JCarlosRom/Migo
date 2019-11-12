import || from "./../TravelMP";
import keys from './../global';

// 2 Paradas: Rutas de multiples paradas (2 paradas)
export const MapViewDirectionDosParadas =


    state.routeParada1?

    <MapViewDirections

        origin={{
            latitude: state.myPosition.latitude,
            longitude: state.myPosition.longitude,
        }}

        destination={{
            latitude: keys.travelInfo.Parada1.latitude,
            longitude: keys.travelInfo.Parada1.longitude,
        }}

        apikey={keys.GOOGLE_MAPS_APIKEY}

        strokeWidth={1}
        strokeColor="blue"
        onReady={result => {

            setState({
                distance: parseInt(result.distance),
                duration: parseInt(result.duration)

            });
        }}

    />
    :
        null

{/* Tercera parada */ }

state.routeParada2?

    <MapViewDirections


        origin={{
            latitude: keys.travelInfo.Parada1.latitude,
            longitude: keys.travelInfo.Parada1.longitude,
        }}
        destination={{
            latitude: keys.travelInfo.Parada2.latitude,
            longitude: keys.travelInfo.Parada2.longitude,
        }}
        apikey={keys.GOOGLE_MAPS_APIKEY}
        strokeWidth={1}
        strokeColor="orange"
        onReady={result => {
            setState({
                distance: state.distance + parseInt(result.distance),
                duration: state.duration + parseInt(result.duration)

            })



        }}

    />


:

    null





