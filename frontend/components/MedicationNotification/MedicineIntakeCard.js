import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

import Button from '../Button';

import Colors from '../../constants/Colors';

import capsule from '../../assets/app/medicineType/capsule.png';
import pill from '../../assets/app/medicineType/pill.png';
import liquid from '../../assets/app/medicineType/liquid.png';
import apply from '../../assets/app/medicineType/apply.png';
import others from '../../assets/app/medicineType/others.png';

const MedicineIntakeCard = ({ medicine }) => {

    let backgroundColor = Colors.grey100;
    let image = others;

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

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    return (
        <View style={styles.card_container}>

            <View style={styles.record_pill}>
                <View style={[styles.record_pill_image, { backgroundColor: backgroundColor }]}>
                    <Image style={styles.record_pill_image} source={image} />
                </View>
                <View style={{rowGap: 2}}>
                    <Text style={{ fontFamily: 'dm-bold', fontSize: 18 }}>{medicine.name}</Text>
                    <Text style={{ fontFamily: 'dm-regular', fontSize: 16 }}>{medicine.type} / <Text style={{fontFamily: 'dm-bold'}}>{medicine.quantity} per time</Text></Text>
                    <Text style={{ fontFamily: 'dm-bold', fontSize: 16, color: Colors.blue300 }}>{formatAMPM(new Date())} Intake</Text>
                </View>
            </View>

            <View style={styles.button_container}>
                <Button condition={{ code: 'primary', fontSize: 16, fontFamily: 'dm-bold', height: 30, width: 150 }}>
                    Skip
                </Button>
                <Button condition={{ code: 'primary', fontSize: 16, fontFamily: 'dm-bold', height: 30, width: 150 }}>
                    Taken
                </Button>
            </View>

        </View>
    )
}

export default MedicineIntakeCard;

const styles = StyleSheet.create({
    card_container: {
        backgroundColor: 'rgba(97, 173, 114, 0.2)',
        borderRadius: 10,
        width: '100%',
        padding: 15,
    },
    record_pill: {
        flexDirection: 'row',
        columnGap: 10,
        marginTop: 5,
    },
    record_pill_image: {
        width: 55,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    }
});