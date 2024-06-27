import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Link } from '@react-navigation/native';

import Button from '../../components/Button';

import Colors from '../../constants/Colors';
import TextStyle from '../../constants/TextStyle';

export default function WelcomeScreen({ navigation }) {
    function pressSignIn() {
        navigation.navigate('SignIn')
    }

    return (
        <View style={styles.root}>
            <Image style={styles.image} source={require('../../assets/app/start/man.png')} />

            <View style={styles.bottom_container}>
                <View style={{ rowGap: 5 }}>
                    <Text style={TextStyle.ElderlyCare}>ElderlyCare</Text>
                    <Text style={TextStyle.slogan}>Aim to provide a Health Care 4.0 for Senior</Text>
                </View>

                <View>
                    <Text style={TextStyle.welcome_func}>Personal Health Management</Text>
                    <Text style={TextStyle.welcome_func}>Social Connection</Text>
                    <Text style={TextStyle.welcome_func}>Continuous Learning</Text>
                </View>

                <View style={styles.button_container}>
                    <Button
                        condition={{ code: 'primary', fontSize: 20, fontFamily: 'dm-bold', height: 45, width: 200 }}
                        onPress={pressSignIn}>
                        Sign In
                    </Button>
                    <View>
                        <Text style={TextStyle.welcome_prompt}>
                            Don't have an account?
                            <Link to={{ screen: 'SignUp' }} style={{ color: Colors.green300, fontFamily: 'dm-bold', }}> Sign Up!</Link>
                        </Text>
                    </View>
                </View>

            </View>
        </View>
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
        rowGap: 5
    }
});