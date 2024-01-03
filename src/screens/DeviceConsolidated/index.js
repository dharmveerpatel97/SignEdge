import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import LeftArr from "../../Assets/Images/PNG/left_arr.png";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import AppText from "../../Components/Atoms/CustomText";
import Separator from "../../Components/Atoms/Separator";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import DeviceStyles from "./style";
import { moderateScale } from "../../Helper/scaling";
import UserIcon from "../../Assets/Images/PNG/user.png";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import ActiveDot from "../../Assets/Images/PNG/active_dot.png";
import EditIcon from "../../Assets/Images/PNG/edit.png";
import DeleteIcon from "../../Assets/Images/PNG/delete.png";
import RepeatIcon from "../../Assets/Images/PNG/move.png";
import CalenderIcon from "../../Assets/Images/PNG/calender.png";
import OptionsIcon from "../../Assets/Images/PNG/three_dot.png";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import AndroidIcon from "../../Assets/Images/PNG/android.png";
import WindowsIcon from "../../Assets/Images/PNG/windows.png";
import TvIcon from "../../Assets/Images/PNG/tv.png";

const headers = ["DEVICE/MP DETAILS", "PANEL DETAILS", "DEVELOPER TOOLS"];

const DeviceConsolidated = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = DeviceStyles(themeColor);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    const deviceDetail = route?.params?.deviceDetail;
    setDeviceInfo(deviceDetail);
    console.log("deviceDetail", deviceDetail);
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(index)}
        key={item}
        style={Styles.itemContainer}
      >
        <View>
          <AppText style={Styles.headerOptionText}>{item}</AppText>
          {selectedIndex === index && <View style={Styles.selectedBar} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTitleAndValue = (title, value) => {
    return (
      <View style={{ padding: moderateScale(10) }}>
        <AppText style={Styles.titleStyle}>{title}</AppText>
        <AppText style={Styles.valueStyle}>{value}</AppText>
      </View>
    );
  };
  const renderConnectivity = (title, value) => {
    return (
      <View style={{ padding: moderateScale(10) }}>
        <AppText style={Styles.titleStyle}>{title}</AppText>
        <ThemedButton
          title={value}
          containerStyle={{
            backgroundColor:
              value?.toLowerCase() === "connected"
                ? themeColor.barLightGreen
                : themeColor.barLightRed,
            borderRadius: moderateScale(20),
            alignSelf: "flex-start",
            marginVertical: moderateScale(5),
            paddingVertical: moderateScale(8),
          }}
          textStyle={{
            color:
              value?.toLowerCase() === "connected"
                ? themeColor.activeGreen
                : themeColor.activeRed,
          }}
        />
      </View>
    );
  };

  const renderOS = (title, value) => {
    return (
      <View style={{ padding: moderateScale(10) }}>
        <AppText style={Styles.titleStyle}>{title}</AppText>
        {value?.toLowerCase() == "windows" ? (
          <Image
            source={WindowsIcon}
            resizeMode="contain"
            style={{
              width: moderateScale(23),
              height: moderateScale(28),
              resizeMode: "contain",
            }}
          />
        ) : value?.toLowerCase() == "android" ? (
          <Image
            resizeMode="contain"
            source={AndroidIcon}
            style={{
              width: moderateScale(23),
              height: moderateScale(28),
              resizeMode: "contain",
            }}
          />
        ) : (
          <Image
            resizeMode="contain"
            source={TvIcon}
            style={{
              width: moderateScale(23),
              height: moderateScale(28),
              resizeMode: "contain",
            }}
          />
        )}
      </View>
    );
  };

  const renderActionView = () => {
    return (
      <View style={Styles.actionView}>
        <View style={Styles.iconBackView}>
          <Image source={EditIcon} style={Styles.actionIcons} />
        </View>
        <View style={Styles.iconBackView}>
          <Image source={CalenderIcon} style={Styles.actionIcons} />
        </View>
        <View style={Styles.iconBackView}>
          <Image source={RepeatIcon} style={Styles.actionIcons} />
        </View>
        <View style={Styles.iconBackView}>
          <Image source={DeleteIcon} style={Styles.actionIcons} />
        </View>
        <View style={Styles.iconBackView}>
          <Image source={OptionsIcon} style={Styles.actionIcons} />
        </View>
      </View>
    );
  };

  const returnPanelview = (title, value) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <AppText style={Styles.titleStyle}>{title}</AppText>
        <AppText style={Styles.valueStyle}>{value}</AppText>
      </View>
    );
  };

  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <View style={Styles.createNewStyles}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={Styles.iconView}
              >
                <Image source={LeftArr} style={Styles.backIcon} />
              </TouchableOpacity>
              <AppText style={Styles.headerText}>
                Device Consolidated View
              </AppText>
            </View>
          </View>
          <Separator />
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={headers}
            renderItem={renderItem}
            horizontal
            style={{
              paddingHorizontal: moderateScale(10),
              backgroundColor: themeColor.white,
            }}
          />
          <View style={Styles.playerNameView}>
            <Image
              source={UserIcon}
              style={{
                height: moderateScale(14),
                width: moderateScale(14),
                resizeMode: "contain",
              }}
            />
            <AppText
              style={{
                color: themeColor.unselectedText,
                fontSize: moderateScale(14),
                fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                marginHorizontal: moderateScale(10),
              }}
            >
              Media Player Name :
            </AppText>
            <AppText
              style={{
                color: themeColor.textColor,
                fontSize: moderateScale(14),
                fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
              }}
            >
              {`${deviceInfo?.deviceName || "-"}`}
            </AppText>
            <Image
              source={ActiveDot}
              style={{
                width: moderateScale(12),
                height: moderateScale(12),
                marginHorizontal: moderateScale(5),
              }}
            />
          </View>

          {selectedIndex == 0 ? (
            <View style={Styles.bodyContainer}>
              {renderTitleAndValue(
                "Media Player Name",
                `${deviceInfo?.deviceName || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Group",
                `${deviceInfo?.deviceGroupName || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Identifier",
                `${deviceInfo?.clientGeneratedDeviceIdentifier || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Location",
                `${deviceInfo?.location?.locationName || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Wifi Mac Address",
                `${deviceInfo?.deviceWifiMacAddress || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Local Server IP",
                `${deviceInfo?.ipAddress || "-"}`
              )}
              <Separator />
              {renderConnectivity(
                "Media Player Connectivity",
                `${deviceInfo?.deviceConnectivity || "-"}`
              )}
              <Separator />
              {renderOS(
                "Media Player OS",
                `${deviceInfo?.deviceOs || "android"}`
              )}
              <Separator />

              {renderTitleAndValue(
                "App Version",
                `${deviceInfo?.appVersion || "-"}`
              )}
              <Separator />
              {renderTitleAndValue("Latitude", "-")}
              <Separator />
              {renderTitleAndValue(
                "Media Player Ethernet Mac Address",
                `${deviceInfo?.deviceEthernetMacAddress || "-"}`
              )}
              <Separator />
            </View>
          ) : (
            <>
              {deviceInfo?.panels &&
                deviceInfo?.panels?.map((panel) => {
                  return (
                    <View
                      style={{
                        padding: 20,
                        backgroundColor: "#fff",
                        marginVertical: 6,
                      }}
                    >
                      {returnPanelview(
                        "Serial Number",
                        `${panel.panelSerialNumber || "-"}`
                      )}
                      {returnPanelview(
                        "Panel Name",
                        `${panel.panelName || "-"}`
                      )}
                      {returnPanelview(
                        "Panel Control",
                        `${panel.panelControl || "-"}`
                      )}
                      {returnPanelview("Panel IP", `${panel.panelIp || "-"}`)}
                      {returnPanelview("HDMI Connectivity", "-")}
                      {returnPanelview("Panel Connectivity", "-")}
                      {returnPanelview("Last Connectivity", "-")}
                    </View>
                  );
                })}
            </>
          )}
        </View>
      </ScrollView>
      {/* {renderActionView()} */}
    </View>
  );
};

export default DeviceConsolidated;
