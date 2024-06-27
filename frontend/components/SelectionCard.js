import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import TextStyle from '../constants/TextStyle';

const SelectionCard = ({ iconName, title, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={styles.root}>

                <View style={styles.left}>
                    <Ionicons name={iconName} size={24} color="black" />
                    <Text style={[TextStyle.home_greeting, { color: '#000000' }]}>{title}</Text>
                </View>

                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />

            </View>
        </Pressable>
    );
}

export default SelectionCard;

const styles = StyleSheet.create({
    root: {
        backgroundColor: Colors.grey100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    }
})