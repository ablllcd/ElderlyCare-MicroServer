package com.elderlycare.pojo.Responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Integer commentID;
    private String userName;
    private String userImage;
    private String comment;
}
