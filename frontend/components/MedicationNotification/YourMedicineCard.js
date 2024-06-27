import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import TextStyle from '../../constants/TextStyle';
import Colors from '../../constants/Colors';

import capsule from '../../assets/app/medicineType/capsule.png';
import pill from '../../assets/app/medicineType/pill.png';
import liquid from '../../assets/app/medicineType/liquid.png';
import apply from '../../assets/app/medicineType/apply.png';
import others from '../../assets/app/medicineType/others.png';

const YourMedicineCard = ({ medicine }) => {
    let image = others;
    let backgroundColor = Colors.grey100;

    if (medicine.type == 'Capsule') {
        backgroundColor = Colors.capsule;
        image = capsule;
    }
    else if (medicine.type == 'Pill') {
        backgroundColor = Colors.pill;
        image = pill
    }
    else if (medicine.type == 'Liquid') {
        backgroundColor = Colors.liquid;
        image = liquid;
    }
    else if (medicine.type == 'Apply') {
        backgroundColor = Colors.apply;
        image = apply;
    }
    else {
        backgroundColor = Colors.grey100;
        image = others;
    }

    return (
        <View style={styles.card_container}>
            <View style={[styles.card_left, {backgroundColor: backgroundColor}]}>
                <Image style={styles.image} source={image} />
            </View>
            <View style={styles.card_right}>
                <View style={styles.pill_name}>
                    <Text style={TextStyle.record_card_title}>{medicine.name}</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color={Colors.grey300} />
                </View>
                <View>
                    <Text style={{ fontFamily: 'dm-regular' }}>{medicine.type}</Text>
                </View>
                <View style={styles.frequency}>
                    <Ionicons name='calendar-outline' size={20} />
                    <Text style={TextStyle.record_card_text} >{medicine.frequency}</Text>
                </View>

            </View>
        </View>
    )
}

export default YourMedicineCard;

const styles = StyleSheet.create({
    card_container: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        flexDirection: 'row',
        columnGap: 10,
        overflow: 'hidden',
    },
    card_left: {
        width: 85,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 80,
        width: 80,
    },
    card_right: {
        padding: 10,
        flex: 1,
    },
    pill_name: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    frequency: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5,
        marginTop: 4,
    }
})