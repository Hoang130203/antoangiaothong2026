package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Dto.ResultDTO;
import com.example.antoangiaothong.atgt.Entity.Exam;
import com.example.antoangiaothong.atgt.Entity.Result;
import com.example.antoangiaothong.atgt.Entity.User;
import org.springframework.data.util.Pair;

import java.util.Collection;

public interface ExamService {
    Exam insertExam(Exam exam);
    Collection<Exam> getListExam();
    Exam getExamById(int id);
    Result postResult(Result result);
    Collection<ResultDTO> getRank(int examId);
}
