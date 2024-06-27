package com.elderlycare.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.elderlycare.mapper.UserInfoMapper;
import com.elderlycare.pojo.Account;
import com.elderlycare.pojo.Responses.UserInfoResponse;
import com.elderlycare.pojo.UserBasicInfo;
import com.elderlycare.service.openfeign.RemoteAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Service
public class UserInfoService {
    @Autowired
    UserInfoMapper userInfoMapper;
    @Autowired
    RemoteAccountService remoteAccountService;

    @Value("${my.custom.userImageBasePath}")
    private String basicUserImageDir;

    private String defautImageName = "default.png";

    public UserInfoResponse getUserInfo(int userID) {
        // todo: 向其它服务获取account
        Account account = remoteAccountService.accountInfo(userID);
        // 1. 获取用户基本信息
        QueryWrapper<UserBasicInfo> basicInfoQueryWrapper = new QueryWrapper<>();
        basicInfoQueryWrapper.eq("acct_id", userID);
        UserBasicInfo userBasicInfo = userInfoMapper.selectOne(basicInfoQueryWrapper);
        // 2. 合并用户信息和账号信息
        return new UserInfoResponse(account, userBasicInfo);
    }

    public void modifyUserInfo(int userID, UserBasicInfo userBasicInfo) {
        UpdateWrapper<UserBasicInfo> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("acct_id", userID);
        updateWrapper.set("name", userBasicInfo.getName());
        updateWrapper.set("age", userBasicInfo.getAge());
        updateWrapper.set("gender", userBasicInfo.getGender());
        userInfoMapper.update(updateWrapper);
    }

    public int uploadUserImage(int userID, MultipartFile file) {
        // 1. 存储新头像
        try {
            InputStream is = file.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String Filename = "img" + userID + ".png";
        File newFile = new File(basicUserImageDir + Filename);
        // 2. 如果有老头像则删除
        if (newFile.exists()) {
            newFile.delete();
        }
        try {
            file.transferTo(newFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // 2. 修改用户信息
        UpdateWrapper<UserBasicInfo> basicInfoUpdateWrapper = new UpdateWrapper<>();
        basicInfoUpdateWrapper.set("picture_path", Filename);
        int updated = userInfoMapper.update(basicInfoUpdateWrapper);
        return updated;
    }

    public ResponseEntity<String> getUserImage(int userID) {
        String fileName = "img" + userID + ".png";
        Path path = Paths.get(basicUserImageDir + fileName);

        // 查看用户是否有头像
        if (Files.exists(path)) {
            // 头像存在
            try {
                byte[] imageBytes = Files.readAllBytes(path);
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.TEXT_PLAIN);
                return new ResponseEntity<>(base64Image, headers, HttpStatus.OK);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        } else {
            // 头像不存在，返回默认头像
            path = Paths.get(basicUserImageDir + defautImageName);
            try {
                byte[] imageBytes = Files.readAllBytes(path);
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.TEXT_PLAIN);
                return new ResponseEntity<>(base64Image, headers, HttpStatus.OK);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        }
    }

}



