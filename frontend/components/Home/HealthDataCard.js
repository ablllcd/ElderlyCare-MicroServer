import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import TextStyle from '../../constants/TextStyle';


const HealthDataCard = ({ type, value }) => {
    const healthCardStructure = {
        heartRate: {
            icon: "heart-outline",
            color: Colors.pink300,
            bg: Colors.pink300a,
            unit: 'bpm',
            title: 'Heart Rate',
        },
        temperature: {
            icon: "thermometer-outline",
            color: Colors.cyan300,
            bg: Colors.cyan300a,
            unit: '℃',
            title: 'Temperature',
        },
        oxygenLevel: {
            icon: 'eyedrop-outline',
            color: Colors.blue300,
            bg: Colors.blue300a,
            unit: '%Sa-O2',
            title: 'Oxygen Level'
        }
    }
    return (
        <View style={[styles.cardContainer, { backgroundColor: healthCardStructure[type].bg }]}>
            <View style={styles.upper}>
                <Ionicons
                    name={healthCardStructure[type].icon}
                    size={Sizes.xs16}
                    color={healthCardStructure[type].color}
                />
                <Text
                    style={[
                        TextStyle.form_title,
                        { color: healthCardStructure[type].color }
                    ]}>
                    {healthCardStructure[type].title}
                </Text>
            </View>

            <View style={styles.lower}>
                <Text
                    style={{
                        color: healthCardStructure[type].color,
                        fontSize: Sizes.l40,
                        fontFamily: 'dm-bold'
                    }}>
                    {value}
                </Text>
                <Text
                    style={[
                        TextStyle.home_greeting,
                        { color: healthCardStructure[type].color }
                    ]}>
                    {healthCardStructure[type].unit}
                </Text>
            </View>

        </View>
    )
}

export default HealthDataCard;

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        padding: 20,
        rowGap: 15,
        width: 175,

    },
    upper: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5,
    },
    lower: {
        flexDirection: 'column',
        alignItems: 'baseline',
        columnGap: 5,
    }
});
