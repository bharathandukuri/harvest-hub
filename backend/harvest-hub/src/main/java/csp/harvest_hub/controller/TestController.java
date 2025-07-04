package csp.harvest_hub.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin
@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Test";
    }
}