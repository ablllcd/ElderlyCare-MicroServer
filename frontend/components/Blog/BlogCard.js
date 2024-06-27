import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const BlogCard = ({ blog }) => {
    const navigation = useNavigation();

    function navigateBlogDetail() {
        navigation.navigate('BlogDetail', { blogID: blog.blogID });
    }

    return (
        <View style={[styles.shadowProp, styles.blogItem]}>
            <TouchableOpacity activeOpacity={1} onPress={navigateBlogDetail}>
                <Image source={{ uri: blog.blogImageList[0] }} style={styles.blogImage} />
                <View style={styles.blogBottom}>
                    <Text style={styles.blogTitle}>{blog.title}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[styles.blogRow, { columnGap: 5 }]}>
                            <Image source={{ uri: blog.userProfileURI }} style={styles.blogProfile} />
                            <Text style={styles.blogAuthor}>{blog.userName}</Text>
                        </View>
                        <View style={[styles.blogRow, { columnGap: 3, justifyContent: 'flex-end' }]}>
                            {blog.liked ?
                                <MaterialCommunityIcons name="heart" size={20} color={Colors.pink300} /> :
                                <MaterialCommunityIcons name="cards-heart-outline" size={20} color={Colors.grey400} />}
                            <Text style={styles.blogLikes}>{blog.likes}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>



    );
};

export default BlogCard;

const styles = StyleSheet.create({
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    blogItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: (width - 20) / 2,
        marginVertical: 7,
        marginHorizontal: 5,
    },
    blogImage: {
        width: '100%',
        height: 160,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    blogBottom: {
        width: '100%',
        padding: 10,
        rowGap: 10
    },
    blogTitle: {
        fontSize: 14,
        fontFamily: 'dm-bold',
    },
    blogAuthor: {
        fontSize: 12,
        fontFamily: 'dm-m',
    },
    blogLikes: {
        fontFamily: 'dm-regular',
        fontSize: 14
    },
    blogProfile: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    blogRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});