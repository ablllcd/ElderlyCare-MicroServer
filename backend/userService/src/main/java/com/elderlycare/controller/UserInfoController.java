package com.elderlycare.controller;

import com.elderlycare.pojo.Requests.ModifyDeviceRequest;
import com.elderlycare.pojo.Responses.UserInfoResponse;
import com.elderlycare.pojo.UserBasicInfo;
import com.elderlycare.service.UserDeviceService;
import com.elderlycare.service.UserInfoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

@RestController
@AllArgsConstructor
public class UserInfoController {
    private UserInfoService userInfoService;
    private UserDeviceService userDeviceService;

    @GetMapping("/user/image")
    public ResponseEntity<String> getUserImage(@RequestHeader("userID") int userID) {
        return userInfoService.getUserImage(userID);
    }

    @GetMapping("/user/info")
    public UserInfoResponse getUserInfo(@RequestHeader("userID") int userID) {
        return userInfoService.getUserInfo(userID);
    }

    @PostMapping("/user/info")
    public String modifyUserInfo(@RequestHeader("userID") int userID, @RequestBody UserBasicInfo userBasicInfo) {
        userInfoService.modifyUserInfo(userID, userBasicInfo);
        return "modify success";
    }

    @PostMapping("/user/image/upload")
    public String uploadImg(@RequestParam("file") MultipartFile file, @RequestHeader("userID") int userID) {
        System.out.println("image upload");
        userInfoService.uploadUserImage(userID, file);
        return "update success";
    }

    @PostMapping("/user/device")
    public void modifyDevice(@RequestHeader("userID") int userID, @RequestBody ModifyDeviceRequest deviceRequest) {
        String deviceID = deviceRequest.getDeviceID();
        userDeviceService.modifyUserDevice(userID, deviceID);
    }

    @GetMapping("/user/device")
    public ArrayList<String> getDevice(@RequestHeader("userID") int userID) {
        return userDeviceService.getDeviceByUser(userID);
    }

    @GetMapping("/user/info/device")
    public int getUserByDevice(@RequestHeader("deviceID") String deviceID) {
        return userDeviceService.getUserByDevice(deviceID);
    }
}
