package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Dto.PostDTO;
import com.example.antoangiaothong.atgt.Entity.Comment;
import com.example.antoangiaothong.atgt.Entity.Post;
//import com.example.antoangiaothong.atgt.Entity.ReactId;
import com.example.antoangiaothong.atgt.Entity.ReactPost;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Repository.CommentRepository;
import com.example.antoangiaothong.atgt.Repository.PostRepository;
import com.example.antoangiaothong.atgt.Repository.ReactRepository;
import com.example.antoangiaothong.atgt.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.Optional;
import java.util.Random;

@Service
public class PostServiceImpl implements PostService{
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ReactRepository reactRepository;
    private final CommentRepository commentRepository;
    @Autowired
    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository, ReactRepository reactRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.reactRepository = reactRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public PostDTO getPostById(int id, String userId) {
        Optional<Post> post=postRepository.findById(id);
        if(post.isPresent()){
            Post pos=post.get();
            PostDTO postDTO= new PostDTO();
            postDTO.setId(pos.getId());
            postDTO.setTitle(pos.getTitle());
            postDTO.setContent(pos.getContent());
            postDTO.setTime(pos.getTime());
            postDTO.setOwner(pos.getUser());
            postDTO.setImage(pos.getImage());
            postDTO.setListComment(commentRepository.listComment(pos));
            ReactPost reactPost = reactRepository.getReactByPostAndUser(pos.getId(),userId);
            postDTO.setReact(reactPost!=null?reactPost.getReact():null);
            postDTO.setSaved(false);
            return postDTO;
        }else{
            return  null;
        }

    }

    @Override
    @Transactional
    public ReactPost insertReact(int postId, String userId,String react) {
        Optional<Post> post= postRepository.findById(postId);
        Optional<User> user= userRepository.findById(userId);
        if(!post.isPresent()||!user.isPresent()){
            return null;
        }
        ReactPost reactPost=new ReactPost();
        reactPost.setReact(react);
        reactPost.setId(postId,userId);
        reactPost.setTime(new Time(System.nanoTime()));
        reactRepository.save(reactPost);

        return reactPost;
    }

    @Override
    public Comment insertComment(int postId, String userId, String content) {
        Optional<Post> post= postRepository.findById(postId);
        Optional<User> user= userRepository.findById(userId);
        if(!post.isPresent()||!user.isPresent()){
            return null;
        }
        Comment comment= new Comment();
        comment.setUser(user.get());
        comment.setPost(post.get());
        comment.setContent(content);
        comment.setTime(new Timestamp(System.currentTimeMillis()));
        comment.setId(randomString());
        commentRepository.save(comment);

        return comment;
    }
    public String randomString(){
        int length=10;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();

        // Khai báo một StringBuilder để xây dựng xâu ngẫu nhiên
        StringBuilder sb = new StringBuilder();

        // Tạo xâu ngẫu nhiên bằng cách chọn ngẫu nhiên các ký tự từ chuỗi characters
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            char randomChar = characters.charAt(index);
            sb.append(randomChar);
        }

        // In ra xâu ngẫu nhiên
        String randomString = sb.toString();
        return randomString;
    }

}
