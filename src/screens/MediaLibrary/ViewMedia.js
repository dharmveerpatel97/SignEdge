import {View, Text, ScrollView,StyleSheet,Button, Image, Dimensions, ActivityIndicator, Alert, Pressable,BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import CreateNewHeader from '../../Components/Atoms/CreateNewHeader';
import Separator from '../../Components/Atoms/Separator';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import MediaStyles from './style';
import {LocalDate, LocalDate1, moderateScale} from '../../Helper/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../../Components/Atoms/CustomText';
import TrackPlayer, 
{AppKilledPlaybackBehavior,
  Capability,State,usePlaybackState,
  RepeatMode,} from 'react-native-track-player';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {mediaImage} from './constants';
import Video from 'react-native-video'
import Pdf from 'react-native-pdf';
import HTMLView from "react-native-htmlview";
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames';
import { MediaApiService } from './MediaApi';
import { getStorageForKey } from '../../Services/Storage/asyncStorage';
import WebView from 'react-native-webview';
import { Platform } from 'react-native';
import Loader from '../../Components/Organisms/CMS/Loader';


const injectedCSS = `
    body {
      font-size: 16px;
      /* other styles */
    }
  `;

function secondsToTime(seconds)
{const regionHeight=250;
  var days     = Math.floor(seconds / (24*60*60));
  seconds -= days    * (24*60*60);
var hours    = Math.floor(seconds / (60*60));
  seconds -= hours   * (60*60);
var minutes  = Math.floor(seconds / (60));
  seconds -= minutes * (60);
return ((0<days)?(days+" day, "):"")+(hours?(hours+"h, "):"")+minutes+"m and "+seconds+"s";
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
const regionHeight="300px"
const ViewMedia = ({navigation, route}) => {

  const INJECTED_JAVASCRIPT = `(function() {
    window.ReactNativeWebView.postMessage(JSON.stringify(window.location));
})();`;

  const injectedJavaScript = `
  
  document.body.style.fontSize = '20px';
  var divv = document.getElementsByClassName("d-flex");
  divv.style.height  = "300px";
  const elediv=document.getElementsByTagName("div");
  elediv.style.fontSize="20px";
  
  true;
  `;

  const [isLoading,setIsLoading]=useState(null)
  const themeColor = useThemeContext();
  const [mediaDetails,setMediaDetails]=useState({});
  const [type, setType] = useState('');
  const videoPlayer = React.useRef()
  const [activeMusic, setActivemusic] = useState(false);

  const Styles = MediaStyles(themeColor);

  const [isPlaying, setIsPlaying] = React.useState(false);  
  const [isMuted, setIsMuted] = React.useState(false);
  
  const[videoInd,setvideoInd]=useState({opacity: 0})

  const data = route.params.data;

  const getMediaDataByID=async ()=>{    

    const slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const endPoint=`content-management/cms/${slugId}/v1/media/${data.mediaDetailId}`
    const successCallBack = async (response) => {      
      if(response.status=="OK"&&response.message=="success"){
        setMediaDetails(response.data.mediaDetails[0]);
        console.log("response.data.mediaDetails[0]",response.data.mediaDetails[0].htmlForMobile)
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
  
    const errorCallBack = (response) => {
     console.log("Error",response)
      setIsLoading(false);
    };
  
    MediaApiService.getMediaByID(
      { slugId, endPoint },
      successCallBack,
      errorCallBack
    );
  }

  onLoadStart = () => {
      setvideoInd({opacity: 1});
  }
  onEnd=()=>{
    setIsPlaying(false)
  }

  onLoad = () => {
      setvideoInd({opacity: 0});
  }

  onBuffer = ({isBuffering}) => {
      setvideoInd({opacity: isBuffering ? 1 : 0});
  }

  useEffect(() => {
    getMediaDataByID()
    setType(route.params.data.type);
    // setupPlayer();
  }, []);

  const [play, setPlay] = useState(false);
 
  const playerState = usePlaybackState();

  useEffect(() => {
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      if(type=='AUDIO'||type=="VIDEO"||type.toLowerCase()=='audio'||type.toLowerCase()=="video"){
      await TrackPlayer.reset()
      await TrackPlayer.remove()
      console.log("back btn press1",JSON.stringify(mediaDetails)) 
      if(type.toLowerCase()=='video'){
        videoPlayer.pause()
      }else{
        await TrackPlayer.pause();
      }
      navigation.goBack()     
    }
    console.log("back==================>",JSON.stringify(mediaDetails),123)
    navigation.goBack()
    await TrackPlayer.reset()
    return true
  })
    
  }, [navigation])

  const setupPlayer=async()=> {
    let isSetup = false;
    try {
      await TrackPlayer.getCurrentTrack();
      isSetup = true;
    }
    catch {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
        ],
        progressUpdateEventInterval: 2,
      });
  
      isSetup = true;
    }
    finally {
      return isSetup;
    }
  }
  

  const addTrack=async()=> {
    await TrackPlayer.add([
      {
        id: '1',
        url: data?.audioUrl,
        artwork: "",
        title: 'SIGNEDGE MUSIC',
        artist: 'Music',        
      },
    ]);
  }

  useEffect(() => {
    async function setup() {
      let isSetup = await setupPlayer();
      await addTrack();
      setPlay(isSetup);
    }
    setup();
  }, []);

  

  const renderTextView = (Heading, value) => {
    return (
      <View
        style={{flexDirection: 'row', alignItems: 'center',padding:10}}>
        <AppText style={[Styles.commonText,{paddingHorizontal: moderateScale(0)}]}>{Heading} {" : "}</AppText>        
        <AppText style={[Styles.commonText,{paddingHorizontal: moderateScale(0)}]}>{value}</AppText>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColor.white,
        }}>
      <ClockHeader />
      <Loader visible={isLoading}/>
      <View>
        <View style={[Styles.headerContainer,{paddingHorizontal:15}]}>
          <CreateNewHeader
            title={`Media Preview (${type})`}
            onClickIcon={async() => {
              navigation.goBack()
              if(type=='AUDIO'||type=="VIDEO"||type.toLowerCase()=='audio'||type.toLowerCase()=="video"){
                await TrackPlayer.pause();
                await TrackPlayer.reset();
              }
            }}
          />
        </View>
        {!isLoading&&<ScrollView bounces={false} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          <View style={Styles.subContainer}>
            <Separator />
            <View
              style={{
                paddingVertical: moderateScale(10),
                backgroundColor: themeColor.white,              
              }}>
              <View style={[Styles.bodyContainer,]}>

                {type==="HTML"||type=="TEXT"?<>
                  <WebView
                    source={{html: mediaDetails.htmlForMobile}}
                    minimumFontSize={15}
                    automaticallyAdjustContentInsets={false}
                    injectedJavaScript={`if (document.documentElement) {
                      document.documentElement.style.touchAction = 'manipulation';
                      document.body.style.touchAction = 'manipulation';
                      document.addEventListener('gesturestart', function (e) {
                        e.preventDefault();
                      });
                    }`}
                    setBuiltInZoomControls={Platform.OS === 'android'&&true}
                    setDisplayZoomControls={Platform.OS === 'android'&&false}
                    containerStyle={{fontSize:20}}
                    textZoom={300}
                    style={{
                      marginTop: 0,
                      // padding:10,
                      fontSize:20,
                      width:"100%",
                      height:250,
                      backgroundColor:mediaDetails.backgroundColor?mediaDetails.backgroundColor:'white',
                      borderWidth:1}}
                    
                  />
                  {/* </View> */}
                </>
                :type === 'IMAGE' ? (
                  <Image
                    source={{uri: data?.imageUrl}}
                    style={Styles.img}
                  />
                ) : type === 'AUDIO' ? 
                <View style={styles.container}>
                  
                  <View style={{alignItems:"center",marginVertical:10}}>
                  <Image
                    source={mediaImage.audio}
                    style={{
                      // width: '90%',
                      // height: 200,
                      resizeMode: 'contain',
                    }}
                  />
                  {!play&&<ActivityIndicator color={"red"}/>}
                  </View>

                  {!activeMusic?<Pressable 
                    style={{
                      height:moderateScale(40),
                      backgroundColor:themeColor.themeColor,
                      justifyContent:'center',
                      alignItems:'center',
                      borderRadius:10
                    }}
                    onPress={async () => {
                            setActivemusic(!activeMusic)
                              await TrackPlayer.play();
                              await TrackPlayer.setVolume(1); 
                          }} 
                  >
                    <Text 
                      style={{color:"white",
                      fontSize:moderateScale(14),
                      fontFamily:FONT_FAMILY.OPEN_SANS_BOLD}}>Play
                    </Text>
                  </Pressable>
                  :<Pressable 
                  style={{
                    height:moderateScale(40),
                    backgroundColor:themeColor.lightBlack,
                    justifyContent:'center',
                    alignItems:'center',
                    borderRadius:10
                  }}
                  onPress={async () => {
                    setActivemusic(!activeMusic)
                      await TrackPlayer.pause();
                      await TrackPlayer.setVolume(0);                       
                  }}
                >
                  <Text 
                    style={{color:"white",
                    fontSize:moderateScale(14),
                    fontFamily:FONT_FAMILY.OPEN_SANS_BOLD}}>Pause
                  </Text>
                </Pressable>
                }
                {/* <Text style={{color:"red"}}>{data?.audioUrl}</Text> */}
                </View>
                  
                :type=="VIDEO"?(
                  <>
                    <View style={[{height:"100%",width:"100%",}]}>  
                    <Video
                      ref={ref => (videoPlayer.current = ref)}
                      source={{uri:mediaDetails.videoUrl}}  
                      paused={!isPlaying}  
                      controls={false} 
                      resizeMode={mediaDetails.videoUrl&&"contain"} 
                      style={styles.backgroundVideo}  
                      muted={isMuted}
                      fullScreen={false}
                      onBuffer={onBuffer}
                      onLoad={onLoad}
                      onEnd={onEnd}
                      onLoadStart={onLoadStart} 
                    />  
                    <ActivityIndicator
                      animating
                      size="large"
                      color={themeColor.themeColor}
                      style={[{position: 'absolute',
                      top: 100,
                      left: 70,
                      right: 70,
                      height: 50,},
                      {opacity: videoInd.opacity}]}
                    />
                    <View style={{marginTop:moderateScale(120)}}>
                        <View style={{flexDirection:'row',marginTop:moderateScale(100),justifyContent:"space-evenly"}}>
                        <Pressable 
                          style={{
                            height:moderateScale(40),
                            backgroundColor:themeColor.themeColor,
                            width:moderateScale(80),
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                          }}
                          onPress={() => setIsPlaying(p => !p)}
                        >
                          <Text 
                            style={{color:"white",
                            fontSize:moderateScale(14),
                            fontFamily:FONT_FAMILY.OPEN_SANS_BOLD}}>
                              {isPlaying ? 'Stop' : 'Play'}
                          </Text>
                        </Pressable>

                        <Pressable 
                          style={{
                            height:moderateScale(40),
                            backgroundColor:themeColor.themeColor,
                            width:moderateScale(80),
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                          }}
                          onPress={() => setIsMuted(m => !m)}  
                        >
                          <Text 
                            style={{color:"white",
                            fontSize:moderateScale(14),
                            fontFamily:FONT_FAMILY.OPEN_SANS_BOLD}}>
                              {isMuted ? 'Unmute' : 'Mute'}
                          </Text>
                        </Pressable>
                        </View> 
                        <View
                            style={[Styles.subContainer,]}>
                            {renderTextView('Title', mediaDetails.name)}
                            {renderTextView('Type', `${data.type} (${mediaDetails.fileExtension})`)}
                            {renderTextView('Size', formatBytes(data.mediaSize))}
                            {renderTextView('Duration',secondsToTime(data.defaultDurationInSeconds))}
                            {renderTextView('Resolution', mediaDetails.mediaDimension?mediaDetails.mediaDimension:"NA")}
                            {renderTextView('Author', mediaDetails.fullName)}
                            {renderTextView('Created',LocalDate(data.createdOn))}
                          </View>
                        </View>
                  </View>
                  
                  </> 
                ):type=="STREAM_URL"?(
                  <View style={{height:300,justifyContent:"center",alignItems:"center"}}>  
                  <Image 
                    source={mediaImage.VideoImage}
                    style={styles.imgStyle}
                  />
                  </View>):type=="PDF"?(
                  <>
                  <View style={{height:Dimensions.get("window").height/2.5, justifyContent:"center",alignItems:"center"}}>  
                  <Pdf
                  trustAllCerts={false}
                  source={{uri:data?.pdfUrl}}
                  onLoadComplete={(numberOfPages,filePath) => {
                      console.log(`Number of pages: ${numberOfPages}`);
                  }}
                  onPageChanged={(page,numberOfPages) => {
                      console.log(`Current page: ${page}`);
                  }}
                  onError={(error) => {
                      console.log(error);
                  }}
                  onPressLink={(uri) => {
                      console.log(`Link pressed: ${uri}`);
                  }}
                  style={styles.pdf}
                  /> 
                                
                  </View>
                  <View  style={[Styles.subContainer,{height:Dimensions.get("window").height/3.3,justifyContent:'flex-start',top:60,paddingVertical:10}]}>
                    <AppText style={Styles.commonText1}>Title: {mediaDetails.name}</AppText>
                    <AppText style={Styles.commonText1}>Type: {mediaDetails.type}</AppText>
                    <AppText style={Styles.commonText1}>Size: {formatBytes(mediaDetails.mediaSize)}</AppText>
                    <AppText style={Styles.commonText1}>Duration: {secondsToTime(mediaDetails.defaultDurationInSeconds)}</AppText>
                    <AppText style={Styles.commonText1}>Author:{mediaDetails.fullName}</AppText>
                    <AppText style={Styles.commonText1}> Created: {LocalDate(data.createdOn)}</AppText>
                    
                  </View>
                  
                  </>):type=="URL"?(
                  <View style={{height:300,justifyContent:"center",alignItems:"center"}}>  
                  {/* <AppText>{data.url}</AppText> */}
                  <WebView
                    source={{html: `<iframe width="100%" height="100%" src=${data.url} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`}}
                    style={{marginTop: 20,width:moderateScale(400),backgroundColor:'white'}}
                  />
                  </View>):
                  (
                    <View style={{height:300,justifyContent:"center",alignItems:"center"}}>  
                      <Image 
                        source={type=="FACEBOOK"?mediaImage.facebook:mediaImage.url}
                        style={styles.imgStyle}
                      />
                    </View>
                  )
                }
              </View>
              {/* <Separator /> */}
            </View>
            <Separator />
          </View>
          {(type!="VIDEO"&&type!="PDF")&&<View
              style={Styles.subContainer}>
              {renderTextView('Title', data.name)}
              {renderTextView('Type', data.type)}
              {renderTextView('Size', formatBytes(data.mediaSize))}
              {renderTextView('Duration', secondsToTime(data.defaultDurationInSeconds))}
              {renderTextView('Resolution', mediaDetails.mediaDimension?mediaDetails.mediaDimension:"NA")}
              {renderTextView('Author', data.fullName)}
              {renderTextView(
                'Created',
                LocalDate(data.createdOn)
              )}
            </View>}
        </ScrollView>}
      </View>
    </View>
  );
};

var styles = StyleSheet.create({
  backgroundVideo: { 
    height:moderateScale(210),
    backgroundColor:'#000',
    width:"100%",
    // resizeMode:"contain",
    justifyContent:"center",
    alignItems:"center",
    position: 'absolute',
    
    // borderWidth:2,
    padding:5,
    // borderColor:'red',
    borderRadius:10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  pdf: {
    // flex:1,
    // paddingHorizontal:16,
    marginTop:10,
    paddingVertical:50,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height/1.5,
},
  imgStyle:{
    resizeMode: 'contain',
  }
});

export default ViewMedia;

const htmlstyles = StyleSheet.create({
  /********************************/
  /* styles for html tags */
  a: {
    fontWeight: "bold",
    fontSize:15,
    color: "purple",
  },
  marquee:{padding:20},
  div: {
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    fontSize:15,
    color:"white",
    
  },
  p: {
    fontSize: 15,
    color:'black'
  },
  /*******************************/
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#F5FCFF",
    fontSize:15,
    color:'black',
    padding:30
  },
  editor: {
    backgroundColor: "black",
    fontSize: 15,
    borderColor: "black",
    borderWidth: 1,
    fontSize:15,
    color:'black'
  },
  rich: {
    minHeight: 300,
    maxHeight:500,
    // flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: "#F5FCFF",
    fontSize:15,
    color:'black'
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    color:'black'
  },
  tib: {
    textAlign: "center",
    color: "black",
    fontSize:15,
    color:'black'
  },
});
