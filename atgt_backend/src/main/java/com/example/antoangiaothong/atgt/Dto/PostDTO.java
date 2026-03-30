package com.example.antoangiaothong.atgt.Dto;


import com.example.antoangiaothong.atgt.Entity.Comment;
import com.example.antoangiaothong.atgt.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.Collection;

@Getter@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private int id;
    private String title;
    private String content;
    private Timestamp time;
    private String image;
    private User owner;
//    private User user;
    private boolean isSaved;
    private String react;
    private Collection<Comment> listComment;
}
