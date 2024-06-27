import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { userLogout } from '../../http/authService';
import { getUserProfilePic, getUserInfo } from '../../http/userService';

import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import SelectionCard from '../../components/SelectionCard';
import TextStyle from '../../constants/TextStyle';

const UserScreen = ({ navigation }) => {
  const [imageData, setImageData] = useState(null);
  const [name, setName] = useState('');

  const selections = [
    {
      title: 'User Profile Settings',
      iconName: 'person-circle',
      onPress: () => {
        navigation.navigate('UserProfileSetting');
      }
    },
    {
      title: 'Device Management',
      iconName: 'build',
      onPress: () => {
        navigation.navigate('DeviceManagement');
      }
    }
  ]


  function init() {
    getUserProfilePic().then(base64 => {
      setImageData('data:image/png;base64,' + base64);
      getUserInfo().then(res => {
        let temp = res.name == null ? res.accountName : res.name;
        setName(temp);
      });
    }).catch(error => {
      setImageData(null);
    });
  }

  useEffect(() => {
    init();
  }, []);

  useFocusEffect(() => {
    init();
  })

  async function handleLogout() {
    try {
      await userLogout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.root}>
      <View style={{ alignItems: 'center', rowGap: 10 }}>
        <Avatar uri={imageData} isEidtable={false} height={110} width={110} />
        <Text style={TextStyle.home_section}>{name}</Text>
      </View>


      <View style={{ width: '100%', rowGap: 10 }}>
        {selections.map((selection, i) => (
          <SelectionCard iconName={selection.iconName} title={selection.title} onPress={selection.onPress} key={i} />
        ))}
      </View>

      <Button condition={{ code: 'primary', fontSize: 18, fontFamily: 'dm-bold', height: 38, width: '100%' }} onPress={handleLogout}>Log Out</Button>
    </View>
  );
}

export default UserScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    rowGap: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  }
})
