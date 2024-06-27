package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Blog {
    //@TableField(value = "blogID")
    @TableId(value = "blog_id", type = IdType.AUTO)
    private Integer blogID;
    @TableField(value = "user_acct_id")
    private Integer userID;
    private String title;
    private String content;
    private String address;
    private String detailedAddress;
    private LocalDateTime editTime;
    private int likes;
    private int visibility;
}
