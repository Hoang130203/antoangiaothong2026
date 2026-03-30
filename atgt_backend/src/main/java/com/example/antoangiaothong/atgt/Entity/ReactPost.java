package com.example.antoangiaothong.atgt.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.sql.Time;

@Embeddable
@Getter @Setter
class ReactId implements Serializable {
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
@Table(name = "react_post")
public class ReactPost {
    @EmbeddedId
    private ReactId id;

    @Column(name = "time")
    private Time time;

    @Column(name = "react")
    private String react;

    public void setId(int postId, String userId) {
        ReactId reactId= new ReactId();
        reactId.setPostId(postId);
        reactId.setUserId(userId);
        this.setId(reactId);
    }
}
