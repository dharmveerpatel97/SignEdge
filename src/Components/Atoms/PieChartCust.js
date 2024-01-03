import { View, Text } from 'react-native'
import React from 'react'
import { PieChart } from "react-native-gifted-charts";
import { width } from '../../Helper/scaling';
export default function PieChartCust({data}) {
  
  return <PieChart 
          data={data} 
          showText
          radius={width*0.22}
          textColor="black"
          textSize={13}
          
        />;
}