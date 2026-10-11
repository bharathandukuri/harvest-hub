package csp.harvest_hub.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProduceDetail {
    private String produceName;
    private String quantityAvailable;
    private String seasonality;
}