package com.elderlycare.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id = null;
    @TableField(value = "account_name")
    private String accountName;
    private String email;
    private String password;
    private Boolean locked = false;
    @Getter(AccessLevel.NONE)
    private Boolean enabled = false;
    @TableField(exist = false)
    List<String> roles;
}
