package csp.harvest_hub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double rating;

    private String title;

    @Lob
    private String description;

    @ElementCollection
    private List<String> images;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User by;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
}
