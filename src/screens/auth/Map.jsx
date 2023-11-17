import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

const Maps = () => {
    const [location, setLocation] = useState(null); 

    useEffect(() => {
        let isMounted = true;
    
        // Запрос разрешения на использование местоположения
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
          }
    
          // Начать отслеживание местоположения с интервалом в 10000 миллисекунд (10 секунд)
          let locationSubscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 0 },
            (newLocation) => {
              if (isMounted) {
                setLocation(newLocation);
              }
            }
          );
        })();
    
        // Очистить подписку при размонтировании компонента
        return () => {
          isMounted = false;
          if (locationSubscription) {
            locationSubscription.remove();
          }
        };
      }, []);
  return (
    <View>
     {location ? (
        <Text>
          Широта: {location.coords.latitude}, Долгота: {location.coords.longitude}
        </Text>
      ) : (
        <Text>Ожидание местоположения...</Text>
      )}
      <MapView/>
    </View>
  )
}

export default Maps