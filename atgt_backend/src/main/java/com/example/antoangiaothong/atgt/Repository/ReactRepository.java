package com.example.antoangiaothong.atgt.Repository;

import com.example.antoangiaothong.atgt.Entity.ReactPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReactRepository extends JpaRepository<ReactPost,Integer> {
    @Query("select r from ReactPost r where  r.id.postId=:postId and r.id.userId=:userId")
    ReactPost getReactByPostAndUser(@Param("postId") int postId,@Param("userId") String userId);
}
