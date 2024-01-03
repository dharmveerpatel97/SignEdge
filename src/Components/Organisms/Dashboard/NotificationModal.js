import {
    Image,
    StyleSheet,
    TextInput,
    Button,
    Text,
    TouchableOpacity,
    View,
    Modal,
    ActivityIndicator,
    FlatList,
    Alert,
  } from "react-native";
  import React, { useContext, useEffect, useRef, useState } from "react";
  import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
  import FontAwesome from "react-native-vector-icons/FontAwesome";
  import Entypo from "react-native-vector-icons/Entypo";
  import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import { ThemeContext } from "../../../appConfig/AppContext/themeContext";
import { getStorageForKey } from "../../../Services/Storage/asyncStorage";
import { NotificationApiService } from "../../../Services/AxiosService";
import { LocalDate1, moderateScale } from "../../../Helper/scaling";
import AppText from "../../Atoms/CustomText";
import Separator from "../../Atoms/Separator";

export const NotiicationModal = ({ notiModal, setModal,setNoticationData, noticationData,getAllNotification=()=>{} }) => {
    const themeColor = useContext(ThemeContext);
    const mStyles = ModalStyles(themeColor);
    const [isNotiLoading, setIsNotiLoading] = useState(false);

    const markRead = async (messageId,item) => {
      setIsNotiLoading(true);
      const slugId = await getStorageForKey("slugId");

      const successCallBack = async (response) => {
        setIsNotiLoading(false);
        const olddata={...noticationData.notifications[item.index],read:true}
        noticationData.notifications[item.index]=olddata
        setNoticationData({...noticationData})
        // olddata
        console.log("noticationReada old\n\n",JSON.stringify(noticationData.notifications[item.index]),"noticationRead\n\n",JSON.stringify(item.item));
        setModal(false)
        getAllNotification();
      };

      const errorCallBack = (response) => {
        console.log("Error notication", response);
        Alert.alert("Error","Error occured")
        setIsNotiLoading(false);
      };
      const params = {
        messageIds: [messageId],
        slugId: slugId,
      };

      const endPoint = `user-management/ums/${slugId}/v1/push/web/read`;
      NotificationApiService.markRead(
        { params, endPoint },
        successCallBack,
        errorCallBack
      );
    };

    return (
      <>
        <Modal
          visible
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          onRequestClose={()=>{
            console.log("opop")
            getAllNotification()
            setModal(false)
          }}
          transparent
        >
          <View style={mStyles.mainContainer}>
            <View style={mStyles.campaignContainerView}>
              <View style={mStyles.headerView}>
                <AppText style={mStyles.bodyHeaderText}>Notification </AppText>
                <TouchableOpacity
                  onPress={() => {
                    getAllNotification()
                    setModal(false)
                  }}
                  style={mStyles.headerPart}
                >
                  <Entypo name={"cross"} size={20} color={themeColor.black} />
                </TouchableOpacity>
              </View>
              <Separator />
              {isNotiLoading ? (
                <View style={{ justifyContent: "center", marginTop: 30 }}>
                  <ActivityIndicator size={30} />
                </View>
              ) : (
                <FlatList
                  data={noticationData.notifications}
                  keyExtractor={(item) => item.item}
                  renderItem={(item, index) => {
                    return (
                      <>
                        <TouchableOpacity
                          key={item.item.index}
                          onPress={() => markRead(item.item.messageId,item)}
                          style={mStyles.campaignContainer(item.item.read)}
                        >
                          <FontAwesome
                            name={"circle"}
                            size={15}
                            color={"#CC5500"}
                          />
                          <View style={{ marginHorizontal: 5 }}>
                            <Text style={mStyles.modalText}>
                              {item.item.messageString}
                            </Text>
                            <Text style={mStyles.modalText}>
                              {LocalDate1(item.item.sentOn)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </Modal>
      </>
    );
  };


  const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      //   flex: 1,
      height: "100%",
      justifyContent: "flex-end",
      // backgroundColor:"#777",
    },
    campaignContainerView: {
      height: "90%",
      backgroundColor: COLORS.white,
    },
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: moderateScale(10),
    },
    bodyHeaderText: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(10),
      color: COLORS.textColor,
    },
    headerPart: {
      borderColor: "black",
      marginHorizontal: moderateScale(10),
    },
    campaignContainer: (active) => ({
      padding: 10,
      backgroundColor: !active ? "#E3FBFE" : "white",
      marginHorizontal: 5,
      marginVertical: 2,
      flexDirection: "row",
      alignItems: "center",
    }),
    imageStyle: {
      height: moderateScale(100),
      width: "100%",
    },
    videoName: {
      fontSize: moderateScale(12),
      margin: moderateScale(5),
      color: COLORS.textColor,
    },
    dateText: {
      fontSize: moderateScale(10),
      color: COLORS.unselectedText,
      margin: moderateScale(5),
    },
    infoStyle: {
      height: moderateScale(32),
      width: moderateScale(32),
      resizeMode: "contain",
      position: "absolute",
      right: moderateScale(0),
    },
    actionStyle: {
      width: "49%",
    },
    modalText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      textAlignVertical: "auto",
    },
  });