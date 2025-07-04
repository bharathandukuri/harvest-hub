package csp.harvest_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserRegisterDto {
    private String email;
    private String password;
    private String fullName;
}
