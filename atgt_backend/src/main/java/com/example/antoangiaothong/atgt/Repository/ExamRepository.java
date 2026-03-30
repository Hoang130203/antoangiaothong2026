package com.example.antoangiaothong.atgt.Repository;

import com.example.antoangiaothong.atgt.Dto.ResultDTO;
import com.example.antoangiaothong.atgt.Entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface ExamRepository extends JpaRepository<Exam, Integer> {

    @Query("SELECT new com.example.antoangiaothong.atgt.Dto.ResultDTO(r, u.name, u.avatar) " +
           "FROM Result r, User u " +
           "WHERE u.id = r.resultId.userId " +
           "AND r.resultId.examId = :examId " +
           "ORDER BY r.numberCorrect DESC, r.time ASC")
    Collection<ResultDTO> getRankWithUser(@Param("examId") int examId);
}
