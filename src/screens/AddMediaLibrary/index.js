import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LeftArr from '../../Assets/Images/PNG/left_arr.png';
import TickIcon from '../../Assets/Images/PNG/tick.png';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import AppText from '../../Components/Atoms/CustomText';
import FileUploadStatus from '../../Components/Atoms/FileUploadStatus';
import Separator from '../../Components/Atoms/Separator';
import ThemedButton from '../../Components/Atoms/ThemedButton';
import CopyRightText from '../../Components/Molecules/CopyRightText';
import SuccessModal from '../../Components/Molecules/SuccessModal';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
// import {contentType} from './Constants';
import AddMediaStyles from './style';
import CreateNewHeader from '../../Components/Atoms/CreateNewHeader';
import DocumentPicker,{ types } from 'react-native-document-picker';
import axios from 'axios';
import { getStorageForKey } from '../../Services/Storage/asyncStorage';
import InputMedia from './InputMedia';
import { Modal, Title } from 'react-native-paper';
import ImageCropPicker from 'react-native-image-crop-picker';
import { getArchivedList, getMediaLibData } from '../../Services/AxiosService/ApiService';
import { NAVIGATION_CONSTANTS } from '../../Constants/navigationConstant';
import AppTextInput from '../../Components/Atoms/AppTextInputs';
import { moderateScale } from '../../Helper/scaling';
import { MediaLibraryService } from '../../Services/AxiosService';
import TextMediaAdd from './TextMediaAdd';
import Loader from '../../Components/Organisms/CMS/Loader';
import { baseUrl } from '../../Services/AxiosService/axios';
import ActionContainerMedia from '../../Components/Atoms/ActionContainerMedia';
import CampaignAddTag from '../../Components/Organisms/CMS/Campaign/CampaignAddTag';
import { useSelector } from 'react-redux';
import CampaignAddMediaTag from '../../Components/Organisms/CMS/Campaign/CampaignAddMediaTag';

 

const AddMediaLibrary = ({navigation}) => {
  const userData = useSelector((state) => state.userReducer.userDetails.data);

  const contentType = [
    {
      name: 'Video',
      path: require('../../Assets/Images/PNG/Video.png'),
      isShow:true
    },
    {
      name: 'Audio',
      path: require('../../Assets/Images/PNG/Audio.png'),
      isShow:true
    },
    {
      name: 'Image',
      path: require('../../Assets/Images/PNG/Image.png'),
      isShow:true
    },
    {
      name: 'Text',
      path: require('../../Assets/Images/PNG/text-format.png'),
      isShow:true
    },
    {
      name: 'PDF',
      path: require('../../Assets/Images/PNG/pdf.png'),
      isShow:true
    },
    {
      name: 'Doc',
      path: require('../../Assets/Images/PNG/Doc.png'),
      isShow:userData.customerType=="ADVANCED"?true:false,
    },
    {
      name: 'PPT',
      path: require('../../Assets/Images/PNG/ppt.png'),
      isShow:userData.customerType=="ADVANCED"?true:false,
    },
    {
      name: 'HTML',
      path: require('../../Assets/Images/PNG/html.png'),
      isShow:userData.customerType=="ADVANCED"?true:false,
    },
    {
      name: 'RSS',
      path: require('../../Assets/Images/PNG/rss.png'),
      isShow:userData.customerType=="ADVANCED"?true:false,
    },
    {
      name: 'TWITTER',
      path: require('../../Assets/Images/PNG/twitter.png'),
      isShow:userData.customerType=="ADVANCED"?true:false,
    },
    {
      name: 'FACEBOOK',
      path: require('../../Assets/Images/PNG/facebook.png'),
      isShow:userData.customerType=="ADVANCED"?true:false,
    },
    {
      name: 'URL',
      path: require('../../Assets/Images/PNG/url.png'),
      isShow:userData.customerType=="ADVANCED"?true:false,
    },
    {
      name: 'Stream URL',
      path: require('../../Assets/Images/PNG/stream.png'),
      isShow:userData.customerType=="ADVANCED"?true:false,
    },
  ];

  const themeColor = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
  const Styles = AddMediaStyles(themeColor);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [loaderState,setloaderState]=useState(false)
  const [uploadBtn,setUploadBtn]=useState(false)
  /***************/ 
  const [modal, setModal] = useState(false);
  const [isUploaded, setisUploaded] = useState(false);
  const [errTitle,setErrTitle]=useState([""])

  const [mediaUploaded,setmediaUploaded]=useState([]);

  const [tags,settags]=useState([])
  const [tagText, setTagText] = useState([]);
  
  const removeTag = (t,index) => {
    console.log(t,index)
    var taggg=[]
    if (t.length > 0) {
     taggg= t.splice(index, 1);
      settags([...tags]);
    }
    console.log("resukt",t,tags)
  };

  const [description,setdescription]=useState([""])
  const [title,setTitle]=useState([])

  const[uploadFile,setUploadFile]=useState([])
  const[uploadDOCTYpe,setuploadDOCTYpe]=useState([])
  const [isInputType,setisInputType]=useState(false)

  const call_getApi = async() => {
    const params = {
      page: 1,
      pageSize: 30,
      isArchive: false,
      };
   
    getArchivedList(setIsLoading, params,q="");
    getMediaLibData(setIsLoading, params,q="");
  };

  const formdata = new FormData();

  const updatetitle = (index, newValue) => {
    setTitle((prevMy) => {
      const newMy = [...prevMy];
      newMy[index] = newValue;
      return newMy;
    });
  };

  const updateDescription = (index, newValue) => {
    setdescription((prevMy) => {
      const newMy = [...prevMy];
      newMy[index] = newValue;
      return newMy;
    });
  };

  const updateTagsText = (index, newValue) => {
    setTagText((prevMy) => {
      const newMy = [...prevMy];
      newMy[index] = newValue;
      return newMy;
    });
  };

  // const [tags, setTags] = useState();

const updateTags = (key, newValue) => {
  const updatedTags = [...tags] ;
  const existingValue = updatedTags[key];

  if (existingValue) {
    // If the key already exists, concatenate the new value to the existing array
    updatedTags[key] = [...existingValue, newValue];
  } else {
    // If the key doesn't exist, create a new array with the new value
    updatedTags[key] = [newValue];
  }

  console.log("====>updatedTags",updatedTags)
  settags(updatedTags);
};

  const updateErrTitle = (index, newValue) => {
    setErrTitle((prevMy) => {
      const newMy = [...prevMy];
      newMy[index] = newValue;
      return newMy;
    });
  };

  const selectDoc = useCallback(async (file) => {
    console.log("selecteddoc type",file); 
    let response={}  
    
    try {
      if(file=="Image"){
         response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          allowMultiSelection:true,
          type:[DocumentPicker.types.images]
        });
      }else if(file=="PDF"){
         response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          allowMultiSelection:false,
          type:[DocumentPicker.types.pdf]
        });
      }else if(file=="Audio"){
         response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          allowMultiSelection:false,
          type:[DocumentPicker.types.audio]              //[DocumentPicker.types.audio]  ['audio/mp3','audio/wav']
        });
      }else if(file=="Video"){
        response = await DocumentPicker.pick({
         presentationStyle: 'fullScreen',
         allowMultiSelection:true,
         type:[DocumentPicker.types.video]
       });
     }
      else{
         response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          allowMultiSelection:false,
          type:[DocumentPicker.types.ppt,DocumentPicker.types.plainText,DocumentPicker.types.docx,DocumentPicker.types.doc,]
        });
      }
     
      // setFileResponse(response);
      console.log("tjis is docs",response)
      setUploadFile(response)
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const uploadMediafile=async()=>{

    // Alert.alert("op",JSON.stringify(uploadFile.length))
    // console.log("op\n\n\n\n",JSON.stringify(uploadFile));
    var myyi=0;
    const token = await getStorageForKey('authToken');
    const slugId=await getStorageForKey('slugId')
    const authHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      'Custom-Multipart-Header': 'true',
    };
    // for(const arrItems of uploadFile){
    //   alert(JSON.stringify(arrItems));
    // }

    var mediaarr=[]
    var newtitle=[]
    var newDesc=[]
    var newTags=[]

    while (myyi<uploadFile.length)
    {
        setIsLoading(true)
      setloaderState(true)
      //
      const formdata1 = new FormData();
      var data = new FormData();
      formdata1.append("file",{
        uri:uploadFile[myyi].uri,
        name:uploadFile[myyi].name,
        size:uploadFile[myyi].size,
        lastModified: new Date().getTime(),
        type:uploadFile[myyi].type,
      })
      console.log(myyi,JSON.stringify(formdata1),uploadFile[myyi].name);

      const onSuccess=async(resp)=>{
          setUploadBtn(false)
          if(resp.status==200){
            if(myyi+1==uploadFile.length){
              setModal(true)
              setisUploaded(true)
              setIsLoading(false)
              setloaderState(false)
            }
          // call_getApi()
           
            console.log(myyi,JSON.stringify(resp.data.data.mediaDetails[0]))
            mediaarr=[...mediaarr,resp.data.data.mediaDetails[0]]
            newtitle=[...newtitle,resp.data.data.mediaDetails[0].name]
            newDesc[myyi]=""
            newTags[myyi]=[]
            myyi=myyi+1;
          // me[myyi]=resp.data.data.mediaDetails[0].name
          // setTitle({...title,myyi})

          
        }
      }
      const onFailure=async(e)=>{
        setUploadBtn(false);
        if(myyi+1==uploadFile.length){
          setIsLoading(false)
          setloaderState(false)
        }
        myyi=myyi+1;
        Alert.alert("Error",e.message)
       
      }
      await axios.post(`${baseUrl}content-management/cms/${slugId}/v1/media/file`,
                        formdata1,
                        {headers:authHeader}
                      )
      .then(resp=>{onSuccess(resp)})
      .catch(e=>{onFailure(e)})
    }
    
    console.log("/n/n/n\n\n\n\n\nArrrrrrrrrrrrrrrrrrrrrrrrrr",newTags)
    setmediaUploaded(mediaarr);
    setTitle(newtitle);
    setdescription(newDesc);
    settags(newTags)


  }  

  const chooseMedia=async(name)=>{
    await setSelectedFileType(name);
    // var doctype=[]
    setUploadFile([])
  }

 

  const onComplete = () => {
    setModal(false);
    // navigation.goBack();
    // navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_LIBRARY);
  };

  const handleOnSave = async() => {
    const mYYArr=[]
    setIsLoading(true)
    // console.log(mediaUploaded,description,title,tags)
    
    let slugId = await getStorageForKey('slugId')
    
    var jj=0;
    while(jj<title.length){
      if(title[jj].trim()==""){
        updateErrTitle(jj,"Please enter title");
        mYYArr[jj]=false,
        setIsLoading(false)
      }else{
        updateErrTitle(jj,"");
        mYYArr[jj]=true
        setIsLoading(true)
      }
      jj=jj+1;
    }

    const token = await getStorageForKey('authToken');
    const authHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    let isErrTitle=""
    isErrTitle =await errTitle.indexOf("Please enter title");
    console.log("isErrTitle now",isErrTitle,errTitle,mYYArr)

    if((mYYArr.indexOf(false)==-1)){
        setIsLoading(true)
        console.log("isErrTitleisErrTitleisErrTitle",JSON.stringify(tags))
        var ii=0;
        
      while(ii<mediaUploaded.length)
      {
        let tagss=tags[ii];
        let campTag = []
            if(tags[ii].length > 0) {
            campTag = tags[ii].map((e)=>{
                return {title: e}
            })
           console.log(" campTag campTag",campTag)
            }
        let descc=description[ii];
        let mediaIDD=mediaUploaded[ii].mediaDetailId
        let titleee=title[ii]

        let params ={
          mediaDetailId:mediaIDD,
          "tags":campTag,
          description:descc,
          displayMode: "NORMAL",
          name:titleee ,
        }
    
        const successCallBack = async (response) => {
          // dispatch(updateMediaLib(response))
          console.log(response)
          if(response.status==200){          
            if(ii+1==mediaUploaded.length){
              // call_getApi()
              setIsLoading(false)
              setTimeout(()=>{
                navigation.goBack();
              },500)
              setModal(true)
            }
          }
          ii=ii+1;
          // setIsLoading(false)
          
        } 
      
        const errorCallBack = async (error) => {
          console.log("errorCallBackerrorCallBack\n",JSON.stringify(error),"\n\n\n")
          setIsLoading(false)
          ii=ii+1;
          
        }
        setIsLoading(false)
        await axios.put(`${baseUrl}content-management/cms/${slugId}/v1/media/${mediaIDD}?uploading=true`,
                          params,
                          {headers:authHeader}
                        )
        .then(resp=>{successCallBack(resp)})
        .catch(e=>{errorCallBack(e)})

      
      }
    }
    
    // setTimeout(()=>{setIsLoading(false)},1000)
  };
  
// ************************gallery ***********************//
  const [isOpenPicker, setIsOpenPicker] = useState(false);
  const [GalleryImage, setGalleryImage] = useState(null);

  const OpenCamera = async({ setModalVisible, setState }) => {
    try {
      await ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then((image) => {
        // console.log("imagr picker line244\n", image);
        setModalVisible(false);
        setState(image);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const PickImageFromGallery = async({ setModalVisible, setState }) => {
    try {
      // ImageCropPicker.openPicker
      await ImageCropPicker.openPicker({
        multiple: false,
        cropping: true
      }).then((images) => {
        console.log("Image from gallery", images);
        formdata.append("file", {
          uri: images.path,
          type: "image/jpg",
          name: "image"
        })
        // console.log(formdata)
        setModalVisible(false);
        setState(images);
      });
    } catch (error) {
      console.log("ooop", error);
    }
  };

  const PickerModal = ({ modalVisible, setModalVisible, setState }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={{ height: 400,display:"flex",justifyContent:"flex-end" }}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", }}
        >
          <View style={{
            position: "absolute",
            bottom: 20,
          }}
          >
            <Pressable onPress={() => OpenCamera({ setModalVisible, setState })}
              style={{
                opacity: 1,
                backgroundColor: "green",
                marginHorizontal: 20,
                borderRadius: 14,
                width: Dimensions.get("screen").width / 1.1,
                // margin: 20,
              }}
            >
              <AppText
                style={{
                  textAlign: "center",
                  padding: 14,
                  fontSize: 20,
                  color: "white",
                }}
              >
                Camera
              </AppText>
            </Pressable>
            <Pressable
              onPress={() =>
                PickImageFromGallery({ setModalVisible, setState })
              }
              style={{
                opacity: 1,
                backgroundColor: "blue",
                marginHorizontal: 20,
                borderRadius: 14,
                width: Dimensions.get("screen").width / 1.1,
                margin: 20,
              }}
            >
              <AppText
                style={{
                  textAlign: "center",
                  padding: 14,
                  color: "white",
                  fontSize: 20,
                }}
              >
                Gallery
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style={{
                opacity: 1,
                // backgroundColor: color.white,
                borderColor:"red",
                borderWidth:1,
                marginHorizontal: 20,
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "red",
                  padding: 14,
                  fontSize: 20,
                }}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderFileType = ({item, index}) => {
    return (item.isShow&&(
      <TouchableOpacity 
        onPress={() => chooseMedia(item.name)}
        style={Styles.itemContainer(selectedFileType === item.name)}>
        <Image
          source={item.path}
          style={Styles.iconImageStyle(selectedFileType === item.name)}
        />
        <AppText style={[Styles.filetype(selectedFileType === item.name)]}>
          {item.name}
        </AppText>
        {selectedFileType === item.name && (
          <View style={Styles.tickIcon}>
            <Image source={TickIcon} style={Styles.tickImage} />
          </View>
        )}
      </TouchableOpacity>
    )
    )
  };

  return (
    <View style={Styles.mainContainer}>
       <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Loader visible={isLoading}/>
      <ClockHeader />
      <ScrollView nestedScrollEnabled={true} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Add Media Library"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
        </View>
        <View style={Styles.bodyContainer}>
          
          
          {selectedFileType==""&&
          <>
            <AppText style={[Styles.bodyHeaderText]}>ADD MEDIA DETAILS</AppText>
            <Separator />
            <AppText style={[Styles.bodySubHeaderText]}>Choose Content Type</AppText>
            <FlatList
              scrollEnabled={false}
              data={contentType}
              numColumns={3}
              renderItem={renderFileType}
            />
          </>
          }

          {(selectedFileType=="Text"||selectedFileType=="HTML")?
            <TextMediaAdd type={selectedFileType} setModal={e=>setModal(e)}/>:
            (selectedFileType=="FACEBOOK"
              ||selectedFileType=="TWITTER"
              ||selectedFileType=="URL"
              ||selectedFileType=="Stream URL"
              ||selectedFileType=="RSS"
            )?
            <InputMedia type={selectedFileType}/>
            :<>
              { isUploaded==false&&selectedFileType!=""&&
              <View >
                <View style={Styles.uploadFileHere}>
                  <TouchableOpacity style={{alignItems:'center'}} 
                      onPress={()=>selectDoc(selectedFileType)}
                    >
                      <AppText style={[Styles.dropText]}>
                        Upload {selectedFileType} here*
                      </AppText>
                  </TouchableOpacity>
                </View>
                  {!isUploaded&&
                    <TouchableOpacity style={Styles.button}
                      disabled={uploadBtn} 
                      onPress={()=>{
                      if(uploadFile.length>0){
                        setUploadBtn(true);
                        uploadMediafile();
                      }else{
                        Alert.alert("Warning","Please enter media data ")
                      }
                      }}>
                      <AppText style={{color:"white"}}>Upload </AppText>
                    </TouchableOpacity>
                  }
                <View style={Styles.uploadMultpleFileCont}>
                    <FlatList
                    data={uploadFile}
                    renderItem={(item,i)=>{
                      return(<AppText style={{color: themeColor.textColor,marginVertical:5}}>
                      {item.item.name?item.item.name:"No file Choosen"}
                    </AppText>)
                    }}
                    />
                  </View>
              </View>
              }
              {loaderState&&!isUploaded?
                <>
                  <AppText style={{textAlign:"center"}}>Uploading... </AppText>
                  <ActivityIndicator/>
                </>:""
              }
              {
                (!loaderState&&isUploaded&&mediaUploaded.length>0)&&<>
                <FlatList
                data={mediaUploaded}
                renderItem={(item,i)=>{
                  const Index=item.index
                  return(
                    <View key={item.index}>
                      <View style={{marginHorizontal:10}}>
                        <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}>Title*{i} </AppText>
                        <AppTextInput
                        value={title[Index]}
                        onChangeText={e=>updatetitle(Index,e)}
                        placeHolderText=''
                        textInputStyle={{borderWidth:1,height:50,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                        />
                        {errTitle[Index]!=""&&<AppText style={{color:'red'}}>{errTitle[Index]}</AppText>}
                        <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}>Description</AppText>
                        <AppTextInput
                        value={description[Index]}
                        onChangeText={e=>updateDescription(Index,e)}
                        placeHolderText=''
                        textInputStyle={{borderWidth:1,height:50,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                        />
    
                        <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}>Tags</AppText>
                        {/* <AppTextInput
                        value={tags}
                        onChangeText={e=>updateTags(Index,e)}
                        onSubmitEditing={() => {
                          // updateTags(Index,tagText);
                          setTagText("")
                          console.log("===>tags",tags)
                          // setTempletTagArr([...templateTagArr, templateTag]);
                          // setTempletTag("");
                        }}
                        placeHolderText=''
                        textInputStyle={{borderWidth:1,
                          borderColor: themeColor.dashedBorder,
                          borderRadius:moderateScale(10),
                          height:50,}}
                        /> */}

                        <CampaignAddMediaTag
                          data ={tags[Index]}
                          templateTag={tagText[Index]}
                          removeTag={e=>removeTag(tags[Index],e)}
                          setTempletTag={(e)=>updateTagsText(Index,e)}
                          setTempletTagArr={()=>updateTags(Index,tagText[Index])}
                          templateTagArr={tags[Index]}
                        />
                        
                      </View>
                    </View>
                  )
                }}
                />
                <ActionContainerMedia onPressSave={() => handleOnSave()} onPressCancel={()=>navigation.goBack()} isContinue />
                </>
              }
              
            </>
          }
          {
            (selectedFileType=="Video"||selectedFileType=="Image"||selectedFileType=="Audio"
                ||selectedFileType=="Doc"||selectedFileType=="PDF"||selectedFileType=="PPT"
            )&& <View style={Styles.disclaimerView}>
                <AppText style={Styles.disclaimerHeading}>Disclaimer</AppText>
                <AppText style={Styles.disclaimerText}>
                  • Please use supported file types only*
                </AppText>
                <AppText style={Styles.disclaimerText}>
                  {selectedFileType=="Video"&&"• Video Files: wmv, avi, mpg, mpeg, flv, mov, mp4, mkv, vob, 3gp"}
                  {selectedFileType=="Image"&&"• Image File: .png,.jpg,.bmp,.gif,.tif,.tiff"}
                  {selectedFileType=="Audio"&&"• Audio File: .mp3,.wav"}
                  {selectedFileType=="Doc"&&"• Doc File: .docx,.doc"}
                  {selectedFileType=="PDF"&&"• PDF File: .pdf"}
                  {selectedFileType=="PPT"&&"• PPT File: .pptx,.ppt"}
                </AppText>
              </View>
          }
        </View>
        <CopyRightText
          containerStyle={{
            margin: 10,marginBottom:moderateScale(80)
          }}
        />
      </ScrollView>
      {modal && <SuccessModal Msg={"Media added successfully"} onComplete={onComplete} />}
      {isOpenPicker && (
            <PickerModal
              modalVisible={isOpenPicker}
              setModalVisible={setIsOpenPicker}
              setState={setUploadFile}
            />
          )
      }
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddMediaLibrary;
