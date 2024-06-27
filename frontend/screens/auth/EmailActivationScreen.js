import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import TextStyle from '../../constants/TextStyle';

const EmailActivationScreen = ({ navigation }) => {

    function navigateSignIn() {
        navigation.dispatch(
            CommonActions.navigate({
                name: 'SignIn',
            })
        );
    };

    return (
        <View style={styles.root}>
            <Text style={[TextStyle.ElderlyCare, {color: Colors.green300}]}>ElderlyCare</Text>
            <MaterialCommunityIcons name="email-send" size={120} color={Colors.green300} />
            <Text style={[TextStyle.form_title, {color: Colors.grey400}]}>Account activation link has been sent, please check your email to activate your account!</Text>
            <Button
                condition={{ code: 'primary', fontSize: 20, fontFamily: 'dm-bold', height: 45, width: 200 }}
                onPress={navigateSignIn}>Sign In</Button>
        </View>
    );
}

export default EmailActivationScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 20,
        paddingHorizontal: 27,
    }
})