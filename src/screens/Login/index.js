import React, { useEffect, useState } from "react";
import { Alert, Image, ImageBackground, Keyboard, View } from "react-native";
import { useDispatch } from "react-redux";
import BackgroundImage from "../../Assets/Images/PNG/login-bg.jpeg";
import panasonicWhiteLogo from "../../Assets/Images/PNG/panasonicWhiteLogo.png";
import PanasonicBg from "../../Assets/Images/PNG/PanasonicBg.jpg";
import SignEdgeLogon from "../../Assets/Images/PNG/signedge-logo.png";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { AuthenticationService } from "../../Services/AxiosService";
import {
  removeKeyInStorage,
  setStorageForKey,
} from "../../Services/Storage/asyncStorage";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  disableLoader,
  enableLoader,
} from "../../appConfig/Redux/Action/commonAction";
import LoginStyles from "./style";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import { AWSTOKEN } from "../../Constants/context";
import AppText from "../../Components/Atoms/CustomText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "react-native-gifted-charts/src/LineChart/styles";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import { jwtDecode } from "jwt-decode";
import {
  setIsScheduler,
  setUserAuthorizations,
} from "../../appConfig/Redux/Action/userAction";
import { moderateScale } from "../../Helper/scaling";

bgImage =
  "https://a-static.besthdwallpaper.com/artistic-anime-japan-wallpaper-2560x1600-89950_7.jpg";

const Login = ({ navigation }) => {
  const Buffer = require("buffer").Buffer;

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [email, setEmail] = useState(""); //cugnaregno@gufum.com  qmstest1@yopmail.com
  const [password, setPassword] = useState(""); //Neuro@123
  const [CustomerId, setCustomerId] = useState(""); //SM7KA 0VSRF
  const [emailError, setEmailError] = useState(false);
  const dispatch = useDispatch();
  const themeColor = useThemeContext();
  const Styles = LoginStyles(themeColor);
  const [errCustomerId, setErrCustomerId] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPassword, setErrPassword] = useState(false);
  const [Msg, setMsg] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      removeKeyInStorage("is_scheduler_enabled");
    });
    return unsubscribe;
  }, []);
  const handleForgetChecks = () => {
    if (CustomerId == "") {
      setErrCustomerId(true);
    } else {
      setErrCustomerId(false);
    }

    if (email == "") {
      setErrEmail(true);
    } else {
      setErrEmail(false);
    }
    if (email != "" && CustomerId != "") {
      handleForgetPassword();
    }
  };

  const handleLogValidation = () => {
    if (CustomerId.trim() == "") {
      setErrCustomerId(true);
    } else {
      setErrCustomerId(false);
    }

    if (email.trim() == "") {
      setErrEmail(true);
    } else {
      setErrEmail(false);
    }

    if (password.trim() == "") {
      setErrPassword(true);
    } else {
      setErrPassword(false);
    }
    if (email != "" && password != "" && CustomerId != "") {
      handleLogin();
    }
  };

  const handleForgetPassword = () => {
    if (emailRegex.test(email)) {
      dispatch(enableLoader());
      const params = {
        CustomerId,
        type: "Bearer",
      };
      const params2 = {
        email,
        slugName: null,
        credential: Buffer(`client:admin`).toString("base64"),
        type: "Basic",
      };

      Keyboard.dismiss();
      const successCallback = async (response) => {
        console.log("successCallback lin61", response);
        dispatch(disableLoader());
        if ("error" in response) {
          Alert.alert("Invalid CustomerId!", "Please check Customer ID.");
        } else {
          await setStorageForKey("slugId", response?.data);
          AuthenticationService.forgetPassword(
            { ...params2, slugName: response?.data },
            successCallback2,
            errorCallback2
          );
        }
      };

      const errorCallback = (error) => {
        console.log("slug name error", error.message);
        dispatch(disableLoader());
        if (error?.message === "Network Error") {
          Alert.alert(
            "Internet error",
            `${error?.message} Please check the internet connection`
          );
        } else if (error?.code === "ERR_BAD_REQUEST") {
          Alert.alert("Invalid CustomerId!", "Please check Customer ID.");
        } else {
          Alert.alert(
            "Uncatched Error!",
            "Oop's something wrong, Please try agin later."
          );
        }
      };

      const successCallback2 = async (response) => {
        console.log("login new accesstoken", JSON.stringify(response));
        if ("error" in response) {
          dispatch(disableLoader());
          Alert.alert(
            "Invalid credentials!",
            "Please enter correct Email and ClientId"
          );
        } else {
          // const userDetails = {
          //   slugId: response?.slugId,
          //   customerId: response?.customer_id
          // }

          if (response.httpStatusCode == 200) {
            setMsg("Link Sent Successfully");
            setIsSuccess(true);
          } else {
            Alert.alert("Error", "Please check enter email and customer id");
          }
        }

        dispatch(disableLoader());
      };

      const errorCallback2 = (error) => {
        console.log(error?.message);

        dispatch(disableLoader());
        if (error?.message === "Network Error") {
          // Alert.alert('Internet error', 'Please check the internet connection');
        } else {
          Alert.alert(
            "Uncatched Error!",
            "Oop's something wrong, Please try again later."
          );
        }
      };

      AuthenticationService.fetchSlugName(
        params,
        successCallback,
        errorCallback
      );
    } else {
      setEmailError(true);
    }
  };

  const handleLogin = () => {
    if (emailRegex.test(email)) {
      dispatch(enableLoader());
      const params = {
        CustomerId,
        type: "Bearer",
      };
      const params2 = {
        email,
        password,
        slugName: null,
        credential: Buffer(`client:admin`).toString("base64"),
        type: "Basic",
      };

      Keyboard.dismiss();
      const successCallback = async (response) => {
        console.log("successCallback lin193", response);
        dispatch(disableLoader());
        if ("error" in response) {
          Alert.alert("Invalid CustomerId!", "Please check Customer ID.");
        } else {
          await setStorageForKey("slugId", response?.data);
          AuthenticationService.login(
            { ...params2, slugName: response?.data },
            successCallbacklogin,
            errorCallbacklogin
          );
        }
      };

      const errorCallback = (error) => {
        console.log(error.message);
        dispatch(disableLoader());
        if (error?.message === "Network Error") {
          Alert.alert(
            "Internet error",
            `${error?.message} Please check the internet connection`
          );
        } else if (error?.code === "ERR_BAD_REQUEST") {
          Alert.alert("Invalid CustomerId!", "Please check Customer ID.");
        } else {
          Alert.alert(
            "Uncatched Error!",
            "Oop's something wrong, Please try agin later."
          );
        }
      };

      const successCallbacklogin = async (response) => {
        console.log("login new accesstoke33333333333n", JSON.stringify(response));
        
       
        if (response.hasOwnProperty('error')) {
          dispatch(disableLoader());
          Alert.alert(
            "Invalid credentials!",
            "Please check email ID or password"
          );
        } else if (response.hasOwnProperty("access_token")) {
          const decodedHeader = jwtDecode(response?.access_token);
          console.log("decodedHeader", JSON.stringify(decodedHeader));
          dispatch(setUserAuthorizations(decodedHeader?.authorities));
          dispatch(setIsScheduler(decodedHeader?.is_scheduler_enabled));
  
          await setStorageForKey(
            "authorities",
            JSON.stringify(decodedHeader?.authorities)
          );
          
          const userDetails = {
            slugId: response?.slugId,
            customerId: response?.customer_id,
            // decodeToken:decodeToken
          };
          await setStorageForKey("userDetails", userDetails);
          await setStorageForKey("authToken", response?.access_token);
          await setStorageForKey(
            "is_scheduler_enabled",
            response?.is_scheduler_enabled
          );
          await setStorageForKey("logged", true);
          setIsSuccess(true);
          setMsg("Login Successfully");
          setTimeout(() => {
            navigation.navigate(NAVIGATION_CONSTANTS.DRAWER_STACK);
          }, 800);
        }

        dispatch(disableLoader());
      };

      const errorCallbacklogin = (error) => {
        console.log("errorCallback2==>", error?.message);
        dispatch(disableLoader());
        if (error?.message === "Network Error") {
          // Alert.alert('Internet error', 'Please check the internet connection');
        } else {
          Alert.alert(
            "Uncatched Error!",
            "Oop's something wrong, Please try again later."
          );
        }
      };

      AuthenticationService.fetchSlugName(
        params,
        successCallback,
        errorCallback
      );
    } else {
      setEmailError(true);
    }
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (value) => {
    if (emailRegex.test(value)) {
      return true;
    }
    return false;
  };

  return (
    <View style={Styles.mainContainer}>
      <ImageBackground style={Styles.backgroundImage} source={PanasonicBg}>
        {isSuccess ? (
          <SuccessModal Msg={Msg} onComplete={() => setIsSuccess(false)} />
        ) : (
          ""
        )}
        <View
            style={{
              position: "absolute",
              top: 0,
              right: 1,

              // backgroundColor:'white'
            }}
          >
            <Image source={panasonicWhiteLogo} />
          </View>
        <View style={{backgroundColor:themeColor.white,
          paddingHorizontal:5,
          // justifyContent:'center',
          alignItems:'center',
          paddingVertical:moderateScale(25),
          borderRadius:10,
          marginHorizontal:3,
          minWidth:'98%'}}>
          
          <Image source={SignEdgeLogon} />
          {isLogin ? (
            <>
              <View style={{marginVertical:10,marginHorizontal:5,justifyContent: "center",
                         alignSelf: 'center',}}>
              <AppText style={Styles.txt}>
                Please fill in details to continue to your Signedge dashboard
                </AppText>
                <AppTextInput
                  value={CustomerId}
                  placeHolderText="Customer ID"
                  onChangeText={(value) => setCustomerId(value)}
                  placeholderTextColor={themeColor.placeHolder}
                  textInputStyle={Styles.passwordInput}
                />
                {errCustomerId && (
                  <AppText style={Styles.warningTxt}>
                    Please enter customer id
                  </AppText>
                )}
                <AppTextInput
                  value={email}
                  placeHolderText="Email"
                  onChangeText={(value) => {
                    setEmail(value);
                    if (validateEmail(value)) {
                      setEmailError(false);
                    } else {
                      setEmailError(true);
                    }
                  }}
                  placeholderTextColor={themeColor.placeHolder}
                  textInputStyle={Styles.passwordInput}
                />

                {(emailError || errEmail) && (
                  <AppText style={Styles.warningTxt}>
                    Please enter valid email{" "}
                  </AppText>
                )}
                <View style={[Styles.passwordInput, Styles.passCont]}>
                  <AppTextInput
                    value={password}
                    placeHolderText="Password"
                    onChangeText={setPassword}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={[
                      Styles.passwordInput2,
                      { maxWidth: "95%", width: "95%", minWidth: "94%" },
                    ]}
                    secureTextEntry={!showPassword}
                  />
                  <MaterialCommunityIcons
                    name={!showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#aaa"
                    style={{ marginLeft: 0, width: "8%" }}
                    onPress={toggleShowPassword}
                  />
                </View>
                {errPassword && (
                  <AppText style={Styles.warningTxt}>
                    Please enter password{" "}
                  </AppText>
                )}

                <TouchableOpacity
                  style={{ marginTop: 10 }}
                  onPress={() => setIsLogin(false)}
                >
                  <AppText style={Styles.forgotTxt}>Forgot Password?</AppText>
                </TouchableOpacity>
              </View>
              <ThemedButton
                title="Sign In"
                containerStyle={Styles.themeButton}
                onClick={() => {
                  handleLogValidation();
                }}
              />
            </>
          ) : (
            <>
              <View style={{marginVertical:10,marginHorizontal:2,justifyContent: "center",
                         alignSelf: 'center',}}>
                <AppText style={Styles.txt}>
                  Please enter customer id & email to send password reset link to
                  your email id
                </AppText>
                <AppTextInput
                  value={CustomerId}
                  placeHolderText="Customer ID"
                  onChangeText={(value) => setCustomerId(value)}
                  placeholderTextColor={themeColor.placeHolder}
                  textInputStyle={[
                    Styles.passwordInput,
                    { maxWidth: "100%", width: "100%", minWidth: "99%" },
                  ]}
                />
                {errCustomerId && (
                  <AppText style={Styles.warningTxt}>
                    Please enter customer id
                  </AppText>
                )}
                <AppTextInput
                  value={email}
                  placeHolderText="Email"
                  onChangeText={(value) => {
                    setEmail(value);
                    if (validateEmail(value)) {
                      setEmailError(false);
                    } else {
                      setEmailError(true);
                    }
                  }}
                  placeholderTextColor={themeColor.placeHolder}
                  textInputStyle={Styles.passwordInput}
                />
                {(emailError || errEmail) && (
                  <AppText style={Styles.warningTxt}>
                    Please enter valid email{" "}
                  </AppText>
                )}
                <TouchableOpacity
                  style={{ marginTop: 10 }}
                  onPress={() => setIsLogin(true)}
                >
                  <AppText style={[Styles.forgotTxt,{marginVertical:10}]}>
                    Already have a Panasonic account? Sign in
                  </AppText>
                </TouchableOpacity>
              </View>
              <ThemedButton
                title="Submit"
                containerStyle={Styles.themeButton}
                onClick={() => {
                  handleForgetChecks();
                }}
              />
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default Login;
