import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import TextStyle from '../../constants/TextStyle';

const ServiceCard = ({ title, subtitle, icon, onPress }) => {

    return (
        <Pressable onPress={onPress}>
            <View style={styles.service_card}>
                <Ionicons name={icon} size={Sizes.l30} color={Colors.green300} />
                <View style={styles.right}>
                    <Text style={TextStyle.form_title}>{title}</Text>
                    <Text style={[TextStyle.slogan, { color: Colors.grey400 }]}>{subtitle}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default ServiceCard;

const styles = StyleSheet.create({
    service_card: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 20,
        backgroundColor: Colors.grey100,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 22,
    },
    right: {
        flex: 1,
        rowGap: 5,
    }
})