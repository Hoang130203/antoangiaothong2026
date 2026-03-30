package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Dto.PostDTO;
import com.example.antoangiaothong.atgt.Entity.Comment;
import com.example.antoangiaothong.atgt.Entity.Post;
import com.example.antoangiaothong.atgt.Entity.ReactPost;

public interface PostService {
    PostDTO getPostById(int id,String userId);
    ReactPost insertReact(int postId,String userId,String react);
    Comment insertComment(int postId,String userId,String content);
}
