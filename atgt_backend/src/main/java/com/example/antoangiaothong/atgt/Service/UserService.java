package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Entity.Post;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Entity.Video;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collection;
import java.util.List;

public interface UserService extends UserDetailsService {
    Collection<Video> getAllVideo(String userId);
    Collection<Post> getAllPost(String userId);
    User getUser(String userId);
    User findAccount(String account,String pass);
    User findAccountToSignUp(String account);
    User findById(String id);
    Post deletePost(Integer id);
    User insertUser(User user);
    Post insertPost(Post post,String ownerId);
    List<Post> getAllPosts();
}
