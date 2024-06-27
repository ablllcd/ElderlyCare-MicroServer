import axios from "axios";
import { Alert } from "react-native";
import api from "./request";

export const uploadBlog = async (
  imageList,
  title,
  content,
  address,
  detailedAddress
) => {
  try {
    const formData = new FormData();
    // add images to formdata
    for (let i = 0; i < imageList.length; i++) {
      const image = {
        uri: imageList[i],
        name: `image${i}.png`,
        type: "image/png",
      };
      formData.append("images", image);
    }
    // add text to FormData
    formData.append("title", title);
    formData.append("content", content);
    formData.append("address", address);
    formData.append("detailedAddress", detailedAddress);
    // add time to FormData
    const currentDate = new Date().toISOString();
    formData.append("editTime", currentDate);
    // set head config
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: () => {
        return formData;
      },
    };
    console.log(formData);
    // send request
    const res = await api.post("/blog/upload", formData, config);
    console.log("publish request send");
    // return success
    return "success";
  } catch (error) {
    Alert.alert("Publish Failed", error.toString(), [
      {
        text: "OK",
        onPress: () => { },
      },
    ]);
    throw error;
  }
};

export const gaodeReverseGeoAPI = async (longitude, latitude) => {
  try {
    console.log("try to get gaode API");
    const res = await axios.get("https://restapi.amap.com/v3/geocode/regeo", {
      params: {
        key: "49d6aa79d9e76a353a037f25b20a88f7",
        poitype: "all",
        radius: 3000,
        output: "json",
        extensions: "all",
        roadlevel: 0,
        location: longitude + "," + latitude,
      },
    });

    return res;
  } catch (error) {
    console.log("error: " + error);
    throw error;
  }
};

export const searchBlog = async (pageIndex, pageSize, searchKey) => {
  try {
    const res = await api.get("/blog/search", {
      params: {
        pageIndex,
        pageSize,
        searchKey
      }
    });

    const out = {
      blogList: res.data.list,
      hasNextPage: res.data.hasNextPage
    }
    return out;
  }
  catch (error) {
    throw error;
  }
}

export const getBlogDetail = async (blogID) => {
  try {
    const res = await api.get("/blog/specific", {
      params: {
        blogID
      }
    });
    return res.data;
  }
  catch (error) {
    throw error;
  }
}

export const likeBlog = async (blogID) => {
  try {
    await api.post("/blog/like", null, {
      params: {
        blogID
      }
    });
    return;
  } catch (error) {
    throw error;
  }
}

export const unlikeBlog = async (blogID) => {
  try {
    await api.post("/blog/unlike", null, {
      params: {
        blogID
      }
    });
    return;
  } catch (error) {
    throw error;
  }
}

export const sendComment = async (blogID, comment) => {
  try {
    await api.post('/blog/comment/add', null, {
      params: {
        blogID,
        comment
      }
    });
    return;
  } catch (error) {
    throw error;
  }
}