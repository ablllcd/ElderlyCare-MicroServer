import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BlogList from "../../components/Blog/BlogList";

import Colors from "../../constants/Colors";
import TextStyle from "../../constants/TextStyle";

const CommunityMainScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  function navigateNewBlog() {
    navigation.navigate("NewBlog");
  }

  return (
    <View style={styles.root}>
      <View style={styles.inputContainer}>
        <TextInput
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Search"
          style={[styles.input, TextStyle.record_card_text]}
        />
        <TouchableOpacity
          onPress={navigateNewBlog}
          activeOpacity={0.5}
          style={styles.searchButton}
        >
          <Ionicons name="add-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <BlogList />
    </View>
  );
};

export default CommunityMainScreen;

styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 55 : 40,
    backgroundColor: "#ffffff",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.grey100,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: Colors.green300,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.grey100,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: Colors.green300,
    borderRadius: 8,
  },
});
