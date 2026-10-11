package csp.harvest_hub.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    private String landmark;
    private String street;
    private String city;
    private String district;
    private String state;
    private String country;
    private String pincode;
    private String latitude;
    private String longitude;
}
