import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert } from "react-native";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";

import { moderateScale, width } from "../../Helper/scaling";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import Video from "react-native-video";
import Pdf from "react-native-pdf";

const CmpDetailMedia = ({ mediaArr, sliderValue }) => {
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  let intervalId;
  useEffect(() => {
    let interValTime = 0;
    if (
      mediaArr[currentIndex]?.nodata ||
      !mediaArr[currentIndex]?.defaultDurationInSeconds
    ) {
      interValTime = 0;
    } else {
      interValTime =
        parseInt(mediaArr[currentIndex]?.defaultDurationInSeconds) * 1000;
    }
    intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaArr.length);
    }, interValTime);
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  let CalculateFunction = () => {
    console.log("CalculateFunction");
    let tot = 0;
    let mArray = mediaArr;
    for (let index = 0; index < mArray.length; index++) {
      const element = mArray[index];
      tot = tot + element?.defaultDurationInSeconds;
      if (tot >= sliderValue) {
        setCurrentIndex(index);
        break;
      }
    }
    clearInterval(intervalId);
  };

  useEffect(() => {
    console.log("sliderValue", sliderValue);
    if (sliderValue != 0) {
      CalculateFunction();
    }
  }, [sliderValue]);

  const returnMediaView = () => {
    let item = mediaArr[currentIndex];
    if (!item) {
      return (
        <Text style={{ width: "100%", height: "100%" }}>Content not found</Text>
      );
    }
    if (item?.type == "VIDEO") {
      return (
        <Pressable
          onPress={() => {
            setIsPlaying(!isPlaying);
          }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
        >
          <Video
            source={{
              uri: `${item?.videoUrl}`,
            }}
            resizeMode="contain"
            paused={isPlaying}
            style={{
              flex: 1,
            }}
            muted={isMuted}
          />
        </Pressable>
      );
    } else if (item?.type == "IMAGE") {
      return (
        <View style={{ backgroundColor: "#00000" }}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      );
    } else if (item?.type == "PDF") {
      return (
        <Pdf
          trustAllCerts={false}
          source={{ uri: item?.pdfUrl }}
          enablePaging={true}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={{ width: "100%", height: "100%" }}
        />
      );
    } else if (item?.type == "TEXT") {
      return (
        <Text style={{ width: "100%", height: "100%" }}>
          {" "}
          {item.htmlForMobile}
        </Text>
      );
    } else {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../Assets/Images/PNG/document.png")}
            style={{ height: 50, width: 50 }}
          />
          <Text style={{ color: "#000", fontSize: 20 }}>
            {" "}
            {item?.name ? item?.name : "Content not found"}
          </Text>
        </View>
      );
    }
  };

  return <View style={Styles.fullFlex}>{returnMediaView()}</View>;
};

export default CmpDetailMedia;

const CampaignStyles = (COLORS) =>
  StyleSheet.create({
    regionContainer: (item) => ({
      height: `${item.heightInPercentage}%`,
      width: `${item.widthInPercentage}%`,
      borderWidth: 1,
      borderStyle: "dashed",
      position: "absolute",
      top: `${item.topLeftCoordinateYInPercentage}%`,
      left: `${item.topLeftCoordinateXInPercentage}%`,
      justifyContent: item.contentToDisplay ? "flex-end" : "center",
    }),
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    fullFlex: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: moderateScale(10),
      alignSelf: "baseline",
    },
    totalRecords: {
      margin: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(13),
    },
    campaignContainer: (active) => ({
      width: "100%",
      height: moderateScale(120),
      borderRadius: moderateScale(5),
      borderWidth: moderateScale(2),
      borderColor: active ? COLORS.themeColor : "#0000000F",
      backgroundColor: COLORS.placeHolder,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    }),
  });
