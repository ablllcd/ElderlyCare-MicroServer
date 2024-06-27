package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("blog_user_like")
public class BlogUserLike {
    @TableId(value = "row_id", type = IdType.AUTO)
    private Integer id;
    @TableField("user_id")
    private Integer userID;
    @TableField("blog_id")
    private Integer blogID;
}
