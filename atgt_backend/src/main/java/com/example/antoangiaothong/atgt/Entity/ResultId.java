package com.example.antoangiaothong.atgt.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter @Setter
public
class ResultId implements Serializable {
    @Column(name = "user_id")
    private String userId;

    @Column(name = "exam_id")
    private int examId;
}
