import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import Video from "react-native-video";
import TrackPlayer, { Capability } from "react-native-track-player";
import Pdf from "react-native-pdf";
export default function CampaignRegion({
  selectedBgImg = null,
  regions = [],
  selectMediaForRegion,
  setSelectetRegionForEdit,
  removeRegionData,
  setCmpArrangeModal,
  setActiveRegion,
  setLocationName
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const returnMediaView = (item) => {
    let displayMode = item?.displayMode
    console.log('displayModedisplayMode', displayMode)
    if (item?.type == "VIDEO") {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
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
         
        </View>
      );
    } else if (item?.type == "IMAGE") {
      return (
        <View style={{}}>
          <Image
            source={{ uri: item?.imageUrl }}
            style={{ width: "100%", height: "100%",resizeMode:displayMode=="NORMAL" ? 'contain':'stretch' }}
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
          {item?.htmlForMobile}
        </Text>
      );
    } else if (item?.type == "URL") {
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
            source={require("../../../../Assets/Images/PNG/flash.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text style={{ color: "#000", fontSize: 20 }}> {item?.name}</Text>
        </View>
      );
    } else if (item?.type == "RSS") {
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
            source={require("../../../../Assets/Images/PNG/flash.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text style={{ color: "#000", fontSize: 20 }}> {item?.name}</Text>
        </View>
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
            source={require("../../../../Assets/Images/PNG/document.png")}
            style={{ height: 50, width: 50 }}
          />
          <Text style={{ color: "#000", fontSize: 20 }}> {item?.name}</Text>
        </View>
      );
    }
  };
  return (
    <>
      {(regions && regions.length) > 0 && (
        <>
          {regions.map((item, index) => {
            let tp = 1;
            if(item?.regionTransparencyInPercentage){
              tp=1-item?.regionTransparencyInPercentage;
            }
          
            console.log('tp-----',tp)
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectetRegionForEdit(index);
                  item.locations?.length>0 ? setLocationName(item.locations[0]?.locationName):setLocationName("")
                  console.log(item,'regionitem');
                }}
                activeOpacity={1}
                key={"campaign" + index}
                style={[styles.regionContainer(item,tp),{zIndex:99}]}
              > 
                <View style={styles.regionNameContainer} >
                  <Text style={{ color: "#ffffff",fontSize:12 }}>
                    {item.templateRegionName}
                  </Text>
                  {
                    item?.regionData?.length ?
                    <View style={{ flexDirection: "row" }}>
                      <Pressable style={{backgroundColor:'#fff',padding:2,borderRadius:7,justifyContent:'center',alignItems:'center' }} onPress={() => {
                      selectMediaForRegion(index);
                    }}>
                        <Image
                          source={require("../../../../Assets/Images/PNG/select.png")}
                          style={{ height: 20, width: 20, resizeMode: "contain" }}
                        />
                      </Pressable>
                      <Pressable style={{ marginLeft: 15,backgroundColor:'#fff',padding:2,borderRadius:7,justifyContent:'center',alignItems:'center' }} onPress={()=>{
                        setCmpArrangeModal(true)
                        setActiveRegion(index)
                      }}>
                        <Image
                          source={require("../../../../Assets/Images/PNG/view.png")}
                          style={{ height: 20, width: 20, resizeMode: "contain" }}
                        />
                      </Pressable>
                      <Pressable style={{  marginLeft: 15,backgroundColor:'#fff',padding:2,borderRadius:7,justifyContent:'center',alignItems:'center' }} onPress={()=>{
                        removeRegionData(index)
                        setActiveRegion(index)
                      }}>
                        <Image
                          source={require("../../../../Assets/Images/PNG/delete-button.png")}
                          style={{ height: 20, width: 20, resizeMode: "contain" }}
                        />
                      </Pressable>
                    </View>
                    :
                    <></>
                  }
                </View>

                {item?.regionData?.length > 0 ? (
                  <>{returnMediaView(item?.regionData[0], index)}</>
                ) : (
                  <Pressable
                    onPress={() => {
                      selectMediaForRegion(index);
                    }}
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      source={require("../../../../Assets/Images/PNG/select.png")}
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />
                    <Text style={{ color: "#000", fontSize: 12 }}>
                      Add Media
                    </Text>
                  </Pressable>
                )}
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </>
  );
}

var styles = StyleSheet.create({
  mainContainer: {
    height: 400,
    width: "100%",
    backgroundColor: "#000000",
    position: "relative",
    borderRadius: 2,
  },
  imageBackgroundContainer: {},
  imageBacground: {
    height: "100%",
    width: "100%",
    borderWidth: 0.5,
    borderRadius: 2,
  },

  regionContainer: (item,tp) => ({
    height: `${item.heightInPercentage}%`,
    width: `${item.widthInPercentage}%`,
    borderWidth: 1,
    borderStyle: "dashed",
    position: "absolute",
    opacity: tp,
    top: `${item.topLeftCoordinateYInPercentage}%`,
    left: `${item.topLeftCoordinateXInPercentage}%`,
    justifyContent: "center",
    alignItems: item?.regionData?.length <= 0 ? "center" : null,
    backgroundColor:"#dfe0f2"
  }),
  regionNameContainer: {
    alignSelf: "center",
    position: "absolute",
    top: 1,
    backgroundColor: "#000000",
    zIndex: 99,
    width: "100%",
    paddingVertical: 5,
    paddingLeft: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 8,
  },
});
