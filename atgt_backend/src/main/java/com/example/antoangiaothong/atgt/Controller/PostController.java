package com.example.antoangiaothong.atgt.Controller;

import com.example.antoangiaothong.atgt.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

@CrossOrigin
@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable int id,@RequestParam String userId){
        return ResponseEntity.ok(postService.getPostById(id,userId)) ;
    }

    @PostMapping("/react")
    public ResponseEntity<?> insertReact(@RequestParam int postId,@RequestParam String userId,@RequestParam String react){
        return ResponseEntity.ok(postService.insertReact(postId,userId,react));
    }

    @PostMapping("/comment")
    public ResponseEntity<?> insertComment(@RequestParam int postId,@RequestParam String userId,@RequestParam String content){
        return ResponseEntity.ok(postService.insertComment(postId,userId,content));
    }
}
