import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import React from 'react';

import Colors from '../../constants/Colors';

const width = Dimensions.get('window').width;
const BlogComment = ({ comment, index }) => {

    return (
        <View style={[styles.container, { borderTopWidth: index == 0 ? 0 : 1, paddingTop: index == 0 ? 0 : 15 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', columnGap: 12 }}>
                <Image source={{ uri: comment.userImage }} style={styles.profile} />
                <View style={{ rowGap: 5, flex: 1,  }}>
                    <Text style={[styles.text, { color: Colors.grey300 }]}>{comment.userName}</Text>
                    <Text style={[styles.text]} ellipsizeMode='tail'>{comment.comment}</Text>
                </View>
            </View>
        </View>
    )
}

export default BlogComment;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderTopColor: '#e6e6e6',
    },
    profile: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    text: {
        fontFamily: 'dm-m',
        fontSize: 15,
    }
});