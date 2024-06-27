import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import React from 'react';

import MedicineIntakeCard from './MedicineIntakeCard';

import Button from '../Button';
import Colors from '../../constants/Colors';
import ModalStyle from '../../constants/ModalStyle';

const MedicineIntakeModal = ({ modalVisible, record, handleClose }) => {

    const month_list = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const day_list = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const date = new Date().getUTCDate();
    const month = month_list[new Date().getMonth()];
    const day = day_list[new Date().getUTCDay()];

    return (
        <Modal animationType='slide' transparent={true} visible={modalVisible} >
            <View style={ModalStyle.modalView}>

                <View style={ModalStyle.navigator}>
                    <View></View>
                    <Pressable onPress={handleClose}>
                        <Text style={ModalStyle.navigator_text}>Return</Text>
                    </Pressable>
                </View>

                <View style={[ModalStyle.body, { rowGap: 30 }]}>
                    <View style={ModalStyle.title}>
                        <Text style={{ fontFamily: 'dm-m', fontSize: 16, color: Colors.grey400 }}>{month} {date} {day}</Text>
                        <Text style={{ fontFamily: 'dm-bold', fontSize: 28 }}>{record?.time} Intake</Text>
                    </View>

                    <Button condition={{ code: 'secondary', fontSize: 16, fontFamily: 'dm-bold', height: 35, width: 240 }}>
                        Record All As Intake
                    </Button>

                    <View style={{ width: '100%', rowGap: 20 }}>
                        {
                            record?.medicine?.map((m, i) => (
                                <MedicineIntakeCard medicine={m} key={i} />
                            ))
                        }
                    </View>



                </View>

            </View>
        </Modal>
    )
}

export default MedicineIntakeModal;

const styles = StyleSheet.create({

});