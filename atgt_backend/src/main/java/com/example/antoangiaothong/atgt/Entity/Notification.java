package com.example.antoangiaothong.atgt.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter@Setter
@NoArgsConstructor
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name = "time")
    private Timestamp time;

    @Column(name = "content",columnDefinition = "nvarchar(1000)")
    private String content;

    @Column(name = "type")
    private String type;

    @Column(name = "link_to",columnDefinition = "varchar(max)")
    private String linkTo;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;
}
