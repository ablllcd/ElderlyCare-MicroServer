package com.elderlycare.mapper.healthManagement;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elderlycare.pojo.Account;
import com.elderlycare.pojo.UserHealthInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface UserHealthInfoMapper extends BaseMapper<UserHealthInfo> {
    public List<UserHealthInfo> getAvgHours(@Param("id") Integer id,
                                           @Param("startTime")LocalDateTime stratTime,
                                           @Param("endTime") LocalDateTime endTime);

    public List<UserHealthInfo> getAvgDays(@Param("id") Integer id,
                                           @Param("startTime")LocalDateTime stratTime,
                                           @Param("endTime") LocalDateTime endTime);

//    public List<UserHealthInfo> getAvgWeeks(@Param("id") Integer id,
//                                           @Param("startTime")LocalDateTime stratTime,
//                                           @Param("endTime") LocalDateTime endTime);

    public List<UserHealthInfo> getAvgMonths(@Param("id") Integer id,
                                           @Param("startTime")LocalDateTime stratTime,
                                           @Param("endTime") LocalDateTime endTime);

    public void insertBatch(@Param("list") List<UserHealthInfo> infoList);

}
