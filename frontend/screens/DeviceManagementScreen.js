import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react';
import { getDevice, addDevice } from '../http/userService';
import { Ionicons } from '@expo/vector-icons';

import Button from '../components/Button';
import QRCodeScanner from '../components/QRCodeScanner';
import TextStyle from '../constants/TextStyle';
import Colors from '../constants/Colors';

const DeviceManagementScreen = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [device, setDevice] = useState(null);

  function showScannerHandler() {
    setShowScanner(true)
  }

  async function addDeviceHandler(device_id) {
    await addDevice(device_id);
    setShowScanner(false);
    const device = await getDevice();
    setDevice(device);
  }

  async function init() {
    try {
      const device = await getDevice();
      setDevice(device);
    }
    catch (err) {
      console.log('device screen error ' + err);
    }
  }

  useEffect(() => {
    init();
  }, [])


  return (
    (
      !showScanner ? (
        <View style={styles.root} >

          <Text style={TextStyle.home_section}>Device List</Text>
          {device &&
            <View style={styles.device_container}>
              <Ionicons name="watch" size={24} color={Colors.green300} />
              <Text style={TextStyle.form_title}> Device ID: {device}</Text>
            </View>}

          <Button condition={{
            code: 'primary',
            fontSize: 18,
            fontFamily: 'dm-bold',
            height: 38,
            width: '100%',
            showIcon: true,
            iconName: 'qrcode-scan',
          }}
            onPress={showScannerHandler}>Add New Device</Button>

        </View >) : (
        <QRCodeScanner addItem={addDeviceHandler} />
      ))

  )
}

export default DeviceManagementScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    rowGap: 20,
    backgroundColor: '#FFFFFF'
  },
  device_container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey100,
    borderRadius: 10,
    padding: 20,
    columnGap: 10,
  }
})