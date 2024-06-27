package com.elderlycare.controller;

import com.elderlycare.pojo.Medicine;
import com.elderlycare.pojo.MedicineIntake;
import com.elderlycare.pojo.Requests.MultiTimeMedicineRequest;
import com.elderlycare.service.UserMedicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user/medicalInfo")
public class UserMedicalController {
    @Autowired
    UserMedicalService userMedicalService;

    @GetMapping("/medicines")
    public List<MultiTimeMedicineRequest> getAllMedicine(@RequestHeader("userID") int userID) {
        return userMedicalService.getAllMedicine(userID);
    }

    @PostMapping("/medicine")
    public String addMedicine(@RequestHeader("userID") int userID,
                              @RequestBody MultiTimeMedicineRequest multiTimeMedicineRequest) {
        userMedicalService.addMedicine(userID, multiTimeMedicineRequest);
        return "Add medicine success";
    }

    @PostMapping("/medicine/delete/multitime")
    public String deleteMedicine(@RequestHeader("userID") int userID,
                                 @RequestBody MultiTimeMedicineRequest multiTimeMedicineRequest) {
        userMedicalService.deleteMedicineWithMultiTime(userID, multiTimeMedicineRequest);
        return "delete success";
    }

    @PostMapping("/medicine/delete/singletime")
    public void deleteMedicine(@RequestHeader("userID") int userID,
                               @RequestBody Medicine medicine) {
        userMedicalService.deleteSingleMedicineTime(userID, medicine);
    }

    @PostMapping("/intake")
    public String addMedicineIntake(@RequestHeader("userID") int userID,
                                    @RequestBody MedicineIntake medicineIntake) {
        userMedicalService.addMedicineIntake(userID, medicineIntake);
        return "Add intake success";
    }

    @GetMapping("/intake")
    public ArrayList<MedicineIntake> getMedicineIntake(@RequestHeader("userID") int userID,
                                                       @RequestHeader("currentDate") String currentDate) {
        return userMedicalService.getMedicineIntakeByTime(userID, currentDate);
    }
}
