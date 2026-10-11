package csp.harvest_hub.dto;

import java.time.LocalDate;

import csp.harvest_hub.model.Address;
import csp.harvest_hub.model.User;
import lombok.Data;

@Data
public class UserProfileDto {

    private String fullName;
    private String phoneNumber;
    private String bio;
    private String profilePicUrl;
    private LocalDate dateOfBirth;
    private Address address;

    public static UserProfileDto fromUser(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhone());
        dto.setDateOfBirth(user.getDob());
        dto.setBio(user.getBio());
        dto.setProfilePicUrl(user.getProfilePicUrl());
        dto.setAddress(user.getAddress());
        return dto;
    }
}
