package com.elderlycare.pojo.Responses;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogResponse {
    // blog发布者的信息
    private Integer userID;
    private String userName;
    private String userProfileURI;
    // blog本身信息
    private Integer blogID;
    private String title;
    private String content;
    private String address;
    private String detailedAddress;
    private LocalDateTime editTime;
    private int likes;
    private int visibility;
    // blog图片信息
    private List<String> blogImageList;
    // blog评论信息
    private List<CommentResponse> commentList;
    // 是否当前用户被点赞了
    private boolean liked;
}
