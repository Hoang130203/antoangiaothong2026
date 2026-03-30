package com.example.antoangiaothong.atgt.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter@Setter
@Table(name="image")
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="url",columnDefinition = "nvarchar(max)")
    private String url;

    @JoinColumn(name = "owner")
    @ManyToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    private User owner;
}
