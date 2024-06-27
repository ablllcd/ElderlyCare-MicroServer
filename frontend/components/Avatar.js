import { useState, useLayoutEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { uploadUserProfilePic } from '../http/userService';

import placeholder from '../assets/app/defaultpfp.png';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';
import TextStyle from '../constants/TextStyle';

const Avatar = ({ uri, isEidtable, height, width }) => {
    useLayoutEffect(() => {
        setImage(uri);
    }, [uri]);

    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(uri);

    const pickImage = async (type) => {
        try {
            if (type == 'gallery') {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });

                if (!result.canceled) {
                    setImage(result.assets[0].uri);
                    await uploadUserProfilePic(result.assets[0].uri);
                }
            }
            else {
                await ImagePicker.requestCameraPermissionsAsync();
                let result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });

                if (!result.canceled) {
                    setImage(result.assets[0].uri);
                    await uploadUserProfilePic(result.assets[0].uri);
                }
            }
        }
        catch (error) {

        }
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <>
            <View style={{ height: height, width: width }}>
                <Image style={styles.image} source={image ? { uri: image } : placeholder} />
                {isEidtable &&
                    <TouchableOpacity style={styles.camera} activeOpacity={0.8} onPress={openModal}>
                        <Ionicons name="camera" size={Sizes.l30} color='#fafafa' />
                    </TouchableOpacity>
                }
            </View>

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContent}>
                    <View style={styles.titleContainer}>
                        <Text style={[TextStyle.welcome_prompt, { color: '#fafafa' }]}> Select Picture From</Text>
                        <Pressable onPress={closeModal}>
                            <Ionicons name="close" size={Sizes.m20} color='#fafafa' />
                        </Pressable>
                    </View>
                    <View style={styles.pickerContainer}>
                        <View style={styles.pickerItem}>
                            <TouchableOpacity style={styles.pickerIcon} activeOpacity={0.8} onPress={pickImage.bind(this, 'camera')}>
                                <Ionicons name="camera" size={60} color='#fafafa' />
                            </TouchableOpacity>
                            <Text style={[TextStyle.welcome_prompt, { color: '#fafafa' }]}>Camera</Text>
                        </View>

                        <View style={styles.pickerItem}>
                            <TouchableOpacity style={styles.pickerIcon} activeOpacity={0.8} onPress={pickImage.bind(this, 'gallery')}>
                                <Ionicons name="image" size={60} color='#fafafa' />
                            </TouchableOpacity>
                            <Text style={[TextStyle.welcome_prompt, { color: '#fafafa' }]}>Gallery</Text>
                        </View>

                    </View>
                </View>
            </Modal>

        </>

    )
}

export default Avatar;


const styles = StyleSheet.create({
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 70,
    },
    camera: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.green300,
        borderRadius: 25,
        padding: 8,
    },
    modalContent: {
        height: '25%',
        width: '100%',
        backgroundColor: Colors.green500,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
    },
    titleContainer: {
        height: '20%',
        backgroundColor: Colors.green300,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 80,
        paddingVertical: 20,
    },
    pickerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 5
    },
    pickerIcon: {
        backgroundColor: Colors.green300,
        borderRadius: 50,
        padding: 15,
    },
})
