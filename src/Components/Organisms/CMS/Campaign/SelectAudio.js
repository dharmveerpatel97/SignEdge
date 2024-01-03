import { View, Text, Pressable, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import CommonTitleAndText from "../../../Atoms/CommonTitleAndText";

export default function SelectAudio({
  data,
  setMediaModalType,
  setModal,
  removeAudio,
  isDisabled=false
}) {
  const themeColor = useThemeContext();
  const Styles = UIStyles(themeColor);
  return (
    <>
    <View style={Styles.campaignTagStyleContainer}>
      {data.map((item, ind) => {
        return (
          <TouchableOpacity
            onPress={(index) => {
                removeAudio(ind);
            }}
            key={item}
            style={Styles?.campaignTagStyle}
          >
            <Text style={[Styles.campaignTagText]}>{item.name}</Text>
            <Image
              style={Styles.campaignTagCrosImg}
              source={require("../../../../Assets/Images/PNG/close.png")}
            />
          </TouchableOpacity>
        );
      })}
    </View>
      <Pressable
        disabled={isDisabled}
        onPress={() => {
          setMediaModalType("audio");
          setModal(true);
        }}
      >
        <CommonTitleAndText title="Audio" text="Select Audio" textStyle= {{color:isDisabled ? themeColor.placeHolder:themeColor.black}}/>
      </Pressable>
    </>
  );
}

const UIStyles = (COLORS) => 
StyleSheet.create({
  campaignTagStyleContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
  },
  campaignTagStyle: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: COLORS.appBackground,
    marginLeft: 6,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  campaignTagCrosImg: {
    height: 10,
    width: 10,
    marginLeft: 7,
  },
  campaignTagText: {
    color: COLORS.textColor,
  },
});