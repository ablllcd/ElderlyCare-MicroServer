package com.elderlycare.mapper.userManagement;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elderlycare.pojo.UserDeviceRelation;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDeviceMapper extends BaseMapper<UserDeviceRelation> {
}
