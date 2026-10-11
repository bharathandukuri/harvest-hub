package csp.harvest_hub.controller.seller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import csp.harvest_hub.enums.Category;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/seller")
@AllArgsConstructor
public class SellerController {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @GetMapping("/selling-categories")
    public List<Category> getSellingCategories(@RequestHeader("Authorization") String authorization) {
        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        return userRepository.findByEmail(email).get().getSellingCategories();
    }
}
