package com.elderlycare.controller;

import com.elderlycare.pojo.Requests.ModifyDeviceRequest;
import com.elderlycare.pojo.Responses.UserInfoResponse;
import com.elderlycare.pojo.UserBasicInfo;
import com.elderlycare.service.userManagement.UserDeviceService;
import com.elderlycare.service.userManagement.UserInfoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

@RestController
@AllArgsConstructor
public class UserInfoController {

    private UserInfoService userInfoService;
    private UserDeviceService userDeviceService;

    @GetMapping("/user/image")
    public ResponseEntity<String> getUserImage(Authentication authentication){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        return userInfoService.getUserImage(userDetails);
    }

    @GetMapping("/user/info")
    public UserInfoResponse getUserInfo(Authentication authentication){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        return userInfoService.getUserInfo(userDetails);
    }

    @PostMapping("/user/info")
    public String modifyUserInfo(Authentication authentication, @RequestBody UserBasicInfo userBasicInfo){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        userInfoService.modifyUserInfo(userDetails, userBasicInfo);
        return "modify success";
    }

    @PostMapping("/user/image/upload")
    public String uploadImg(@RequestParam("file") MultipartFile file, Authentication authentication){
        System.out.println("image upload");
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        userInfoService.uploadUserImage(userDetails,file);
        return "update success";
    }

    @PostMapping("/user/device")
    public void modifyDevice(Authentication authentication, @RequestBody ModifyDeviceRequest deviceRequest){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        String deviceID = deviceRequest.getDeviceID();
        userDeviceService.modifyUserDevice(userDetails,deviceID);
    }

    @GetMapping("/user/device")
    public ArrayList<String> getDevice(Authentication authentication){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        return userDeviceService.getDeviceByUser(userDetails);
    }
}
