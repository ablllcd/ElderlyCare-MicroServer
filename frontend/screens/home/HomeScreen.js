import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import TextStyle from '../../constants/TextStyle';
import Sizes from '../../constants/Sizes';


import HealthDataCard from '../../components/Home/HealthDataCard';
import ServiceCard from '../../components/Home/ServiceCard';
import Avatar from '../../components/Avatar';

import { getCurrentHealthData } from '../../http/healthService';
import { getUserInfo, getUserProfilePic } from '../../http/userService';

const HomeScreen = ({ navigation }) => {

  const [currentHealthValue, setCurrentHealthValue] = useState({
    heartRate: 'NaN',
    temperature: 'NaN',
    oxygenLevel: 'NaN',
  });
  const [name, setName] = useState('');
  const [imageData, setImageData] = useState(null);

  const types = ['heartRate', 'temperature', 'oxygenLevel'];
  const services = [
    {
      title: 'Health Data Report',
      subtitle: 'Comprehensive and detailed analysis of your personal health information',
      icon: 'bar-chart-outline',
      handleNavigation: () => {
        navigation.navigate('HealthDataReport');
      }
    },
    {
      title: 'Device Management',
      subtitle: 'Smart and smooth device connection and management',
      icon: 'build-outline',
      handleNavigation: () => {
        navigation.navigate('DeviceManagement');
      }
    },
    {
      title: 'Medication Reminder',
      subtitle: 'Timely reminders for every medication you need to take',
      icon: 'calendar-outline',
      handleNavigation: () => {
        navigation.navigate('MedicationReminder');
      }
    }
  ];


  async function init() {
    try {
      const base64 = await getUserProfilePic();
      setImageData('data:image/png;base64,' + base64);

      const res = await getUserInfo();
      let temp = res.name == null ? res.accountName : res.name;
      setName(temp);

      const healthData = await getCurrentHealthData();
      if (healthData.heartRate === null) {
        setCurrentHealthValue({
          heartRate: 'NaN',
          temperature: 'NaN',
          oxygenLevel: 'NaN',
        });
      } else {
        setCurrentHealthValue({
          heartRate: parseFloat(healthData.heartRate).toFixed(2),
          temperature: parseFloat(healthData.temperature).toFixed(2),
          oxygenLevel: parseFloat(healthData.oxygenLevel).toFixed(2),
        });
      }
    }
    catch (err) {
      console.log('home screen init error ' + err);
    }
  }

  useEffect(() => {
    init();

    const intervalId = setInterval(() => {
      getCurrentHealthData().then(res => {
        if (res.heartRate === null) {
          setCurrentHealthValue({
            heartRate: 'NaN',
            temperature: 'NaN',
            oxygenLevel: 'NaN',
          })
        } else {
          setCurrentHealthValue({
            heartRate: parseFloat(res.heartRate).toFixed(2),
            temperature: parseFloat(res.temperature).toFixed(2),
            oxygenLevel: parseFloat(res.oxygenLevel).toFixed(2)
          })
        }

      }).catch(err => { });
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useFocusEffect(() => {
    init();
  })

  const currentHour = new Date().getHours();
  var greeting;
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning!";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon!";
  } else {
    greeting = "Good evening!";
  }

  function handleToUser() {
    console.log('press');
    navigation.navigate('User');
  }

  return (
    <View style={styles.root}>

      <View style={styles.user_container}>
        <View style={styles.user_container_left}>
          <Avatar uri={imageData} isEidtable={false} height={70} width={70} />

          <View style={{ rowGap: 5 }}>
            <Text style={TextStyle.home_greeting}>{greeting}</Text>
            <Text style={TextStyle.home_section}>{name}</Text>
          </View>
        </View>
        <View>
          <Ionicons onPress={() => handleToUser()} name="person-outline" size={Sizes.l30} color={Colors.grey400} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ rowGap: 15 }}>
          <Text style={TextStyle.home_section}>Health Data</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.healthDataContainer}>
              {types.map((type, i) => (
                <HealthDataCard type={type} value={currentHealthValue[type]} key={i} />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={{ rowGap: 15 }}>
          <Text style={TextStyle.home_section}>Services</Text>
          <View style={{ rowGap: 10 }}>
            {services.map((service, i) => (
              <ServiceCard
                title={service.title}
                subtitle={service.subtitle}
                icon={service.icon}
                onPress={service.handleNavigation}
                key={i}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View >
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    rowGap: 20,
    backgroundColor: '#FFFFFF'
  },
  user_container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  user_container_left: {
    flexDirection: 'row',
    columnGap: 15,
    alignItems: 'center'
  },
  healthDataContainer: {
    flexDirection: 'row',
    columnGap: 10,
  }
})