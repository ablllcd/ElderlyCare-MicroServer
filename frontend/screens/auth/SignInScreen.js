import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, Alert, Dimensions, Keyboard, Pressable } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { userLogin } from '../../http/authService';

import Button from '../../components/Button';
import FormItem from '../../components/FormItem';
import Colors from '../../constants/Colors';
import TextStyle from '../../constants/TextStyle';

export default function SignInScreen({ navigation }) {
    const [inputs, setInputs] = useState({
        accountName: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const accountNameRef = useRef();
    const passwordRef = useRef();

    function validate() {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.accountName) {
            handleError('Please fill in the account name', 'accountName');
            isValid = false
        }

        if (!inputs.password) {
            handleError('Please fill in the password', 'password');
            isValid = false
        }

        if (isValid) {
            login();
        }
    };

    async function login() {
        try {
            const data = {
                accountName: inputs.accountName,
                password: inputs.password,
            };

            const res = await userLogin(data);
            if (res != null) {
                Alert.alert('Login Fail', res.msg);
            } else {
                handleClearAll();
            }
        } catch (error) {
            console.log('sign in screen error', error);
        }
    }

    function navigateSignUp() {
        handleClearAll();
        navigation.dispatch(
            CommonActions.navigate({
                name: 'SignUp',
            })
        );

    }

    function handleClearAll() {
        setInputs({
            "accountName": '',
            "password": ''
        });
        accountNameRef.current.clear();
        passwordRef.current.clear();
        setErrors({});
    }


    function handleOnChange(text, input) {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };

    function handleError(error, input) {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    }


    return (
        <View style={styles.root}>
            <Image style={styles.image} source={require('../../assets/app/start/woman.png')} />

            <View style={styles.bottom_container}>
                <View style={{ rowGap: 5 }}>
                    <Text style={TextStyle.sign_in_up}>Sign <Text style={{ color: Colors.green300 }}>In</Text></Text>
                    <Text style={TextStyle.slogan}>Login to your acount and explore the ElderlyCare! </Text>
                </View>

                <View style={styles.sign_in_form}>

                    <FormItem
                        value={inputs.accountName}
                        textInputRef={accountNameRef}
                        onChangeText={text => handleOnChange(text, 'accountName')}
                        onFocus={() => handleError(null, 'accountName')}
                        label='Account Name'
                        placeholder='Your Account Name'
                        iconName='person-outline'
                        error={errors.accountName}
                    />
                    <FormItem
                        value={inputs.password}
                        textInputRef={passwordRef}
                        onChangeText={text => handleOnChange(text, 'password')}
                        onFocus={() => handleError(null, 'password')}
                        label='Password'
                        placeholder='Your password'
                        iconName='lock-closed-outline'
                        secureTextEntry={true}
                        error={errors.password}
                    />
                </View>

                <View style={styles.button_container}>
                    <Button
                        condition={{ code: 'primary', fontSize: 20, fontFamily: 'dm-bold', height: 45, width: 200 }}
                        onPress={validate}>
                        Login
                    </Button>
                    <View>
                        <Pressable onPress={navigateSignUp}>
                            <Text style={TextStyle.welcome_prompt}>
                                Don't have an account?
                                <Text style={{ color: Colors.green300, fontFamily: 'dm-bold' }}> Sign Up!</Text>
                            </Text>
                        </Pressable>
                    </View>
                </View>

            </View>
        </View >

    )
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: Colors.green300,
    },
    image: {
        width: deviceWidth - 45,
        height: (deviceWidth - 45) / 1.26
    },
    bottom_container: {
        width: '100%',
        height: deviceHeight * 0.61,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: Colors.background,
        paddingHorizontal: 27,
        paddingVertical: 10,
        justifyContent: 'space-around'
    },
    button_container: {
        width: '100%',
        alignItems: 'center',
        rowGap: 15
    },
    sign_in_form: {
        rowGap: 10,
    }
});