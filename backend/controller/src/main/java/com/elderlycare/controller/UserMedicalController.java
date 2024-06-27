package com.elderlycare.controller;

import com.elderlycare.pojo.Medicine;
import com.elderlycare.pojo.MedicineIntake;
import com.elderlycare.pojo.Requests.MultiTimeMedicineRequest;
import com.elderlycare.service.medicineManagement.UserMedicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user/medicalInfo")
public class UserMedicalController {
    @Autowired
    UserMedicalService userMedicalService;

    @GetMapping("/medicines")
    public List<MultiTimeMedicineRequest> getAllMedicine(Authentication authentication){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        return userMedicalService.getAllMedicine(userDetails);
    }

    @PostMapping("/medicine")
    public String addMedicine(Authentication authentication,
                            @RequestBody MultiTimeMedicineRequest multiTimeMedicineRequest){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        userMedicalService.addMedicine(userDetails, multiTimeMedicineRequest);
        return "Add medicine success";
    }

    @PostMapping("/medicine/delete/multitime")
    public String deleteMedicine(Authentication authentication,
                               @RequestBody MultiTimeMedicineRequest multiTimeMedicineRequest){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        userMedicalService.deleteMedicineWithMultiTime(userDetails,multiTimeMedicineRequest);
        return "delete success";
    }

    @PostMapping("/medicine/delete/singletime")
    public void deleteMedicine(Authentication authentication,
                               @RequestBody Medicine medicine){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        userMedicalService.deleteSingleMedicineTime(userDetails,medicine);
    }

    @PostMapping("/intake")
    public String addMedicineIntake(Authentication authentication,
                                  @RequestBody MedicineIntake medicineIntake){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        userMedicalService.addMedicineIntake(userDetails,medicineIntake);
        return "Add intake success";
    }

    @GetMapping("/intake")
    public ArrayList<MedicineIntake> getMedicineIntake(Authentication authentication,
                                                       @RequestHeader("currentDate") String currentDate){
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        return userMedicalService.getMedicineIntakeByTime(userDetails,currentDate);
    }
}
