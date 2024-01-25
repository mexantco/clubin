import { View, Text, Image } from 'react-native'
import React, {useState, useEffect, useMemo} from 'react'
import * as Location from 'expo-location';
import YaMap, {Marker} from 'react-native-yamap2';
import {enterClub, exitClub, getClubs} from '../../utils/club'
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from '../../reducers/user';
import { getUserDataById } from '../../utils/user';
import { Shadow } from 'react-native-shadow-2';

const Maps = ({navigation, route}) => {
    const [isUserinclub, setIsuserinclub] = useState(false);
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState(null)
    const user1 = route.params.user;
    const [curUser, setCurUser] = useState(user1);
    const [refresh,setResfresh] = useState(false);
    const [isVisible, setIsvisible] = useState(true)
    const [zoom, setZoom] = useState(16)
    const [lat, setLat] = useState(null)
    const [lon, setLon] = useState(null)
    const dispatch = useDispatch();
    const clubs = useSelector(state=>state.clubs.clubs);

    const getClubs = async ()=>{


      const db = getFirestore();
          const q = query(
              collection(db, "club")
            );
            const querySnapshot = await getDocs(q);
            let clubs = [];
            await querySnapshot.forEach(async (doc) => {

            let document = doc.data();
            document.id= doc.id;
            clubs.push(document);
            })
            await dispatch(
              setClubs({clubs: clubs})
            )
    }
    useEffect(()=>{

       getClubs()

    },[])

    useEffect(()=>{
       setResfresh(!refresh);
       console.log(clubs)
    },[clubs])
    const distance = (lat1,lon1, lat2, lon2)=>{
      const toRadians = (angle) => (angle * Math.PI) / 180;
      const lat1Rad = toRadians(1*lat1);
  const lon1Rad = toRadians(1*lon1);
  const lat2Rad = toRadians(1*lat2);
  const lon2Rad = toRadians(1*lon2);

  // Разницы в координатах
  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Формула гаверсинусов
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Расстояние в километрах
  const distance = 6371 * c;
  return distance
    }
    useEffect(() => {

        let isMounted = true;
        let locationSubscription
        // Запрос разрешения на использование местоположения
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
          }
          let dist;
          // Начать отслеживание местоположения с интервалом в 10000 миллисекунд (10 секунд)
          let locationSubscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 0 },
            (newLocation) => {
              if (isMounted) {

                setLocation(newLocation);
                async function proc(){
                  for(cl of clubs){
                  let dist = distance(newLocation.coords.latitude,newLocation.coords.longitude, cl.lat, cl.lon)

                  if(curUser.club!=''){setIsuserinclub(true)}else{setIsuserinclub(false)}
                  switch(true){
                    case curUser.club==''&&dist*1000<100:

                      console.log('велком ту '+cl.name);
                      await enterClub(curUser.uid, cl.name);
                      setCurUser({...curUser, club:cl.name})
                      dispatch(setUserData({userData:{...curUser, club:cl.name}}))
                      navigation.navigate('Club',{club:cl})

                      break;
                    case curUser.club==cl.name&&dist*1000>100:

                      console.log('уходим из клуба'+cl.name);
                      await exitClub(curUser.uid, cl.name);
                      setCurUser({...curUser, club:''})
                      dispatch(setUserData({userData:{...curUser, club:''}}))
                      break;
                  }

                }
                }
               proc();

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
      }, [curUser]);

      // console.log(lat+" "+lon);



  return (
    <View style={{paddingHorizontal:15, paddingTop:40, paddingBottom:0}}>
      {/* <Text>{curUser.club}</Text>
     {location ? (
        <Text>
          Широта: {location.coords.latitude}, Долгота: {location.coords.longitude}
        </Text>
      ) : (
        <Text>Ожидание местоположения...</Text>
      )} */}
       <Shadow
            distance={15}
            paintInside={true}
            stretch={true}
            style={{
              borderRadius: 25,
              overflow: "hidden",
              height:'100%',
              width:'100%'

            }}
            distance={0}
            startColor='#faf9ff90'
            finalColor='#cecece'
             containerStyle={{ }}
            offset={[0,-2]}
            sides={{top:true, start:true, end:true, bottom:false}}
            corners={{topStart:true, bottomStart:false, topEnd:true, bottomEnd:false}}
            >

      <YaMap
      nightMode={true}
      tiltGesturesEnabled={false}
      rotateGesturesEnabled={false}
      onMapLoaded={()=>{setIsvisible(true);}}
      onCameraPositionChangeEnd={event=> {if(event.nativeEvent.zoom!=zoom||event.nativeEvent.point.lon!=lon){setZoom(event.nativeEvent.zoom); setLat(event.nativeEvent.point.lat); setLon(event.nativeEvent.point.lon);}}}

      style={{

          width:'100%',
          height:'105%'
        }}
      showUserPosition={!isUserinclub}
      followUser={false}
      initialRegion={location ?{
        lat: lat?lat:location.coords.latitude,
        lon: lon?lon:location.coords.longitude,
        zoom:zoom,
        azimuth:0,
        tilt:100
    }:null}
      >
      {  clubs.map((club, id)=>{


        let idx = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        return(
        <Marker

        visible={true}
         children={true?(
        <Image width={48} height={48} style={{borderRadius:24}} source={{uri: club.ava}}/>):(<></>)}
        key={idx}
        // source={{uri: club.ava }}
        onPress={()=>{navigation.navigate('Club',{club})}}
        point={{lat: club.lat,  lon: club.lon}}
        />
        )


        })}
       </YaMap>

       </Shadow>
    </View>
  )
}

export default Maps