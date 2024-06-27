import { View, Text, StyleSheet, Keyboard, Dimensions, Pressable } from 'react-native';
import { useState, useRef } from 'react';
import { userSignup } from '../../http/authService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions } from '@react-navigation/native';

import Button from '../../components/Button';
import FormItem from '../../components/FormItem';
import Colors from '../../constants/Colors';
import TextStyle from '../../constants/TextStyle';

const SignUpScreen = ({ navigation }) => {

    const [inputs, setInputs] = useState({
        accountName: '',
        password: '',
        confirmPassword: '',
        email: '',
    });
    const accountNameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const emailRef = useRef();
    const [errors, setErrors] = useState({});


    function validate() {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.accountName) {
            handleError('Please fill in the account name', 'accountName');
            isValid = false;
        }

        if (!inputs.password) {
            handleError('Please fill in the password', 'password');
            isValid = false;
        }
        else if (inputs.password.length < 8) {
            handleError('Password should have more than 8 characters', 'password');
            isValid = false;
        }

        if (!inputs.confirmPassword) {
            handleError('Please confirm the password', 'confirmPassword');
            isValid = false;
        }
        else if (inputs.confirmPassword != inputs.password) {
            handleError('The confirm password is not the same as the password', 'confirmPassword');
            isValid = false;
        }

        const reg = /^\w+@[0-9a-z]+\.[a-z]+$/;
        if (!inputs.email) {
            handleError('Please fill in the email address', 'email');
            isValid = false;
        }
        else if (!reg.test(inputs.email)) {
            handleError('Invalid email address, please fill in a valid email address', 'email');
            isValid = false;
        }

        if (isValid) {
            signup();
        }
    };

    async function signup() {
        try {
            const data = {
                accountName: inputs.accountName,
                password: inputs.password,
                email: inputs.email,
            };
            const res = await userSignup(data);

            if (res != null) {
                handleError(res.error, res.type);
            } else {
                handleClearAll();
                navigateEmailActivation();
            }
        } catch (error) {
            console.log('sign up screen error', error);
        }
    }

    function navigateEmailActivation() {
        handleClearAll();
        navigation.dispatch(
            CommonActions.navigate({
                name: 'EmailActivation',
            })
        );
    };

    function navigateSignIn() {
        handleClearAll();
        navigation.dispatch(
            CommonActions.navigate({
                name: 'SignIn',
            })
        );
    }

    function handleClearAll() {
        setInputs({
            accountName: '',
            password: '',
            confirmPassword: '',
            email: '',
        });
        accountNameRef.current?.clear();
        passwordRef.current?.clear();
        confirmPasswordRef.current?.clear();
        emailRef.current?.clear();
        setErrors({});
    }

    function handleOnChange(text, input) {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };

    function handleError(error, input) {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    }

    return (
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps='always'
            style={{ flex: 1, backgroundColor: '#fff' }}
        >
            <View style={styles.root}>
                <View style={{ rowGap: 10, width: '100%' }}>
                    <Text style={TextStyle.sign_in_up}>Sign <Text style={{ color: Colors.green300 }}>Up</Text></Text>
                    <Text style={TextStyle.slogan}>Register with your mobile number to start the jounary!</Text>
                </View>


                <View style={styles.sign_up_form}>
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
                        placeholder='Your Password'
                        iconName='lock-closed-outline'
                        secureTextEntry={true}
                        error={errors.password}
                    />
                    <FormItem
                        value={inputs.confirmPassword}
                        textInputRef={confirmPasswordRef}
                        onChangeText={text => handleOnChange(text, 'confirmPassword')}
                        onFocus={() => handleError(null, 'confirmPassword')}
                        label='Confirm Password'
                        placeholder='Confirm Your Password'
                        iconName='lock-closed-outline'
                        secureTextEntry={true}
                        error={errors.confirmPassword}
                    />
                    <FormItem
                        value={inputs.email}
                        textInputRef={emailRef}
                        onChangeText={text => handleOnChange(text, 'email')}
                        onFocus={() => handleError(null, 'email')}
                        label='Email Address'
                        placeholder='Your Email Address'
                        iconName='mail-outline'
                        error={errors.email}
                    />

                </View>

                <View style={{ rowGap: 15, alignItems: 'center' }}>
                    <Button
                        condition={{ code: 'primary', fontSize: 20, fontFamily: 'dm-bold', height: 45, width: 200 }}
                        onPress={validate}>
                        Sign Up
                    </Button>

                    <View>
                        <Pressable onPress={navigateSignIn}>
                            <Text style={TextStyle.welcome_prompt}>
                                Already have an account?
                                <Text style={[TextStyle.welcome_prompt, { color: Colors.green300, fontFamily: 'dm-bold' }]}> Sign In!</Text>
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View >
        </KeyboardAwareScrollView>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    root: {
        height: Dimensions.get('window').height,
        paddingHorizontal: 27,
        paddingTop: 50,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    sign_up_form: {
        width: '100%',
        rowGap: 15
    }
});