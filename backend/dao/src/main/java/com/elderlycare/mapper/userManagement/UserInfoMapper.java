package com.elderlycare.mapper.userManagement;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elderlycare.pojo.UserBasicInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserInfoMapper extends BaseMapper<UserBasicInfo> {
}
