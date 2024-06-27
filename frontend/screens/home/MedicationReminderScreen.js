import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import Button from '../../components/Button';
import MedicationRecordCard from '../../components/MedicationNotification/MedicationRecordCard';
import MedicationDoneCard from '../../components/MedicationNotification/MedicationDoneCard';
import YourMedicineCard from '../../components/MedicationNotification/YourMedicineCard';
import NewMedicineForm from '../../components/MedicationNotification/NewMedicineForm';
import MedicineIntakeModal from '../../components/MedicationNotification/MedicineIntakeModal';
import TextStyle from '../../constants/TextStyle';
import Colors from '../../constants/Colors';

const MedicationReminderScreen = () => {
    const [newMedicineFormVisible, setNewMedicineFormVisible] = useState(false);
    const [medicineIntakeModalVisiable, setMedicineIntakeModalVisiable] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState();

    function changeNewMedicineModalVisiable() {
        setNewMedicineFormVisible(!newMedicineFormVisible);
    }

    function openMedicineIntakeModal(record) {
        setSelectedRecord(record);
        setMedicineIntakeModalVisiable(!medicineIntakeModalVisiable);
    }

    function closeMedicineIntakeModal() {
        setSelectedRecord({});
        setMedicineIntakeModalVisiable(!medicineIntakeModalVisiable);
    }

    // need to be replaced by real data
    const records = [
        {
            time: '4:00 PM',
            medicine: [
                {
                    name: 'Vitamine C',
                    type: 'Capsule',
                    quantity: 1,
                },
                {
                    name: 'Pain Killer',
                    type: 'Pill',
                    quantity: 1,
                }
            ]
        },
        {
            time: '5:00 PM',
            medicine: [
                {
                    name: 'Acetylcysteine',
                    type: 'Liquid',
                    quantity: 1,
                }
            ]
        }
    ]

    // need to be replaced by real data
    const done = [
        {
            time: '10:30 AM',
            medicine: [
                {
                    name: 'Vitamine B',
                },
                {
                    name: 'Vitamine E',
                },
            ]
        },
        {
            time: '3:45 PM',
            medicine: [
                {
                    name: 'Vitamine A',
                },
            ]
        }
    ]

    // need to be replaced by real data
    const medicine = [
        {
            name: 'Vitamine C',
            type: 'Capsule',
            frequency: 'Everyday',
        },
        {
            name: 'Pain Killer',
            type: 'Pill',
            frequency: 'Every week',
        },
        {
            name: 'Acetylcysteine',
            type: 'Liquid',
            frequency: 'Every 2 days',
        }
    ]

    return (
        <View style={styles.root}>
            <ScrollView>
                <View style={[styles.container]}>
                    <Text style={TextStyle.home_section}>Record</Text>
                    {
                        records.map((record, i) => (
                            <MedicationRecordCard
                                onPress={() => openMedicineIntakeModal(record)}
                                time={record.time}
                                medicine={record.medicine}
                                key={i}
                            />
                        ))
                    }
                    <MedicationDoneCard done={done} />
                </View>
                <MedicineIntakeModal
                    modalVisible={medicineIntakeModalVisiable}
                    record={selectedRecord}
                    handleClose={closeMedicineIntakeModal} />

                <View style={[styles.container, styles.your_medicine_container]}>
                    <Text style={TextStyle.home_section}>Your Medicine</Text>

                    {
                        medicine.map((m, i) => (
                            <YourMedicineCard medicine={m} key={i} />
                        ))
                    }
                    <Button condition={{ code: 'secondary', fontSize: 20, fontFamily: 'dm-bold', height: 40 }}
                        onPress={changeNewMedicineModalVisiable}>
                        + Add New Medicine
                    </Button>
                </View>

                <NewMedicineForm modalVisible={newMedicineFormVisible} changeVisiable={changeNewMedicineModalVisiable} />
            </ScrollView>
        </View>
    )
}

export default MedicationReminderScreen;

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF'
    },
    container: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        rowGap: 10,
    },
    your_medicine_container: {
        flex: 1,
        backgroundColor: Colors.grey100,
    },
});