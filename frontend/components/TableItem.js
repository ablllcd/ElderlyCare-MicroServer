import React, {useRef} from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import TextStyle from '../constants/TextStyle';

export default function TableItem({ title, value }) {

    return (
        <View style={styles.root}>
            <Text style={TextStyle.form_title}>{title}</Text>
            <Text style={TextStyle.form_title}>{value}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    root: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: Colors.grey500,
        backgroundColor: Colors.grey100,
    }
});