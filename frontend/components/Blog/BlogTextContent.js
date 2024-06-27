import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native";
import { useState } from "react";

export default function BlogText(props) {
  const [contentHeight, setContentHeight] = useState(0);

  function contentHandler(event) {
    setContentHeight(event.nativeEvent.contentSize.height);
  }

  return (
    <View>
      <View style={styles.titleContainer}>
        <TextInput
          style={styles.title}
          placeholder="Post Title"
          value={props.title}
          onChangeText={props.titleChangeHandler}
        />
      </View>
      <View
        style={[
          styles.contentContainer,
          { minHeight: 300, height: contentHeight || undefined },
        ]}
      >
        <TextInput
          style={styles.content}
          placeholder="Add Post Content"
          multiline={true}
          onContentSizeChange={contentHandler}
          value={props.content}
          onChangeText={props.contentChangeHandler}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 20,
    paddingBottom: 10,
    width: Dimensions.get("window").width - 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  title: {
    width: "100%",
    fontSize: 28,
    fontFamily: "dm-m",
  },
  contentContainer: {
    marginTop: 20,

    width: Dimensions.get("window").width - 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  content: {
    paddingBottom: 10,
    width: "100%",
    fontSize: 20,
    fontFamily: "dm-regular",
  },
});
