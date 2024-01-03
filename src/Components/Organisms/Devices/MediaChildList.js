import React from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FONT_FAMILY} from '../../../Assets/Fonts/fontNames';
import {moderateScale} from '../../../Helper/scaling';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import AppText from '../../Atoms/CustomText';
import Actions from '../../Atoms/PlanogramActions';
import ThemedText from '../../Atoms/ThemedText';
import Feather from 'react-native-vector-icons/Feather';
import MoveFolder from '../../../Assets/Images/PNG/moveassign.png';
const MediaChildList = ({data}) => {
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.textView]}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };

  const getBackgroundColor = value => {
    if (value === 'Published') {
      return {
        backgroundColor: themeColor.pubGreenBack,
      };
    } else if (value === 'Submitted') {
      return {
        backgroundColor: themeColor.themeLight,
      };
    } else if (value === 'Draft') {
      return {
        backgroundColor: themeColor.draftYellowBack,
      };
    }
  };

  const getTextColor = value => {
    if (value === 'Published') {
      return {
        color: themeColor.pubGreen,
      };
    } else if (value === 'Submitted') {
      return {
        color: themeColor.themeColor,
      };
    } else if (value === 'Draft') {
      return {
        color: themeColor.draftYellow,
      };
    }
  };

  const renderState = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.stateView]}>
        <ThemedText
          title={value}
          containerStyle={[Styles.statusView, getBackgroundColor(value)]}
          textStyles={getTextColor(value)}
        />
      </View>
    );
  };
  const renderAction = () => {
    return (
      <View style={[Styles.commonView, {width: '19%'}]}>
        <View style={Styles.iconBackContainer}>
          <View style={Styles.iconBackView}>
            {/* <Feather name="edit" size={20} color={themeColor.themeColor} />
             */}
            <Image source={MoveFolder} style={Styles.iconStyle} />
          </View>
          <View style={Styles.iconBackView}>
            <MaterialIcons
              name="delete"
              size={20}
              color={themeColor.themeColor}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderCampaignRow = ({item, index}) => (
    <View style={Styles.renderCampaignContainer}>
      <View style={Styles.iconView}>
        <MaterialIcons
          name="check-box-outline-blank"
          color={themeColor.white}
          size={25}
        />
      </View>
      <View style={Styles.campaignNameView}>
        <MaterialIcons
          name="check-box-outline-blank"
          color={themeColor.themeColor}
          size={25}
        />
        <AppText style={Styles.campaignNameText}>{item.campaignName}</AppText>
      </View>
      {renderState(item.state, index)}
      {renderTextView(item.location, index)}

      {renderAction()}
    </View>
  );
  const HeaderComp = () => {
    return (
      <View style={Styles.campaignHeaderText}>
        <View style={Styles.iconView}>
          <MaterialIcons
            name="check-box-outline-blank"
            color={themeColor.white}
            size={25}
          />
        </View>
        <View
          style={[
            Styles.campaignNameView,
            {backgroundColor: themeColor.cardBorder},
          ]}>
          <AppText style={Styles.boldText}>Device/MP Name</AppText>
        </View>
        <View
          style={[Styles.commonView, {backgroundColor: themeColor.cardBorder}]}>
          <AppText style={Styles.boldText}>Status</AppText>
        </View>
        <View
          style={[Styles.commonView, {backgroundColor: themeColor.cardBorder}]}>
          <AppText style={Styles.boldText}>Location</AppText>
        </View>
      </View>
    );
  };

  return (
    <View style={Styles.campaignContainer}>
      <FlatList
        data={data}
        renderItem={renderCampaignRow}
        ListHeaderComponent={HeaderComp}
      />
    </View>
  );
};

export default MediaChildList;

const CampaignStyles = COLORS =>
  StyleSheet.create({
    renderCampaignContainer: {
      flexDirection: 'row',
    },
    campaignContainer: {
      backgroundColor: '#E6E9F2',
      //   paddingStart: 30,
    },
    campaignNameView: {
      width: '35%',
      backgroundColor: '#F9F9FB',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    campaignNameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      marginStart: moderateScale(10),
    },
    commonView: {
      width: '19%',
      marginHorizontal: moderateScale(1),
      backgroundColor: '#F9F9FB',
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(8),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    boldText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginVertical: moderateScale(10),
    },
    campaignHeaderText: {
      flexDirection: 'row',
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(10),
    },
    iconBackView: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
    },
    iconBackContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(2),
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: 'contain',
    },
  });
