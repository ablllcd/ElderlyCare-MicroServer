import { View, Text, Modal, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import Colors from '../../constants/Colors';
import TextStyle from '../../constants/TextStyle';
import ModalStyle from '../../constants/ModalStyle';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';

import Button from '../Button';


const NewMedicineForm = ({ changeVisiable, modalVisible }) => {
    const [newMedicineForm, setNewMedicineForm] = useState(
        {
            "name": '',
            "type": '',
            "frequency": '1 day',
            "amount": '',
            "times": ['5:00 PM'],
        }
    );
    const [step, setStep] = useState(1);
    const types = ['Capsule', 'Pill', 'Liquid', 'Apply', 'Others'];

    function handleOnChange(text, input) {
        setNewMedicineForm(prevState => ({ ...prevState, [input]: text }));
    };

    function handleNextStep() {
        if (step < 3) {
            setStep(step + 1);
        }
    }

    function handlePreviousStep() {
        if (step > 1) {
            setStep(step - 1);
        }
    }

    function handleCancel() {
        setNewMedicineForm({
            "name": '',
            "type": '',
            "frequency": '1 day',
        });
        setStep(1);
        changeVisiable();
    }

    function buttonControl() {
        let flag = true;
        let text = 'Next Step'
        if (step == 1 && !newMedicineForm.name) flag = false;
        if (step == 2 && !newMedicineForm.type) flag = false;
        if (step == 3) text = 'Submit';

        if (flag)
            return (
                <Button
                    condition={{ code: 'primary', fontSize: 18, fontFamily: 'dm-bold', height: 38, width: '100%' }}
                    onPress={handleNextStep}>
                    {text}
                </Button>)
        else
            return (<Button condition={{ code: 'forbidden', fontSize: 18, fontFamily: 'dm-bold', height: 38, width: '100%' }}>{text}</Button>)
    }

    const [selectedLanguage, setSelectedLanguage] = useState();

    return (
        <Modal animationType='slide' transparent={true} visible={modalVisible} >
            <View style={ModalStyle.modalView}>

                <View style={ModalStyle.navigator}>
                    {
                        step != 1 ? (
                            <Pressable onPress={handlePreviousStep}>
                                <Text style={ModalStyle.navigator_text}>Previous</Text>
                            </Pressable>
                        ) : (<View></View>)
                    }

                    <Pressable onPress={handleCancel}>
                        <Text style={ModalStyle.navigator_text}>Cancel</Text>
                    </Pressable>
                </View>
                <View style={ModalStyle.body}>
                    <View style={ModalStyle.title}>
                        <Text style={{ fontFamily: 'dm-bold', fontSize: 22 }}>Add New Medicine</Text>
                        <Text style={{ fontFamily: 'dm-m', fontSize: 16, color: Colors.grey400 }}>Step {step} of 3</Text>
                    </View>

                    {
                        step == 1 && (
                            <View style={styles.form_container}>
                                <Text style={{ fontFamily: 'dm-bold', fontSize: 28 }}>Medicine Name</Text>
                                <View style={[styles.input_container, { borderRadius: 10 }]}>
                                    <TextInput
                                        value={newMedicineForm.name}
                                        editable
                                        placeholder='Add Medicine Name'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        selectionColor={Colors.green500}
                                        onChangeText={text => handleOnChange(text, "name")}
                                        style={[TextStyle.welcome_prompt, { width: '100%' }]}
                                    />
                                </View>
                            </View>
                        )
                    }

                    {
                        step == 2 && (
                            <View style={styles.form_container}>
                                <Text style={{ fontFamily: 'dm-bold', fontSize: 28 }}>Medicine Type</Text>

                                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                                    {
                                        types.map((type, i) => (
                                            <Pressable
                                                key={i}
                                                onPress={() => handleOnChange(type, "type")}
                                                android_ripple={{ color: 'rgba(97, 173, 114, 0.6)' }}
                                                style={[styles.input_container,
                                                {
                                                    borderBottomWidth: i != 4 ? 1 : 0,
                                                    borderBottomColor: Colors.green500,
                                                    justifyContent: 'space-between',
                                                    width: '100%'
                                                }]}>
                                                <Text style={[TextStyle.welcome_prompt, { color: 'black', flex: 1 }]}>{type}</Text>
                                                {
                                                    type == newMedicineForm['type'] && <Ionicons name="checkmark-circle" size={20} color={Colors.blue300} />
                                                }
                                            </Pressable>
                                        ))
                                    }
                                </View>
                            </View>
                        )
                    }

                    {
                        step == 3 && (
                            <ScrollView>
                                <View style={[styles.form_container, { rowGap: 25 }]}>
                                    <Text style={{ fontFamily: 'dm-bold', fontSize: 28 }}>Schedule</Text>

                                    <View style={[styles.form_container, { alignItems: 'flex-start', rowGap: 10 }]}>
                                        <Text style={{ fontFamily: 'dm-bold', fontSize: 18 }}>Frequency</Text>
                                        <View style={[styles.input_container, styles.input_view_box]}>
                                            <Text style={[TextStyle.welcome_prompt, { color: Colors.blue300 }]}>Every</Text>
                                            <Picker
                                                style={{
                                                    flex: 1,
                                                    color: Colors.blue300,
                                                }}
                                                selectedValue={selectedLanguage}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    setSelectedLanguage(itemValue)
                                                }>
                                                <Picker.Item label="1 day" value={1} />
                                                <Picker.Item label="2 days" value={2} />
                                                <Picker.Item label="3 days" value={3} />
                                                <Picker.Item label="4 days" value={4} />
                                                <Picker.Item label="5 days" value={5} />
                                                <Picker.Item label="6 days" value={6} />
                                                <Picker.Item label="7 days" value={7} />
                                            </Picker>
                                        </View>
                                    </View>

                                    <View style={[styles.form_container, { alignItems: 'flex-start', rowGap: 10 }]}>
                                        <Text style={{ fontFamily: 'dm-bold', fontSize: 18 }}>Amount</Text>
                                        <View style={[styles.input_container, styles.input_view_box]}>
                                            <TextInput
                                                value={newMedicineForm.amount}
                                                editable
                                                placeholder='Add Amount'
                                                autoCorrect={false}
                                                autoFocus={false}
                                                selectionColor={Colors.green500}
                                                onChangeText={text => handleOnChange(text, "name")}
                                                style={[TextStyle.welcome_prompt, { flex: 1 }]}
                                            />
                                            <Text style={[TextStyle.welcome_prompt, { color: 'black' }]}>per time</Text>
                                        </View>
                                    </View>

                                    <View style={[styles.form_container, { alignItems: 'flex-start', rowGap: 10 }]}>
                                        <Text style={{ fontFamily: 'dm-bold', fontSize: 18 }}>Time</Text>

                                        <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                                            {
                                                newMedicineForm.times?.map((time, i) => (
                                                    <Pressable
                                                        key={i}
                                                        onPress={() => handleOnChange(time, "type")}
                                                        android_ripple={{ color: 'rgba(97, 173, 114, 0.6)' }}
                                                        style={[styles.input_container,
                                                        {
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: Colors.green500,
                                                            columnGap: 10,
                                                            width: '100%'
                                                        }]}>
                                                        <MaterialIcons name="add-circle" size={20} color={Colors.green500} />
                                                        <Text style={[TextStyle.welcome_prompt, { color: 'black', flex: 1 }]}>{time}</Text>
                                                    </Pressable>
                                                ))
                                            }
                                            <Pressable
                                                android_ripple={{ color: 'rgba(97, 173, 114, 0.6)' }}
                                                style={[styles.input_container,
                                                {
                                                    borderBottomColor: Colors.green500,
                                                    columnGap: 10,
                                                    width: '100%',
                                                }]}>
                                                <MaterialIcons name="add-circle" size={20} color={Colors.green500} />
                                                <Text style={[TextStyle.welcome_prompt, { color: Colors.blue300, flex: 1 }]}>Add New Medicine</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        )
                    }
                </View>
                {buttonControl()}

            </View>

        </Modal >
    )
}

export default NewMedicineForm;

const styles = StyleSheet.create({
    form_container: {
        width: '100%',
        alignItems: 'center',
        rowGap: 15,
    },
    input_container: {
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        backgroundColor: 'rgba(97, 173, 114, 0.2)',
    },
    input_view_box: {
        borderRadius: 10,
        width: '100%',
        justifyContent: 'space-between',
    }
});