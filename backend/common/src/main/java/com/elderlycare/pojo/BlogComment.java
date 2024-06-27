package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Bean;

import java.lang.reflect.Type;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("blog_comment")
public class BlogComment {
    @TableId(value = "comment_id", type = IdType.AUTO)
    private Integer commentID;
    @TableField("blog_id")
    private Integer blogID;
    @TableField("user_id")
    private Integer userID;
    private String comment;
}
