import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from '../constants/Colors';
import TextStyle from '../constants/TextStyle';

export default function FormItem({ textInputRef, label, iconName, error, secureTextEntry, onFocus = () => { }, ...props }) {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View>
            <Text style={[TextStyle.form_title, { marginBottom: 5 }]}>{label}</Text>
            <View style={[styles.input_container, {
                borderColor: error ? Colors.red : Colors.green300,
                borderWidth: error || isFocused ? 2 : 1
            }]}>
                <Ionicons name={iconName} size={22} color={Colors.grey400} />
                <TextInput
                    editable
                    placeholderTextColor={Colors.grey300}
                    style={{ fontFamily: 'dm-m', fontSize: 16, flex: 1, color: 'black' }}
                    selectionColor={Colors.green500}
                    autoCorrect={false}
                    autoFocus={false}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    secureTextEntry={secureTextEntry}
                    onBlur={() => setIsFocused(false)}
                    ref={textInputRef}
                    {...props}
                />
            </View>

            {error &&
                <Text style={{ color: Colors.red, fontFamily: 'dm-regular' }}>
                    {error}
                </Text>}

        </View>
    )
}

const styles = StyleSheet.create({
    input_container: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        columnGap: 5,
        borderRadius: 10,
    },
})