package com.example.antoangiaothong.atgt.Service;

import com.example.antoangiaothong.atgt.Dto.ResultDTO;
import com.example.antoangiaothong.atgt.Entity.Exam;
import com.example.antoangiaothong.atgt.Entity.Question;
import com.example.antoangiaothong.atgt.Entity.Result;
import com.example.antoangiaothong.atgt.Entity.User;
import com.example.antoangiaothong.atgt.Repository.ExamRepository;
import com.example.antoangiaothong.atgt.Repository.QuestionRepository;
import com.example.antoangiaothong.atgt.Repository.ResultRepository;
import com.example.antoangiaothong.atgt.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

@Service
public class ExamServiceImpl implements ExamService{
    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;
    @Autowired
    public ExamServiceImpl(ExamRepository examRepository, UserRepository userRepository, QuestionRepository questionRepository, ResultRepository resultRepository) {
        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.resultRepository = resultRepository;
    }


    @Override
    @Transactional
    public Exam insertExam(Exam exam) {
        User owner= userRepository.findByUserId("admin");
        Exam exam1=new Exam();
        exam1.setOwner(owner);
        exam1.setName(exam.getName());
        exam1.setMaxTimes(exam.getMaxTimes());
        exam1.setTime(exam.getTime());

        examRepository.save(exam1);
        var i=1;
        Collection<Question> listQues=exam.getQuestions();
//        System.out.println(listQues.size());
        for (Question question:listQues
             ) {
//            question.setExam(exam);
            Question ques= new Question();
            ques.setExam(exam1);
            ques.setQuestion(question.getQuestion());
            ques.setAnswer(question.getAnswer());
            ques.setChoice1(question.getChoice1());
            ques.setChoice2(question.getChoice2());
            ques.setChoice3(question.getChoice3());
            ques.setChoice4(question.getChoice4());
            System.out.println(question);
            questionRepository.save(ques);
        }

//        System.out.println(exam.getQuestions().size());
        return exam;
    }

    @Override
    public Collection<Exam> getListExam() {
        Collection<Exam> listExams= examRepository.findAll();
        Collection<Exam> values=new ArrayList<>();
        for (var exam:listExams
             ) {
            Exam e= new Exam();
            e.setId(exam.getId());
            e.setName(exam.getName());
            e.setTime(exam.getTime());
            values.add(e);
        }
        return values;
    }

    @Override
    public Exam getExamById(int id) {
        Optional<Exam> exam= examRepository.findById(id);
        Exam e= new Exam();
        if(exam.isPresent()){
            e=exam.get();
        }
        return e;
    }

    @Override
    @Transactional
    public Result postResult(Result result) {
        User user= userRepository.findByUserId(result.getResultId().getUserId());
        Optional<Exam> exam= examRepository.findById(result.getResultId().getExamId());
        if(user!=null &&exam.isPresent()){
            Optional<Result> r= resultRepository.findById(result.getResultId());
            if(r.isPresent()){
//                System.out.println("finded");
                Result oldResult = r.get();
                Result result1 = new Result();
                result1.setResultId(result.getResultId());
                if(oldResult.getNumberCorrect()<result.getNumberCorrect()){
                    result1.setNumberCorrect(result.getNumberCorrect());
                    result1.setTime(result.getTime());
                }else if(oldResult.getNumberCorrect()==result.getNumberCorrect()){
                    result1.setNumberCorrect(result.getNumberCorrect());
                    result1.setTime((oldResult.getTime()<result.getTime())?oldResult.getTime():result.getTime());
                }else{
                    result1.setNumberCorrect(oldResult.getNumberCorrect());
                    result1.setTime(oldResult.getTime());
                }
                result1.setNumberOfTimes(oldResult.getNumberOfTimes()+1);
                result1.setTotalQuestion(oldResult.getTotalQuestion());
                resultRepository.save(result1);
                return result1;
            }else{
                Result result1= new Result();
                result1.setResultId(result.getResultId());
                result1.setNumberCorrect(result.getNumberCorrect());
                result1.setTime(result.getTime());
                result1.setTotalQuestion(result.getTotalQuestion());
                result1.setNumberOfTimes(1);
                resultRepository.save(result1);
                return result1;
            }

        }
        return null;
    }

    @Override
    public Collection<ResultDTO> getRank(int examId) {
        Collection<Result> rank= examRepository.getRankOfExam(examId);
        Collection<ResultDTO> ranks= new ArrayList<>();
        for (Result r:rank
             ) {
            User u= userRepository.findByUserId(r.getResultId().getUserId());

            System.out.println(u);
            ranks.add(new ResultDTO(r,u.getName(),u.getAvatar()));
        }
        System.out.println(rank.size());
        return ranks;
    }
}
