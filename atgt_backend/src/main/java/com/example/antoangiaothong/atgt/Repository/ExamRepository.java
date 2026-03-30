package com.example.antoangiaothong.atgt.Repository;

import com.example.antoangiaothong.atgt.Dto.ResultDTO;
import com.example.antoangiaothong.atgt.Entity.Exam;
import com.example.antoangiaothong.atgt.Entity.Result;
import com.example.antoangiaothong.atgt.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
    @Query("SELECT r FROM Result r WHERE r.resultId.examId = :examId ORDER BY r.numberCorrect desc , r.time asc ")
    Collection<Result> getRankOfExam(@Param("examId") int examId);
}


