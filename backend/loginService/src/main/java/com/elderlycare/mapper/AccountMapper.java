package com.elderlycare.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elderlycare.pojo.Account;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AccountMapper extends BaseMapper<Account> {
    public Account getAccountAndRoleByID(@Param("id") Integer id);

    public Account getAccountAndRoleByAccount(@Param("account") String account);
}
