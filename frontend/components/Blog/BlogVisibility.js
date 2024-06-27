import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function BlogVisibility() {
  return (
    <Pressable onPress={() => {}}>
      <View style={styles.visibilityTitleContainer}>
        <Text style={styles.visibilityTitle}>View By All People</Text>
        <AntDesign name="right" size={24} color="black" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  visibilityTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 20,
    width: Dimensions.get("window").width - 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  visibilityTitle: {
    fontSize: 18,
    fontFamily: "dm-bold",
  },
});
