import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import BlogCard from './BlogCard';
import { useIsFocused } from '@react-navigation/native';
import { searchBlog } from '../../http/blogService';

const BlogList = ({ searchKey = "" }) => {
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFoused = useIsFocused();

  async function init(index) {
    setIsLoading(true);
    const res = await searchBlog(index, pageSize, searchKey);
    setBlogList(res.blogList);
    setHasNextPage(res.hasNextPage);
    setPageIndex(index + 1);
    setIsLoading(false);
  }
  useEffect(() => {
    init(1);
  }, [isFoused]);

  async function getNextPage(index) {
    setIsLoading(true);
    const res = await searchBlog(index, pageSize, searchKey);
    setBlogList((prevBlogList) => [...prevBlogList, ...res.blogList]);
    setHasNextPage(res.hasNextPage);
    setPageIndex(index + 1);
    setIsLoading(false);
  }

  async function refreshBlogList() {
    setIsRefreshing(true);
    const res = await searchBlog(1, pageSize, searchKey);
    setBlogList(res.blogList);
    setHasNextPage(res.hasNextPage);
    setPageIndex(2);
    setIsRefreshing(false);
  }

  const renderItem = ({ item }) => <BlogCard blog={item} />;

  const handleEndReached = () => {
    if (!isLoading && hasNextPage) {
      getNextPage(pageIndex);
    }
  };

  const handleRefresh = () => {
    if (!isRefreshing) {
      refreshBlogList();
    }
  };

  return (
    <View style={styles.container}>
      <MasonryList
        data={blogList}
        keyExtractor={(blog) => blog.blogID}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        renderItem={renderItem}
      />
    </View>
  );
};

export default BlogList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 5,
  },
  columnWrapper: {
    justifyContent: 'center',
  },
});

