package csp.harvest_hub.dto;

import csp.harvest_hub.enums.Role;

public record UserResponseDto(String fullName, String email, Role roles) {
}
