package com.example.antoangiaothong.atgt.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.sql.Time;

@Embeddable
class SavedPostId implements Serializable {
    @Column(name = "post_id")
    private int postId;

    @Column(name = "user_id")
    private String userId;

    // Constructors, getters, and setters
}
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "saved_post")
public class SavedPost {
    @EmbeddedId
    private SavedPostId id;

    @Column(name = "time_saved")
    private Time timeSaved;
}
