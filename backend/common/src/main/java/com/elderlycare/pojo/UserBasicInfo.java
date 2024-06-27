package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserBasicInfo {
    @TableField(value = "acct_id")
    private Integer acctID;
    private String name;
    private String gender;
    private Integer age;
    private String picturePath;
}
