import { StyleSheet, View, ScrollView, Keyboard, Image } from "react-native";
import { useState } from "react";
import { uploadBlog } from "../../http/blogService";

import ImageGroup from "../../components/Blog/ImageGroup";
import CurrentLocation from "../../components/Blog/BlogLocation";
import BlogVisibility from "../../components/Blog/BlogVisibility";
import BlogText from "../../components/Blog/BlogTextContent";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Button from "../../components/Button";

export default function NewBlogScreen({ navigation }) {
  const [imageList, setImageList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [publishClicked, setPublishClicked] = useState(false);

  const publishHandler = async () => {
    setPublishClicked(true);
    // 发送数据
    const res = await uploadBlog(
      imageList,
      title,
      content,
      selectedName,
      selectedAddress
    );
    setPublishClicked(false);
    if (res === "success") {
      // 清空本地数据
      setImageList([]);
      setTitle("");
      setContent("");
      setSelectedAddress("");
      setSelectedName("");
      // 跳转到主页面
      navigation.navigate("CommunityBase");
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <ScrollView>
        <View style={styles.screen}>
          <ImageGroup imageList={imageList} setImageList={setImageList} />
          <BlogText
            title={title}
            titleChangeHandler={setTitle}
            content={content}
            contentChangeHandler={setContent}
          />
          <CurrentLocation
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            selectedName={selectedName}
            setSelectedName={setSelectedName}
          />
          <BlogVisibility />
          <Button
            condition={{
              code: !publishClicked ? "primary" : "forbidden",
              fontSize: 16,
              fontFamily: "dm-bold",
              height: 38,
              width: "60%",
            }}
            onPress={publishHandler}
          >
            Publish New Blog
          </Button>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: 100,
    height: 100,
  },
});
