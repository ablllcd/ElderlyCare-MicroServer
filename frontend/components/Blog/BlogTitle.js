import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native";

export default function BlogTitle(props) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>New Blogs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: 20,
    width: Dimensions.get("window").width - 10,
  },
  title: {
    width: "100%",
    fontSize: 22,
    textAlign: "center",
    // fontFamily: "Arial",
  },
});
