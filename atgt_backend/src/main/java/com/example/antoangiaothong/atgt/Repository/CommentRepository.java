package com.example.antoangiaothong.atgt.Repository;

import com.example.antoangiaothong.atgt.Entity.Comment;
import com.example.antoangiaothong.atgt.Entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface CommentRepository extends JpaRepository<Comment,String> {
    @Query("select c from Comment c where c.post=:post")
    Collection<Comment> listComment(@Param("post")Post post);
}
