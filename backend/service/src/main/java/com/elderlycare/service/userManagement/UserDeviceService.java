package com.elderlycare.service.userManagement;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.elderlycare.mapper.userManagement.UserDeviceMapper;
import com.elderlycare.pojo.Account;
import com.elderlycare.pojo.UserDeviceRelation;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@AllArgsConstructor
public class UserDeviceService {
    UserDeviceMapper userDeviceMapper;
    public int getUserByDevice(String deviceID){
        QueryWrapper<UserDeviceRelation> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("device_id",deviceID);
        UserDeviceRelation userDeviceRelation = userDeviceMapper.selectOne(queryWrapper);

        return userDeviceRelation.getAcctID();
    }

    public ArrayList<String> getDeviceByUser(UserDetails userDetails){
        // 1. 获取用户基本信息
        Account account = (Account) userDetails;
        Integer userID = account.getId();
        QueryWrapper<UserDeviceRelation> queryWrapper = new QueryWrapper<>();

        // 根据用户ID查询设备
        queryWrapper.eq("acct_id",userID);
        UserDeviceRelation userDeviceRelation = userDeviceMapper.selectOne(queryWrapper);

        // 将设备添加到数组并返回
        ArrayList<String> devices = new ArrayList<>();
        if(userDeviceRelation != null){
            devices.add(userDeviceRelation.getDeviceID());
        }
        return devices;
    }

    public void modifyUserDevice(UserDetails userDetails, String deviceID){
        // 1. 获取用户基本信息
        Account account = (Account) userDetails;
        Integer userID = account.getId();
        // 查看用户是否已有设备
        QueryWrapper<UserDeviceRelation> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("acct_id",userID);
        UserDeviceRelation oldDevice = userDeviceMapper.selectOne(queryWrapper);
        if (oldDevice == null){
            // 没有设备则添加
            UserDeviceRelation userDeviceRelation = new UserDeviceRelation(userID, deviceID);
            userDeviceMapper.insert(userDeviceRelation);
        }else {
            // 有设备则修改
            UpdateWrapper<UserDeviceRelation> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("acct_id",userID).set("device_id",deviceID);
            userDeviceMapper.update(updateWrapper);
        }
    }
}
