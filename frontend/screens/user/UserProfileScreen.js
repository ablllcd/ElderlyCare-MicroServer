import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

import { getUserInfo, getUserProfilePic, editUserInfo } from '../../http/userService';

import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import FormItem from '../../components/FormItem';
import TableItem from '../../components/TableItem';

const UserProfileScreen = () => {

    const [imageData, setImageData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [inputs, setInputs] = useState({
        name: '',
        gender: '',
        age: '',
    })

    async function init() {
        try {
            const base64 = await getUserProfilePic();
            setImageData('data:image/png;base64,' + base64);

            const res = await getUserInfo();
            handleOnChange(res.name, 'name');
            handleOnChange(res.gender, 'gender');
            handleOnChange(res.age, 'age');
        }
        catch (err) {
            console.log('user profile screen error ' + err);
        }
    }

    useEffect(() => {
        init();
    }, []);

    function handleOnChange(text, input) {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    }

    async function handleEdit() {
        setIsEdit(false);
        await editUserInfo(inputs);
        let res = await getUserInfo();
        handleOnChange(res.name, 'name');
        handleOnChange(res.gender, 'gender');
        handleOnChange(res.age, 'age');
    };

    return (
        <View style={styles.root}>
            <Avatar uri={imageData} isEidtable={true} height={130} width={130} />

            {isEdit ?
                (<>
                    <View style={styles.formEdit}>
                        <FormItem
                            onChangeText={text => handleOnChange(text, 'name')}
                            label='Name'
                            placeholder='(Optional) Your Name'
                            iconName='person-outline'
                            value={inputs.name}
                        />
                        <FormItem
                            onChangeText={text => handleOnChange(text, 'gender')}
                            label='Gender'
                            placeholder='(Optional) Your Gender'
                            iconName='at-circle-outline'
                            value={inputs.gender}

                        />
                        <FormItem
                            onChangeText={text => handleOnChange(text, 'age')}
                            label='Age'
                            placeholder='(Optional) Your Age'
                            iconName='calendar-outline'
                            value={inputs.age.toString()}
                        />
                    </View>
                    <Button
                        condition={{ code: 'primary', fontSize: 18, fontFamily: 'dm-bold', height: 35, width: '100%' }}
                        onPress={handleEdit}>Save</Button>
                </>) :
                (<>
                    <View style={styles.formView}>
                        <TableItem title={'Name'} value={inputs.name} />
                        <TableItem title={'Gender'} value={inputs.gender} />
                        <TableItem title={'Age'} value={inputs.age} />
                    </View>
                    <Button
                        condition={{ code: 'primary', fontSize: 18, fontFamily: 'dm-bold', height: 35, width: '100%' }}
                        onPress={() => {
                            setIsEdit(true)
                        }}>Edit</Button>
                </>)}

        </View>
    );
}

export default UserProfileScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
        rowGap: 30,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    formEdit: {
        width: '100%',
        rowGap: 10,
        marginBottom: 15,
    },
    formView: {
        borderRadius: 10,
        rowGap: 15,
    }
})
