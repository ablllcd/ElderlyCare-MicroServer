import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';

import { MaterialIcons } from '@expo/vector-icons';

import TextStyle from '../../constants/TextStyle';
import Colors from '../../constants/Colors';

import capsule from '../../assets/app/medicineType/capsule.png';
import pill from '../../assets/app/medicineType/pill.png';
import liquid from '../../assets/app/medicineType/liquid.png';
import apply from '../../assets/app/medicineType/apply.png';
import others from '../../assets/app/medicineType/others.png';

const MedicationRecordCard = ({ time, medicine, onPress }) => {
    return (
        <View style={styles.record_container}>
            <Pressable onPress={onPress}>
                <View style={styles.record_time}>
                    <Text style={TextStyle.record_card_title}>{time}</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color={Colors.grey300} />
                </View>
                {
                    medicine.map((m, i) => {
                        let backgroundColor = Colors.grey100;
                        let image = others;
                        if (m.type == 'Capsule') {
                            backgroundColor = Colors.capsule;
                            image = capsule;
                        }
                        else if (m.type == 'Pill') {
                            backgroundColor = Colors.pill;
                            image = pill
                        }
                        else if (m.type == 'Liquid') {
                            backgroundColor = Colors.liquid;
                            image = liquid;
                        }
                        else if (m.type == 'Apply') {
                            backgroundColor = Colors.apply;
                            image = apply;
                        }
                        else {
                            backgroundColor = Colors.grey100;
                            image = others;
                        }
                        return (
                            <View style={styles.record_pill} key={i}>
                                <View style={[styles.record_pill_image, { backgroundColor: backgroundColor }]}>
                                    <Image style={styles.record_pill_image} source={image} />
                                </View>
                                <Text style={TextStyle.record_card_text}>{m.name} </Text>
                            </View>
                        )
                    })
                }
            </Pressable>
        </View>
    )
}

export default MedicationRecordCard;

const styles = StyleSheet.create({
    record_container: {
        backgroundColor: Colors.blue300a,
        borderRadius: 10,
        padding: 10,
    },
    record_time: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    record_pill: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        marginTop: 5,
    },
    record_pill_image: {
        width: 30,
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});