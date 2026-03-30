package com.example.antoangiaothong.atgt.Repository;
import com.example.antoangiaothong.atgt.Entity.ResultId;
import com.example.antoangiaothong.atgt.Entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<Result, ResultId> {
}
