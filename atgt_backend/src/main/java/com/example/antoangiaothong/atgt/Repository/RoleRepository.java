package com.example.antoangiaothong.atgt.Repository;

import com.example.antoangiaothong.atgt.Entity.Role;
import com.example.antoangiaothong.atgt.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoleRepository extends JpaRepository<Role,Integer> {
    @Query("select r from Role r where r.id=:id")
    Role findByRoleId(@Param("id") int id);
}
