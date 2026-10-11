package csp.harvest_hub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import csp.harvest_hub.model.SellerApplication;
import csp.harvest_hub.service.SellerApplicationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/application")
@RequiredArgsConstructor
public class SellerApplicationController {

    private final SellerApplicationService sellerApplicationService;

    @GetMapping("/")
    public ResponseEntity<?> getAllUserApplications(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        return sellerApplicationService.getAllUserApplications(token);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(
            @RequestBody SellerApplication sellerApplication,
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.replace("Bearer ", "");
        return sellerApplicationService.submitApplication(sellerApplication, token);
    }
}
