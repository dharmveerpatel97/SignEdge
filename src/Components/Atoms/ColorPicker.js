import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { moderateScale } from "../../Helper/scaling";
import Ionicons from "react-native-vector-icons/Ionicons";
import CommonTitleAndText from "./CommonTitleAndText";
import AppText from "./CustomText";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import ColorPicker from "react-native-wheel-color-picker";

const ColorModalPicker = ({ setModal, modal_flag, setBgColor }) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  return (
    <Modal
      visible={modal_flag}
      trasparent={true}
      style={{
        flex: 1,
        backgroundColor: "#00000080",
        width: "100%",
        paddingHorizontal: 12,
      }}
    >
      <View
        style={{
          backgroundColor: "#ffffff",
          height: moderateScale(250),
          paddingVertical: 10,
          paddingHorizontal: 8,
        }}
      >
        <ColorPicker
          color={"#ffffff"}
          onColorChange={(color) => {
            setBgColor(color)
          }}
        //   onColorChangeComplete={(color) => {
        //     setBgColor(color)
        //   }}
          thumbSize={40}
          sliderSize={40}
          noSnap={true}
          sliderHidden={true}
          row={false}
          swatchesOnly={false}
          discrete={true}
        />
        <TouchableOpacity
          onPress={() => setModal(false)}
          style={Styles.closeStyle}
        >
          <Ionicons name="close" size={20} color={themeColor.unselectedText} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ColorModalPicker;

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
      justifyContent: "center",
    },
    imageContainerView: {
      backgroundColor: COLORS.white,
      margin: moderateScale(15),
      borderRadius: moderateScale(20),
      padding: moderateScale(10),
    },
    imageStyle: {
      height: moderateScale(300),
      width: "100%",
      borderRadius: moderateScale(20),
    },
    closeStyle: {
      position: "absolute",
      top: moderateScale(0),
      right: moderateScale(0),
      backgroundColor: "white",
      borderRadius: moderateScale(15),
      borderWidth: moderateScale(2),
      borderColor: COLORS.unselectedText,
      padding: moderateScale(5),
    },
    titleStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: COLORS.placeHolder,
    },
    mainContainer1: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
