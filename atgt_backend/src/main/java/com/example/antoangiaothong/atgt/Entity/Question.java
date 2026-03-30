package com.example.antoangiaothong.atgt.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "question",columnDefinition = "nvarchar(max)")
    private String question;

    @Column(name = "choice_1",columnDefinition = "nvarchar(max)")
    private String choice1;

    @Column(name = "choice_2",columnDefinition = "nvarchar(max)")
    private String choice2;

    @Column(name = "choice_3",columnDefinition = "nvarchar(max)")
    private String choice3;

    @Column(name = "choice_4",columnDefinition = "nvarchar(max)")
    private String choice4;

    @Column(name="answer",columnDefinition = "nvarchar(max)")
    private String answer;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "exam")
    private Exam exam;

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", question='" + question + '\'' +
                ", choice1='" + choice1 + '\'' +
                ", choice2='" + choice2 + '\'' +
                ", choice3='" + choice3 + '\'' +
                ", choice4='" + choice4 + '\'' +
                ", answer='" + answer + '\'' +
                ", exam=" + exam +
                '}';
    }
}
