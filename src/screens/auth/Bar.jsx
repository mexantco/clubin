import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import React from "react";
import { Avatar, Divider, TouchableRipple } from "react-native-paper";
import { chats as dummyChats } from "../../seeds/DummyData";
import { useState } from "react";
import { mainShadow } from "../../components/ui/ShadowStyles";
import "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {getUserDataById} from '../../utils/user'
import { getClubDataById } from "../../utils/club";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';

import {
  addDoc,
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
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { ScrollView } from "react-native-gesture-handler";
const Napitok = ({ navigation, nap, press }) => {



  // console.log(uData.name);
  return (
    <>

          <View style={styles.innerChatCard}>
            <TouchableOpacity
            onPress={press}
            style={{ flex: 1, flexDirection: "column", justifyContent:'space-evenly', alignItems:'center' }}>
              <Image style={{height:100, width:100, borderRadius:20, flex:1}} source={{ uri: nap.img }} />

                <Text style={{ fontSize: 16, color:'#f0f0f0', fontFamily: "Inter_600SemiBold", flex:1 }}>
                   {nap.name}
                </Text>
                <Text style={{ fontSize: 16, color:'#f0f0f0', fontFamily: "Inter_600SemiBold", flex:1 }}>
                   {nap.cost+'р.'}
                </Text>


            </TouchableOpacity>

          </View>
      </>
  );
};

const Bar = ({navigation, route}) => {
  const cid = route.params.clubId;
  const owner = route.params.clubOwner;
  const [isMy, setIsmy] = useState(false);
  const [modalUri, setModalUri]= useState();
  const [modalName, setModalName]= useState();
  const [modalOpis, setModalOpis]= useState();
  const [modalId, setModalId]= useState();
  const [modalCost, setModalCost]= useState();
  const [modal, setModal] = useState(false);
  const [uri, setUri] = useState();
  const [bar,setBar] = useState();
  const [people, setUsers] = useState();
  const [prog, setProg]= useState(0);
  const [modal2, setModal2] = useState(false);
  const [name,setName] = useState('');
  const [opis,setOpis] = useState('');
  const [cost,setCost] = useState(0);
  const [clubb, setClub] = useState();
  const [loading, setLoading] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const db = getFirestore();
  const uData = useSelector((state) => state.user.userData);
  useEffect(()=>{if(uData.uid==owner){setIsmy(true)}},[uData]);
  const uploadFile = async (fileUri, uData, urlApi) => {
    console.log(uData);

    const [fontsLoaded] = useFonts({
      // 'AA-Neon': require('../../fonts/AA-Neon.ttf'),
      'canis-minor': require('../../fonts/canisminor.ttf'),
      'Gilroy-Light': require('../../fonts/Gilroy-Light.otf'),
      'Gilroy-ExtraBold': require('../../fonts/Gilroy-ExtraBold.otf'),
      'Gilroy-Regular': require('../../fonts/Gilroy-Regular.ttf'),
    });
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


        const docRef = doc(db, "club", clubb.cid);
        const docSnap = await getDoc(docRef);

          await updateDoc(docRef, {
            bar: [...docSnap.data().bar,
              {
                name: name,
                cost: cost,
                opis: opis,
                img: resp.body.trim(),
                id: Date.now()
              },]
                });

                setModal(false);

    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  };
  const addDrink= async()=>{

    if(uri!=''&&name!=''&&opis!=''&&cost!=''){
      setLoading(true);
      console.log(clubb);
      await uploadFile(uri, clubb.name, 'https://bonus-back.store/upload_photo_club.php');
      setLoading(false);
      setProg(0);
      setRefresh(!refresh);

    }else{
      Alert.alert('Заполните все поля')
    }
  }
  ////////////////////
  const deleteItem = async (id)=>{
    setLoading(true);
    const db = getFirestore();
        const docRef = doc(db, "club", clubb.cid);
        const docSnap = await getDoc(docRef);

    await updateDoc(docRef, {
      bar: [...docSnap.data().bar.filter(el=>el.id!=id)
       ]
          });
          setLoading(false);
          setModal2(false);
          setProg(0);
          setRefresh(!refresh);
  }
  /////////////////////
  const pickImageAsync = async (type) => {

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect:[1,1],
      quality: 1,
    });

    if (!result.canceled) {
        // console.log(result);

      let url = result.assets[0].uri;
      setUri(url)
      console.log(uri);


    } else {

      // setModal(false)
    }
  };
  /////////////////////////
  const addOrder = async()=>{
    setLoading(true);
    await addDoc(collection(db, "orders"), {
      from: uData.uid,
      to: '',
      club:clubb.cid,
      nap_id:modalId,
      time: Date.now()/1000,
      status:0,
      name:modalName
    });
    Alert.alert('Заказ передан в бар');
    setLoading(false);
  }
  /////////////////
 useEffect(()=>{
    const asFn = async()=>{
        const club = await getClubDataById(cid)
        setBar(club.bar);
        setClub(club);
        console.log(club.bar);
    }
    asFn();
 },[refresh])

  // const [chats, setChats] = useState(dummyChats);
  console.log(isMy);
  return (

    <View
      style={{
        ...mainShadow,
        flex: 1,
        marginHorizontal:15,
        backgroundColor: "#ffffff10",

        elevation:0,
        marginTop: 30,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        overflow: "hidden",
      }}
    >
      <Modal
      animationType='fade'
      visible={modal2}
      >{loading?(<>
        <BlurView intensity={50} tint='dark' style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Progress.Bar height={2} width={250} borderRadius={2} useNativeDriver={true} color={'white'} animationType="spring" progress={prog} />
                </BlurView>
  </>):(<>
        <BlurView intensity={30} tint='dark' style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <ScrollView >
              <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Image
            style={{height:300, width:300, marginVertical:20}}
            source={{uri: modalUri}}
            heigth={300}
            width={300}
            />
            <Text style={styles.textinfo}>{modalName}</Text>
            <Text style={[styles.textinfo, {fontFamily:'Gilroy-Light', paddingHorizontal:10}]}>{modalOpis}</Text>
            <Text style={styles.textinfo}>{modalCost+'р.'}</Text>
            {isMy?(<><TouchableOpacity
            style={styles.btnstyle}
            onPress={()=>{deleteItem(modalId)}}
            ><Text style={styles.btntextstyle}>Удалить</Text ></TouchableOpacity></>):(<><TouchableOpacity
            style={styles.btnstyle}
            onPress={()=>addOrder()}><Text style={styles.btntextstyle}>Заказать</Text></TouchableOpacity></>)}
            </View>
            </ScrollView>
            <TouchableOpacity
            style={styles.btnstyle}
            onPress={()=>setModal2(false)}><Text style={styles.btntextstyle}>Закрыть</Text></TouchableOpacity>

        </BlurView></>)}
      </Modal>
      <Modal
      visible={modal}

      >{loading?(<>
      <BlurView intensity={50} tint='dark' style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Progress.Bar height={2} width={250} borderRadius={2} useNativeDriver={true} color={'white'} animationType="spring" progress={prog} />
              </BlurView>
</>):(<>
      <View
        style={{flex:1, flexDirection:'column', justifyContent:'space-between', alignItems:'center'}}
        >
          <TouchableOpacity
          onPress={()=>pickImageAsync()}
           style={{flex:1, borderWidth:2,marginVertical:15, }}
          ><Text>Photo</Text></TouchableOpacity>
          <TextInput onChangeText={setName} style={{flexGrow:0.3,marginVertical:15, borderWidth:1, width:150, height:50}}placeholder="Название"></TextInput>
          <TextInput onChangeText={setOpis} multiline={true} style={{flexGrow:4,marginVertical:15, borderWidth:1, width:'80%' }} placeholder="Описание"></TextInput>
          <TextInput keyboardType='number-pad' onChangeText={setCost} style={{flexGrow:0.1,marginVertical:15, borderWidth:1, width:50, height:50}} placeholder="Цена"></TextInput>
          <TouchableOpacity
          onPress={()=>addDrink()}
           style={{flex:1, borderWidth:2,marginVertical:15, }}
          ><Text>Добавить</Text></TouchableOpacity>
          <TouchableOpacity
            onPress={()=>setModal(false)}
           style={{flex:1, borderWidth:2,marginVertical:15, }}
          ><Text>Закрыть</Text></TouchableOpacity>
          </View></>)}

      </Modal>
         <LinearGradient
      colors={['#f9f9f9', '#ffbfbf60','#ffbfbf20','#ffbfbf10','#ffffff00','#ffffff00','#ffffff00','#ffffff00']}
      style={{
        opacity:0.8,
        // ...mainShadow,
        position:'absolute',
        top:0,
        left:0,

        width:'100%',
        height:100,
        backgroundColor: "#ffffff00",

        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        overflow: "hidden",
      }}
    ></LinearGradient>{isMy?(<><TouchableOpacity
        style={{alignSelf:'center', marginTop:15}}
      onPress={()=>{
          setModal(true)
      }}>
          <Ionicons name="add-circle-sharp" color='#ffffff' size={30}/>
      </TouchableOpacity></>):(<></>)}


      {uData.club!=''?(<><FlatList
        contentContainerStyle={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-around',paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={bar}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => <Napitok press={()=>{setModalId(item.id); setModalUri(item.img); setModalName(item.name);setModalOpis(item.opis); setModalCost(item.cost); setModal2(true);}} nap={item} navigation={navigation} />}
      /></>):(<><Text>Вы должны быть в клубе что бы посмотреть кто из пользователей тоже в клубе.</Text></>)}


    </View>
  );
};

export default Bar;

const styles = StyleSheet.create({
  outerChatCard: {
    backgroundColor: "white",
    borderRadius: 24,
  },
  btnstyle:{
    marginVertical:10,
     width:150,
     height:50,
     backgroundColor:'#bbbbbb',
      borderRadius:15,
      justifyContent:'center',
      alignItems:'center'
  },
  textinfo:{
    marginVertical:5,
    fontFamily:'Gilroy-Regular',
    fontSize:18,
    color:'#ffffff'
  },
  btntextstyle: {
    color:'#ffffff',
    fontFamily:'Gilroy-ExtraBold',
    fontSize:18
  },
  innerChatCard: {
    flexDirection: "column",
    flex:1,
    width:150,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    padding: 20,
  },
});
