import { StyleSheet, FlatList, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import TextInput from "../../components/ui/TextInput";
import { IconButton, Avatar } from "react-native-paper";
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { setDoc } from "firebase/firestore";
import { getChatBetweenTwo } from "../../utils/chat";
import { getUserDataById} from "../../utils/user";
const Message = ({ message }) => {
  const userData = useSelector((state) => state.user.userData);
  return (
    <View
      style={[
        styles.defaultMessage,
        message.sender_id === userData.uid
          ? styles.userMessage
          : styles.anotherMessage,
      ]}
    >
      <Text
        style={[
          { fontSize: 16, fontFamily: "Inter_400Regular" },
          message.sender_id === userData.uid
            ? { color: "white" }
            : { color: "black" },
        ]}
      >
        {message.text}
      </Text>
    </View>
  );
};
const Chat = ({ navigation, route }) => {
  const [usData, setUsData] = useState();
  const name = route.params.userData.name;
  const uid = route.params.userData.uid;
  
  
  
  requestAnimationFrame(async()=>{
    const doc = await getChatBetweenTwo(uid, userData.uid);
  })
  useLayoutEffect(() => {
    const getData = async()=>{
      const userD = await getUserDataById(uid);
      console.log(userD)
      let photo = userD.photos[0]
      navigation.setOptions({
      headerTitle: ({props}) => (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
          onPress={()=>{navigation.navigate("User",{people: userD})}}
          >
          <Avatar.Image
            
            size={38}
            source={{
              uri: photo
                ? photo
                : "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg",
            }}
          />
          </TouchableOpacity>
          <Text style={{ marginStart: 10, fontSize: 16 }}>{name}</Text>
        </View>
      ),
    });
    }
    getData()
    
  }, []);
  const allMessages = useSelector((state) => state.chats.chats);
  
  const userData = useSelector((state) => state.user.userData);
  //  console.log(userData);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  useEffect(() => {
    allMessages.forEach((value, index) => {
      const messageInChat = [];
      if (value.users.includes(uid)) {
        
        messageInChat.push(value.messages);
        setMessages(messageInChat[0]);
      }
      
      
      console.log(messageInChat);
    });
    
  }, [allMessages]);

  const sendMessage = () => {
    requestAnimationFrame(async () => {
      if (messageText === "") {
        return;
      }
      
      const doc = await getChatBetweenTwo(uid, userData.uid);
      
      await setDoc(doc.ref, {
        messages: [
          ...doc.data().messages,
          { text: messageText, sender_id: userData.uid },
        ],
        users: doc.data().users,
      });
    });
    setMessageText("");
  };
  return (
    <View style={styles.rootContainer}>
      <View
        style={{
          position: "absolute",

          height: "100%",
        }}
      ></View>
      <View style={styles.chatbox}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={messages}
          inverted
          contentContainerStyle={{ flexDirection: "column-reverse" }}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => <Message message={item} />}
        />
      </View>
      <View style={styles.bottomBar}>
        <View style={{ flex: 1 }}>
          <TextInput
            mode="flat"
            label="Write your message here"
            value={messageText}
            onChangeText={setMessageText}
          />
        </View>
        <View>
          <IconButton
            size={24}
            icon="send"
            color={Colors.primary600}
            onPress={sendMessage}
          />
        </View>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  rootContainer: {
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 15,
  },
  chatbox: {
    flex: 5,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultMessage: {
    margin: 10,
    padding: 20,
  },
  userMessage: {
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    borderBottomStartRadius: 25,
    alignSelf: "flex-end",
    backgroundColor: Colors.primary600,
  },
  anotherMessage: {
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
    alignSelf: "flex-start",
    backgroundColor: "#d1d1d1",
  },
});
