import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Button({ children, onPress, condition }) {
    function pressHandler() {
        onPress();
    }

    return (
        <View style={[styles.buttonOuterContainer,
        { height: condition.height, width: condition.width }]}>

            {condition.code == 'primary' && (
                <Pressable
                    onPress={pressHandler}
                    style={[styles.buttonInnerContainer, { backgroundColor: 'rgba(97,173,114,0.95)' }]}
                    android_ripple={{ color: Colors.green500 }}
                >
                    <Text style={[styles.buttonText,
                    {
                        color: 'white',
                        fontSize: condition.fontSize,
                        fontFamily: condition.fontFamily
                    }]}>
                        {children}
                    </Text>
                    {condition.showIcon && <MaterialCommunityIcons name={condition.iconName} size={24} color='white' />}
                </Pressable>)}

            {condition.code == 'secondary' && (
                <Pressable
                    onPress={pressHandler}
                    style={[styles.buttonInnerContainer, { backgroundColor: 'rgba(97, 173, 114, 0.15)' }]}
                    android_ripple={{ color: 'rgba(97, 173, 114, 0.5)' }}
                >
                    <Text style={[styles.buttonText,
                    {
                        color: Colors.green300,
                        fontSize: condition.fontSize,
                        fontFamily: condition.fontFamily
                    }]}>
                        {children}
                    </Text>
                </Pressable>)}

            {condition.code == 'outline' && (
                <View style={[styles.buttonInnerContainer, { borderColor: Colors.green300, borderWidth: 1.5, borderRadius: 15 }]}>
                    <Pressable onPress={pressHandler}>
                        <Text style={[styles.buttonText,
                        {
                            color: Colors.green300,
                            fontSize: condition.fontSize,
                            fontFamily: condition.fontFamily
                        }]}>
                            {children}
                        </Text>
                    </Pressable>
                </View>)}

            {condition.code == 'forbidden' && (
                <View style={[styles.buttonInnerContainer, { backgroundColor: Colors.grey200 }]}>
                    <Text style={[styles.buttonText,
                    {
                        color: Colors.grey300,
                        fontSize: condition.fontSize,
                        fontFamily: condition.fontFamily
                    }]}>
                        {children}
                    </Text>
                </View>

            )}

        </View>
    );
}

export default Button;

const styles = StyleSheet.create({
    buttonOuterContainer: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    buttonInnerContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: 20,
    }
});