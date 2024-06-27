import { View, Text, TextInput, Platform, TouchableOpacity, SafeAreaView, Image, Dimensions, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';


import Button from '../../components/Button';
import BlogComment from '../../components/Blog/BlogComment';

import { getBlogDetail, likeBlog, unlikeBlog, sendComment } from '../../http/blogService';
import { formattedTime } from '../../util/util';

import Colors from '../../constants/Colors';

const height = Dimensions.get('window').height;

const BlogDetailScreen = ({ route }) => {
  const { blogID } = route.params
  const [blog, setBlog] = useState({
    // userProfileURI: '',
    userName: '',
    title: '',
    content: '',
    editTime: '',
    address: '',
    likes: '',
    tags: [],
    liked: false,
    blogImageList: [],
    commentList: []
  });
  const [comment, setComment] = useState('');

  async function fetchBlogDetail() {
    const res = await getBlogDetail(blogID);
    setBlog(res);
  }

  useEffect(() => {
    fetchBlogDetail();
  }, []);


  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleLike() {
    if (blog.liked) {
      await unlikeBlog(blogID);
    }
    else {
      await likeBlog(blogID);
    }
    fetchBlogDetail();

  }

  async function handleSendComment() {
    if (comment.trim() != "") {
      await sendComment(blogID, comment);
      setComment("");
    }
    fetchBlogDetail();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleGoBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name='chevron-back' size={24} color='black' />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
              <Image source={{ uri: blog.userProfileURI }} style={styles.profile} />
              <Text style={{ fontSize: 15, fontFamily: 'dm-m' }}>{blog.userName}</Text>
            </TouchableOpacity>
          </View>

          <Button condition={{ code: 'outline', fontSize: 15, fontFamily: 'dm-m', height: 30, width: 80 }}>
            Follow
          </Button>
        </View>


        <ScrollView>
          <View style={{ borderColor: '#e6e6e6', borderBottomWidth: 1, paddingBottom: 10 }}>
            <Swiper
              style={{ backgroundColor: '#fff' }}
              loop={false}
              activeDotColor={Colors.green300}
              dotColor={Colors.grey200}
              height={height * 0.5}
              paginationStyle={styles.pagination}
            >
              {blog.blogImageList?.map((image, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={{ uri: image }} style={styles.image} />
                </View>
              ))}
            </Swiper>
            <View style={styles.content}>
              <Text style={{ fontFamily: 'dm-bold', fontSize: 18 }}>{blog.title}</Text>
              <Text style={{ fontFamily: 'dm-regular', fontSize: 15 }}>{blog.content}</Text>
              <View style={{ flexDirection: 'row', columnGap: 5, flexWrap: 'wrap' }}>
                {blog.tags?.map((tag, index) => (
                  <Text key={index} style={{ fontFamily: 'dm-regular', fontSize: 15, color: Colors.green500 }}>#{tag}</Text>
                ))}
              </View>

              <Text style={styles.subText}>Edit Time: {formattedTime(blog.editTime)} {blog.address}</Text>
            </View>
          </View>

          <View style={[styles.content, { paddingBottom: 150 }]}>
            <Text style={styles.subText}>Total comments: {blog.commentList?.length}</Text>
            {blog.commentList?.map((comment, index) => (
              <BlogComment key={comment.commentID} comment={comment} index={index} />
            ))}
            <View style={{ alignItems: 'center', paddingTop: 20, rowGap: 20 }}>
              {blog.commentList?.length == 0 && (
                <Text style={styles.subText}>Add some comments?</Text>
              )}
              <Text style={styles.subText}>—— End ——</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={comment}
            onChangeText={(text) => setComment(text)}
            maxLength={100}
            placeholder="Make a comment..."
            returnKeyType="send"
            returnKeyLabel='send'
            onSubmitEditing={handleSendComment}
            style={styles.input}
          />

          <TouchableOpacity onPress={handleLike} style={styles.iconButton}>
            {blog.liked ?
              <MaterialCommunityIcons name="heart" size={26} color={Colors.pink300} /> :
              <MaterialCommunityIcons name="cards-heart-outline" size={26} color={Colors.grey400} />}
            <Text style={styles.iconButtonText}>{blog.likes}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: Platform.OS === 'android' ? 35 : 5,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
    rowGap: 15
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontSize: 15,
    fontFamily: 'dm-m',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
  },
  iconButtonText: {
    fontSize: 14,
    fontFamily: 'dm-regular'
  },
  subText: {
    fontFamily: 'dm-regular',
    fontSize: 12,
    color: Colors.grey300
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pagination: {
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
  },
});

export default BlogDetailScreen;