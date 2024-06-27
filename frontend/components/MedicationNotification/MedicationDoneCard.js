import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import TextStyle from '../../constants/TextStyle';
import Colors from '../../constants/Colors';

const MedicationDoneCard = ({ done }) => {
    return (
        <View style={styles.done_container}>
            <View style={styles.done_title}>
                <Text style={TextStyle.record_card_title}>Done</Text>
            </View>
            {
                done.map((item, i) => (
                    <View style={styles.time} key={i}>
                        <Text style={TextStyle.record_card_title}>{item.time}</Text>
                        {
                            item.medicine.map((m, j) => (
                                <View style={styles.pill} key={j}>
                                    <Ionicons name="checkmark-circle" size={18} color={Colors.blue300} />
                                    <Text style={TextStyle.record_card_text}>{m.name}</Text>
                                </View>
                            ))
                        }

                    </View>
                ))
            }

        </View>
    )
}

export default MedicationDoneCard;

const styles = StyleSheet.create({
    done_container: {
        backgroundColor: Colors.grey100,
        borderRadius: 10,
        paddingBottom: 10,
        rowGap: 10,
    },
    done_title: {
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 10,
        borderBottomColor: Colors.grey400,
        borderBottomWidth: 1,
    },
    time: {
        paddingHorizontal: 10,
        rowGap: 2,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    }

})