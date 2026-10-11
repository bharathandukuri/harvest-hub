package csp.harvest_hub.dto;

import java.util.List;

import lombok.Data;

@Data
public class ReviewRequest {
    private double rating;
    private String title;
    private String description;
    private List<String> images;
    private Long userId;
}
