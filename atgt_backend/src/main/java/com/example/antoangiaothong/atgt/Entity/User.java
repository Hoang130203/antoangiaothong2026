package com.example.antoangiaothong.atgt.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name",nullable = false,columnDefinition = "nvarchar(1000)")
    private  String name;

    @Column(name = "avatar")
    private  String avatar;

    @Column(name = "enable")
    private boolean enable;

    @Column(name = "has_provider")
    private boolean hasProvider;

    @Column(name = "account")
    private String Account;

    @Column(name="password")
    private String password;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "school")
    private String school;

    @Column(name = "of_class")
    private String ofClass;

    @Column(name = "email")
    private String email;

    @Column(name = "type")
    private Integer type;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinTable(name = "users_roles",joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Collection<Role> roles;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinTable(name = "friend",joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "friend_id"}))
    private Collection<User> friends;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "owner")
    private Collection<Video> videos;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "owner")
    private Collection<Exam> exams;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "user")
    private Collection<Post> posts;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "user")
    private Collection<FeedBack> feedBacks;
}
