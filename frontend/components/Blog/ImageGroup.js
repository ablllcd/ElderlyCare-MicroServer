import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImageGroup(props) {
  const pickImage = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!image.canceled) {
      props.setImageList([...props.imageList, image.assets[0].uri]);
    }

    console.log(imageList);
  };

  return (
    <View style={styles.groupView}>
      {props.imageList.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              let updatedList = props.imageList.filter(
                (image, i) => i !== index
              );
              props.setImageList(updatedList);
            }}
          >
            <View style={styles.imageContainer} key={index}>
              <Image style={styles.image} source={{ uri: item }} />
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/app/blog/addImage.png")}
          />
          {/* <Image
            style={styles.image}
            source={{
              uri: "http://192.168.31.143:9000/image/blog/785715207-1.png",
            }}
          /> */}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  groupView: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: "3%",
  },
  imageContainer: {
    padding: 5,
    width: (Dimensions.get("window").width - 30) / 4,
    height: (Dimensions.get("window").width - 30) / 4,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 7,
  },
});
