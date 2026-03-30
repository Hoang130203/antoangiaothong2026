package com.example.antoangiaothong.atgt.Repository;

import com.example.antoangiaothong.atgt.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,String> {
    @Query("SELECT u FROM User u WHERE u.Account = :account AND u.password = :password")
    User findByAccountAndPassword(@Param("account") String account, @Param("password") String password);

    @Query("SELECT u FROM User u WHERE u.Account = :account ")
    User findByAccount(@Param("account") String account);

    @Query("select u from User  u where  u.Account=:account")
    User findByUserName(@Param("account") String account);

    @Query("select u from User u where u.id=:id")
    User findByUserId(@Param("id") String id);
}

