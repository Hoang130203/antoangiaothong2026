package com.example.antoangiaothong.atgt.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter@Setter
@NoArgsConstructor
@Table(name = "feedback")
public class FeedBack {
    @Column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "content",columnDefinition = "nvarchar(max)")
    private String content;

    @Column(name = "time")
    private Timestamp time;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "owner",nullable = false)
    private User user;
}
