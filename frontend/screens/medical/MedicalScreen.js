import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import TextStyle from "../../constants/TextStyle";
import Colors from "../../constants/Colors";

import Button from '../../components/Button';

import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MedicalScreen({ navigation }) {
    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState([]);

    function clearHistory() {
        setHistory([]);
    }

    function SearchRequest(keyword) {
        if (inputValue !== '' || keyword) {
            const searchItem = inputValue !== '' ? inputValue : keyword
            const newHistory = [searchItem, ...history.filter(item => item !== searchItem)].slice(0, 10);
            setHistory(newHistory);
            setInputValue('');
            let uri = 'https://www.drugs.com//search.php?searchterm=' + searchItem
            navigation.navigate('MedicalResult', { uri: uri });
        }
    }

    return (
        <View style={styles.root}>
            <View style={styles.ChatBotContainer}>
                <Text style={{ fontSize: 30, fontFamily: 'dm-bold' }}>Start a new chat</Text>
                <Text style={{ fontSize: 30, fontFamily: 'dm-bold' }}>with <MaterialCommunityIcons name="robot-outline" size={35} color="black" /></Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text style={{ fontSize: 30, fontFamily: 'dm-bold' }}>Chat Bot AI</Text>
                    <Button condition={{
                        code: 'primary', fontSize: 20, fontFamily: 'dm-bold',
                        height: 40, width: 180, showIcon: true, iconName: 'chat-processing'
                    }}
                        onPress={() => { navigation.navigate('ChatBot') }}>
                        New Topic
                    </Button>
                </View>
            </View>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('../../assets/app/medical/background.jpg')} />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    editable={true}
                    style={[TextStyle.welcome_prompt, { flex: 1, height: 40 }]}
                    placeholder='Find Drugs & Conditions...'
                    value={inputValue}
                    onChangeText={(value) => {
                        setInputValue(value)
                    }}
                />

                <Ionicons name={'search'} size={22} color={Colors.green500} onPress={SearchRequest} />

            </View>

            <View style={styles.historyContainer}>
                <View style={styles.historyTitle}>
                    <Text style={{ fontSize: 15, color: Colors.grey400, fontFamily: 'dm-m' }}>Search History</Text>
                    <Ionicons name={'trash'} size={18} color={Colors.grey300} onPress={clearHistory} />
                </View>
                <View style={styles.ItemContainer}>
                    {history.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => SearchRequest(item)}>
                            <Text style={styles.Items}>{item}</Text>
                        </TouchableOpacity>
                    ))}
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
        paddingHorizontal: 20,
        rowGap: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    imageContainer: {
        justifyContent: "flex-end",
        alignItems: 'center',
    },
    image: {
        width: deviceWidth - 100,
        height: (deviceWidth - 100) / 1.33,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        columnGap: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.green500,
    },
    historyContainer: {
        minHeight: 60,
        rowGap: 10,
        width: deviceWidth,
        paddingHorizontal: 20,
    },
    historyTitle: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    ItemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 10,
        columnGap: 10,
    },
    Items: {
        padding: 4,
        color: Colors.grey400,
        fontSize: 14,
        fontWeight: 400,
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 13,
    },
    ChatBotContainer: {
        rowGap: 10,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 30,
        alignItems: 'flex-start',
        width: deviceWidth,
        backgroundColor: Colors.cyan300a
    }
});
