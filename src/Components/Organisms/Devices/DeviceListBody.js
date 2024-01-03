import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import AndroidIcon from "../../../Assets/Images/PNG/android.png";
import WindowsIcon from "../../../Assets/Images/PNG/windows.png";
import TvIcon from "../../../Assets/Images/PNG/tv.png";
import { moderateScale, width } from "../../../Helper/scaling";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import AppText from "../../Atoms/CustomText";
import DeviceHeaderScroll from "./deviceHeaderScroll";
import ThemedButton from "../../Atoms/ThemedButton";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { NAVIGATION_CONSTANTS } from "../../../Constants/navigationConstant";
import EditIcon from "../../../Assets/Images/PNG/edit.png";
import { useSelector } from "react-redux";
import { PREVILAGES } from "../../../Constants/privilages";
import moment from "moment";

const DeviceListBody = ({
  navigation,
  dataList,
  searchData,
  setSearchData,
  deviceGroupArr,
  makeRegisterMediaDataUrl,
  selectedMP,
  headers,
  selectedData,
  setSelectedData,
  btnOpenModelType,
}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const { authorization, isApprover } = useSelector((state) => state.userReducer); 

  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView]}>
        <AppText style={Styles.commonText}>{value || '--'}</AppText>
      </View>
    );
  };
  const renderGroupView = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.groupView]}>
        <AppText style={Styles.commonText}>  {value || '--'}</AppText>
      </View>
    );
  };
  const renderOSIcon = (item, index) => {
    return (
      <View style={Styles.OSView}>
        {item.deviceOs.toLowerCase() == "windows" ? (
          <Image
            source={WindowsIcon}
            resizeMode="contain"
            style={Styles.iconStyles}
          />
        ) : item.deviceOs.toLowerCase() == "android" ? (
          <Image
            resizeMode="contain"
            source={AndroidIcon}
            style={Styles.iconStyles}
          />
        ) : (
          <Image
            resizeMode="contain"
            source={TvIcon}
            style={Styles.iconStyles}
          />
        )}
      </View>
    );
  };

  const renderActionView = (item) => {
    return (
      <View style={Styles.actionView}>
        {authorization.includes(PREVILAGES.DEVICE.EDIT_DEVICE) && (
          <Pressable
            style={Styles.iconBackView}
            onPress={() => {
              navigation.navigate(NAVIGATION_CONSTANTS.EDIT_REGISTER_DEVICE, {
                deviceData: item,
              });
            }}
          >
            <Image source={EditIcon} style={Styles.actionIcons} />
          </Pressable>
        )}
        {!isApprover && (
            <Pressable
              onPress={() => {
                navigation.navigate("CalenderView", { deviceDetail: item });
              }}
              style={Styles.iconBackView}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={25}
                color={themeColor.themeColor}
              />
            </Pressable>
          )}
        {authorization.includes(PREVILAGES.DOWNLOAD.VIEW_DOWNLOAD) && (
          <Pressable
            onPress={() => {
              btnOpenModelType("Download", item.deviceId);
            }}
            style={Styles.iconBackView}
          >
            <Ionicons name="download" size={25} color={themeColor.themeColor} />
          </Pressable>
        )}
        {authorization.includes(PREVILAGES.DEVICE.DELETE_DEVICE) && (
          <Pressable
            onPress={() => {
              btnOpenModelType("Delete", [item.deviceId]);
            }}
            style={Styles.iconBackView}
          >
            <AntDesign name="delete" size={22} color={themeColor.themeColor} />
          </Pressable>
        )}

        {!isApprover && (
          <Pressable
            onPress={() => {
              btnOpenModelType("Unmute MP", [item.deviceId]);
            }}
            style={Styles.iconBackView}
          >
            <Ionicons
              name="volume-mute"
              size={25}
              color={themeColor.themeColor}
            />
            {/* <Ionicons
            name="volume-medium-sharp"
            size={25}
            color={themeColor.themeColor}
          /> */}
          </Pressable>
        )}
      </View>
    );
  };
  const renderStatus = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.centeredView]}>
        <ThemedButton
          title={value == 1 ? "Active" : "Deactive"}
          containerStyle={{
            backgroundColor:
              value === 1 ? themeColor.barLightGreen : themeColor.barLightRed,
            borderRadius: moderateScale(20),
          }}
          textStyle={{
            color: value === 1 ? themeColor.activeGreen : themeColor.activeRed,
          }}
        />
      </View>
    );
  };

  const renderConnection = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.centeredView]}>
        {value ? (
          <ThemedButton
            title={value[0].toUpperCase() + value.slice(1).toLowerCase()}
            containerStyle={{
              backgroundColor:
                value.toLowerCase() === "connected"
                  ? themeColor.barLightGreen
                  : themeColor.barLightRed,
              borderRadius: moderateScale(20),
            }}
            textStyle={{
              color:
                value.toLowerCase() === "connected"
                  ? themeColor.activeGreen
                  : themeColor.activeRed,
            }}
          />
        ) : (
          <Text style={{ color: "#000" }}> -</Text>
        )}
      </View>
    );
  };

  const renderDateTime = (value) => {
    return (
      <View style={[Styles.commonView]}>
        <AppText style={[Styles.commonText, { textAlign: "center" }]}>
          {value && moment(value).format('DD-MM-YYYY hh:mm:ss A') || '--'}
        </AppText>
      </View>
    );
  };

  const renderDeviceItems = ({ item, index }) => {
    return (
      <View style={Styles.renderContainer}>
        <Pressable
          style={Styles.iconView}
          onPress={() => {
            addRemData(item.deviceId);
          }}
        >
          {isChecked(item.deviceId) ? (
            <MaterialIcons
              name="check-box"
              color={themeColor.themeColor}
              size={25}
            />
          ) : (
            <MaterialIcons
              name="check-box-outline-blank"
              color={themeColor.themeColor}
              size={25}
            />
          )}
        </Pressable>
        <TouchableOpacity
          onPress={() =>{
            navigation.navigate(NAVIGATION_CONSTANTS.DEVICE_CONSOLIDATE,{deviceDetail:item})
          }}
          style={Styles.nameView}
        >
          <AppText style={Styles.nameText}>{item.deviceName}</AppText>
        </TouchableOpacity>
        {renderTextView(item?.deviceGroupName, index)}
        {renderTextView(item?.location?.locationName, index)}
        {renderOSIcon(item, index)}
        {renderGroupView(item?.appVersion, index)}
        {renderStatus(item?.status, index)}
        {renderDateTime(item?.lastSyncTime, index)}
        {renderConnection(item?.deviceConnectivity, index)}
        {renderDateTime(item?.timeOfDeviceStatus, index)}
        <View style={[Styles.commonView, Styles.actionContainer]}>
          {renderActionView(item)}
        </View>
      </View>
    );
  };

  // change text input data======
  const onChangeSearchBar = (type, value) => {
    console.log("onChangeSearchBar", type, value);

    if (type == "Media Player Name") {
      setSearchData({ ...searchData, MediaPlayerName: value });
    } else if (type == "Group") {
      setSearchData({
        ...searchData,
        GroupId: value,
        isUsedForUseEffect: value,
      });
    } else if (type == "Location") {
      setSearchData({ ...searchData, Location: value });
    } else if (type == "OS") {
      setSearchData({
        ...searchData,
        os: value,
        isUsedForUseEffect: value,
      });
      // isUsedForUseEffect:value,
    } else if (type == "MP Connectivity") {
      setSearchData({
        ...searchData,
        connectivity: value,
        isUsedForUseEffect: value,
      });
    }
  };
  //end change text input data======

  // checkbox code==========
  const isChecked = (id) => {
    if (selectedData.includes(id)) return true;
    return false;
  };
  const addRemData = (id) => {
    if (isChecked(id)) {
      let remdata = selectedData.filter((d) => d != id);
      setSelectedData([...remdata]);
    } else {
      setSelectedData([...selectedData, id]);
    }
  };
  const multiSelectUnselect = (status) => {
    if (dataList.length <= 0) return false;
    if (status == false) {
      let seldata = dataList.map((device) => {
        return device.deviceId;
      });
      setSelectedData([...seldata]);
    } else {
      setSelectedData([]);
    }
  };
  //End checkbox code==========
  const ListEmptyComponent =  ({ item }) => {
    return (
      <Text
        style={{
          padding: 10,
          fontSize: 18,
          marginLeft:width/2-80,
          color:'black'
        }}
      >
        No Data Found
      </Text>
    );
  };
  return (
      <ScrollView  bounces={false} horizontal={true} style={Styles.mainContainer}>
      <FlatList
        scrollEnabled={false}
        data={dataList}
        renderItem={renderDeviceItems}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={
          <DeviceHeaderScroll
            deviceGroupArr={deviceGroupArr}
            onChangeSearchBar={onChangeSearchBar}
            searchData={searchData}
            setSearchData={setSearchData}
            makeRegisterMediaDataUrl={makeRegisterMediaDataUrl}
            selectedMP={selectedMP}
            headers={headers}
            onClick={(status) => multiSelectUnselect(status)}
            deviceList={dataList}
            selectedData={selectedData}
          />
        }
      />
    </ScrollView>
  );
};

export default DeviceListBody;

const scheduleStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.themeLight,
      width: "100%",
    },
    nameView: {
      width: "13%",
      margin: 0,
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(15),
    },
    commonView: {
      width: "9%",
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(9),
    },
    groupView: { width: "7%" },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(10),
    },
    renderContainer: {
      flexDirection: "row",
      width: "100%",
      margin: moderateScale(0.5),
    },
    statusText: {
      fontSize: moderateScale(16),
      padding: moderateScale(5),
      paddingHorizontal: moderateScale(15),
      borderRadius: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    centeredView: { alignItems: "center" },
    actionView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    OSView: {
      width: "7%",
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    iconStyles: {
      backgroundColor: "white",
      height: moderateScale(35),
      width: moderateScale(25),
    },
    actionContainer: { width: "15%" },
    iconBackView: {
      height: moderateScale(32),
      width: moderateScale(32),
      borderRadius: moderateScale(17),
      backgroundColor: COLORS.themeLight,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(5),
    },
    actionIcons: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: "contain",
    },
  });
