import { View, Text, Image, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect,useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import { getClubDataById } from '../../utils/club';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getFirestore,
  collection,
  query,
  where,
  updateDoc
} from "firebase/firestore";



const ClubInfo = ({route}) => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    // 'AA-Neon': require('../../fonts/AA-Neon.ttf'),
    'canis-minor': require('../../fonts/canisminor.ttf'),
    'Gilroy-Light': require('../../fonts/Gilroy-Light.otf'),
    'Gilroy-ExtraBold': require('../../fonts/Gilroy-ExtraBold.otf'),
  });

  const [prog, setProg]= useState(0);
  const [modal,setModal] = useState(false);
  const [loading,setLoading] = useState(false);
  const [refresh, setResfresh] = useState(false);
  const [datePick, setDatepick]= useState(false);
  const [newDate, setNewdate] = useState(null);
  const dispatch = useDispatch();
  const [isMy, setIsmy] = useState(false);
    const user = useSelector(state=>state.user.userData)

   const club = route.params.club;
   const [clubData, setClubdata] = useState(club)

   /////////// delete banner
   const removeBanner = async(url)=>{
    setModal(true);
    setLoading(true);
    let newArr= clubData.banners.filter(item=>item.url!=url);
    const db = getFirestore();
    const docRef = doc(db, "club", club.id);
    const docSnap = await getDoc(docRef);
    await updateDoc(docRef, {
      banners:newArr
    })
    setModal(false);
    setLoading(false);
    setResfresh(!refresh)
  }

  ///////////////
   useEffect(()=>{
      if(club.owner==user.uid){setIsmy(true)}
      const fn = async()=>{
        const cData = await getClubDataById(club.id);
        setClubdata(cData);
      }
      fn()
   },[user, refresh])


   ///////////////////////// добавляем банер
   const addBanner = async()=>{
      setDatepick(true);
   }
   useEffect(()=>{
    if(!datePick&&newDate){
        pickImageAsync('banner')
    }
   },[newDate])
   const uploadFile = async (fileUri, uData, urlApi, type) => {
    console.log(uData);


   // Замените на ваш конечный пункт API

    try {

      const callback = uploadProgressData => {
        const progress =uploadProgressData.totalBytesSent/uploadProgressData.totalBytesExpectedToSend;
        setProg(progress);

      };

      const up =   FileSystem.createUploadTask(urlApi, fileUri,{
        httpMethod:'POST',
        headers:{
          uid:uData
        },
        uploadType:FileSystem.FileSystemUploadType.MULTIPART,
        fieldName:'file'
       },
       callback
       );
      const resp = await up.uploadAsync()
       ///////////////upload to firebase

        const db = getFirestore();
        const docRef = doc(db, "club", club.id);
        const docSnap = await getDoc(docRef);
        if(type=='banner'){
          await updateDoc(docRef, {
            banners: [...docSnap.data().banners,
              {
                date: newDate,
                url: resp.body.trim()
              },]
                });
        }else{
        await updateDoc(docRef, {
          ava:
            resp.body.trim(),
              });
        }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  };

   const pickImageAsync = async (type) => {
    setModal(true)
    setLoading(true)
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect:[1,1],
      quality: 1,
    });

    if (!result.canceled) {
        // console.log(result);

      let uri = result.assets[0].uri;
      // setUri(uri)
      await uploadFile(uri, club.name, 'https://bonus-back.store/upload_photo_club.php', type);
      setModal(false);
      setLoading(false);
      setProg(0);
      setResfresh(!refresh);
    } else {

      setModal(false)
    }
  };

   let currentBanner


   if(clubData.banners.length>0){
    clubData.banners.forEach(banner=>{

      if(banner.date.seconds>(Date.now()/1000-28800)&&banner.date.seconds<(Date.now()/1000)){currentBanner = banner.url }
   })}
   const cutDate = new Date()
   let sorted = [...clubData.banners].sort((a,b)=>a.date.seconds < b.date.seconds?-1:1).filter(el=>{if(el.date.seconds>Date.now()/1000){return el}});
   if(isMy){
  return (
    <View style={{flex:1}}>
      <DatePicker
        modal={true}
        androidVariant = 'iosClone'
        open={datePick}
        date={cutDate}
        onConfirm={(date) => {

          setDatepick(false)
           setNewdate(date)
        }}
        onCancel={() => {
           setDatepick(false)
        }}
      />
      <Modal
        visible={modal}
        transparent={true}
        animationType='fade'

        >
            <BlurView intensity={50} tint='dark' style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            {loading?(<>
              <Progress.Bar height={2} width={250} borderRadius={2} useNativeDriver={true} color={'white'} animationType="spring" progress={prog} />

            </>):(<></>)}
            </BlurView>
        </Modal>
      <ScrollView style={{ flex:1}}>
        <View style={{justifyContent:'flex-start', alignItems:'center',}}>
          {isMy?(<>
          <TouchableOpacity
            onPress={()=>{navigation.navigate('Staff', {cid:clubData.cid})}}
            style={{
              height:50,
              justifyContent:'center',
              alignItems:'center',
              backgroundColor:'#ffffff30',
              borderWidth:2, borderColor:'#d5cefb70',
              paddingHorizontal:15, marginVertical:15}}>
                <Text style={{color:'#ffffff'}}>Персонал клуба</Text></TouchableOpacity>
          </>):(<><Text style={{fontSize:24, fontFamily:'canis-minor', textAlign:'center', color:'#f0f0f0',  padding:10}}>Добро пожаловать в {clubData.ruName}</Text>
</>)}
      <View >
      <Image
      height={200}
      width={200}
      style={{borderRadius:100, margin:20}}
      source={{uri: clubData.ava}}
      />
      <TouchableOpacity onPress={()=>{pickImageAsync()}} style={{position:'absolute', top:10, right:10}}>
      <Ionicons name='repeat-outline' size={30} />
      </TouchableOpacity>
      </View>
      <Text style={{fontSize:24,  fontFamily:'canis-minor', color:'#f0f0f0', padding:10}}>Ваши мероприятия:</Text>

      <TouchableOpacity
      onPress={()=>{
          addBanner()
      }}>
          <Ionicons name="add-circle-sharp" size={30}/>
      </TouchableOpacity>
      {
      sorted.map((item, idx)=>{
        console.log(item)
        let date = new Date(item.date.seconds*1000)
        return(
        <View
        key={idx}
        >
          <Text>
            Дата мероприятия: {date.toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}
          </Text>
        <Image
      height={300}
      width={300}
      style={{borderRadius:20, margin:20}}
      source={{uri: item.url}}
      />
      <TouchableOpacity
      style={{position:'absolute', bottom:30, right:30}}
      onPress={()=>{removeBanner(item.url)}}
      >
        <Ionicons
            name="trash-sharp" size={30} color={'#fff'} style={{}}/>
      </TouchableOpacity>
      </View>)
      })}


      {club.banners.length>0?(<></>):(<></>)}
       </View>
      </ScrollView>
      </View>
  )}else{
    ///////////////////////////
    /////////////////////////////
return(
    <View style={{flex:1}}>
      <DatePicker
        modal={true}
        androidVariant = 'iosClone'
        open={datePick}
        date={cutDate}
        onConfirm={(date) => {

          setDatepick(false)
           setNewdate(date)
        }}
        onCancel={() => {
           setDatepick(false)
        }}
      />
      <Modal
        visible={modal}
        transparent={true}
        animationType='fade'

        >
            <BlurView intensity={50} tint='dark' style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            {loading?(<>
              <Progress.Bar height={2} width={250} borderRadius={2} useNativeDriver={true} color={'white'} animationType="spring" progress={prog} />

            </>):(<></>)}
            </BlurView>
        </Modal>
      <ScrollView style={{ flex:1}}>
        <View style={{justifyContent:'flex-start', alignItems:'center',}}>
      <Text style={{fontSize:24, fontFamily:'canis-minor', textAlign:'center', color:'#f0f0f0',  padding:10}}>Добро пожаловать в {clubData.ruName}</Text>

      <View >
      <Image
      height={200}
      width={200}
      style={{borderRadius:100, margin:20}}
      source={{uri: clubData.ava}}
      />

      </View>
      <Text style={{fontSize:24,  fontFamily:'canis-minor', color:'#f0f0f0', padding:10}}>Сейчас идет:</Text>
      {currentBanner?(<>
        <Image
      height={300}
      width={300}
      style={{borderRadius:20, margin:20}}
      source={{uri: currentBanner}}
      />
      </>):(<></>)}
      <Text style={{fontSize:24,  fontFamily:'canis-minor', color:'#f0f0f0', padding:10}}>Ближайшие мероприятия:</Text>


      {
      sorted.map((item, idx)=>{
        console.log(item)
        let date = new Date(item.date.seconds*1000)
        if(currentBanner!=item.url){
        return(
        <View
        key={idx}
        >
          <Text style={{textAlign:'center', color:'#f0f0f0'}}>
            Дата мероприятия: {date.toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}
          </Text>
        <Image
      height={300}
      width={300}
      style={{borderRadius:20, margin:20}}
      source={{uri: item.url}}
      />

      </View>)}
      })}


      {club.banners.length>0?(<></>):(<></>)}
       </View>
      </ScrollView>
      </View>
  )}
}

export default ClubInfo