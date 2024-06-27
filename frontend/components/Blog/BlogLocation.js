import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { AntDesign } from "@expo/vector-icons";
import { gaodeReverseGeoAPI } from "../../http/blogService";

export default function CurrentLocation(props) {
  const { selectedName, setSelectedName, selectedAddress, setSelectedAddress } =
    props;
  const [location, setLocation] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log("location use effect start");
    // 请求位置权限并获取位置信息
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("location is :");
      console.log(currentLocation);

      const res = await gaodeReverseGeoAPI(
        location.coords?.longitude,
        location.coords?.latitude
      );
      setCityInfo(res.data.regeocode);
      console.log("city is called:");
      console.log(res.data.regeocode.pois);
    };

    getLocation();
    console.log("location use effect finish");
  }, []);

  const geoLocation =
    selectedAddress === "" && selectedName === "" ? (
      <Text style={styles.locationTitle}>Add Location</Text>
    ) : (
      <Text style={styles.selectedText} numberOfLines={1} ellipsizeMode="tail">
        {selectedName} | {selectedAddress}
      </Text>
    );

  if (!location || !cityInfo) {
    return (
      <View style={styles.locationTitleContainer}>
        <Text style={styles.locationTitle}>Location is loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <ScrollView>
            <View>
              <Pressable
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setSelectedAddress("");
                  setSelectedName("");
                }}
              >
                <View style={styles.itemContainer}>
                  <Text style={{ ...styles.itemName, color: "red" }}>
                    Cancel
                  </Text>
                </View>
              </Pressable>
              {cityInfo.pois.map((item) => {
                return (
                  <Pressable
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setSelectedAddress(item.address);
                      setSelectedName(item.name);
                    }}
                  >
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemName}>{item.name}</Text>

                      <View>
                        <Text style={styles.itemAddress}>
                          {parseInt(item.distance)}m | {item.address}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View style={styles.locationTitleContainer}>
          {geoLocation}
          <AntDesign name="right" size={24} color="black" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  locationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    width: Dimensions.get("window").width - 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  locationTitle: {
    fontSize: 18,
    fontFamily: "dm-bold",
  },
  itemContainer: {
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  itemName: {
    fontSize: 16,
  },
  itemAddress: {
    fontSize: 14,
    color: "grey",
    marginTop: 3,
  },
  modalView: {
    marginVertical: 40,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedText: {
    width: "80%",
    fontSize: 14,
    color: "green",
  },
});
