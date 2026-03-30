'use client'
import { useState, useEffect } from "react";
import questi from "./questions";
import "./styles.css";
import { Button } from "@mui/material";
import Link from "next/link";
import Api from '../../api/api';
function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}
function ExamDetail({ params }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState(questi);
    const [score, setScore] = useState(0);
    const [questionText, setQuestionText] = useState("");
    const [choices, setChoices] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showBack, setShowBack] = useState(false)
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(0);
    const [loaded, setLoaded] = useState(false)
    const [countTime, setCountTime] = useState(0)
    const startQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowNextButton(false);
        showQuestion(0);
    };
    useEffect(() => {
        Api.getExamById(params.id).then(res => {
            // questions = res.data.questions
            // console.log(res.data.questions)
            let list = res.data.questions.map((item) => {
                return {
                    question: item.question,
                    choices: [
                        { text: item.choice1, answer: item.answer == '1' ? true : false },
                        { text: item.choice2, answer: item.answer == '2' ? true : false },
                        { text: item.choice3, answer: item.answer == '3' ? true : false },
                        { text: item.choice4, answer: item.answer == '4' ? true : false },
                    ]
                }
            })
            console.log(list)
            setQuestions(list)
            setMinutes(res.data.time)
            setLoaded(true)
        }
        ).catch(err => console.log(err))
    }, [])
    // console.log(params.id)
    const showQuestion = (index) => {
        resetState();
        let currentQuestion = questions[index];
        let questionNumber = index + 1;
        setQuestionText(`${questionNumber}. ${currentQuestion.question}`);
        const shuffledChoices = shuffle(currentQuestion.choices);
        setChoices(shuffledChoices);
        setCorrectAnswer(currentQuestion.choices.findIndex((choice) => choice.answer === true));
    };

    const resetState = () => {
        setChoices([]);
        setCorrectAnswer(null);
        setSelectedAnswer(null);
    };

    const selectChoice = (isCorrect, index) => {
        if (isCorrect) {
            setScore(score + 1);
        }

        setSelectedAnswer(index);
        setShowNextButton(true);
    };

    const handleNextButton = () => {
        setShowNextButton(false);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

        if (currentQuestionIndex < questions.length - 1) {
            showQuestion(currentQuestionIndex + 1);
        } else {
            // If it's the last question, show the score
            setMinutes(0)
            setSeconds(0)
        }
    };

    const showScore = () => {
        resetState();
        setQuestionText(`Số câu trả lời đúng của bạn là ${score} trên ${questions.length}!`);
        Api.postResult(params.id, score, countTime, questions.length).then(res => {
            console.log(res)
        }
        ).catch(err => console.log(err))
        // clearInterval(timer);

        setShowBack(true)
    };
    useEffect(() => {
        startQuiz();
    }, [questions]);


    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
                setCountTime(countTime + 1)
            } else {
                if (minutes === 0) {
                    clearInterval(timer);
                    setShowNextButton(false);
                    alert('Kết thúc!')
                    showScore();
                    // Thực hiện các hành động khi thời gian đếm ngược kết thúc
                    // Ví dụ: Hiển thị thông báo hoặc thực hiện hành động tự động khác
                } else {
                    setMinutes(minutes - 1);
                    setCountTime(countTime + 1)
                    setSeconds(59);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [minutes, seconds]);
    return (
        <div style={{ minHeight: '800px' }}>
            <div style={{ display: `${loaded ? 'none' : 'fixed'}` }} className="loader_container">
                <div className="loader_" ></div>
            </div>
            <div style={{ padding: '10px 20px', minHeight: '800px', display: `${loaded ? 'block' : 'none'}` }}>
                <p style={{ color: 'red' }}>
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </p>
                <h1>Cuộc thi tìm hiểu về sức khỏe sinh sản</h1>
                <div className="quiz">
                    <h2 id="question">{questionText}</h2>
                    <div id="answer-buttons">
                        {choices.map((choice, index) => (
                            <button
                                key={index}
                                className={`btn ${selectedAnswer === index ? (choice.answer ? "correct" : "incorrect") : ""}`}
                                onClick={() => selectChoice(choice.answer, index)}
                                aria-label={choice.text}
                                disabled={selectedAnswer !== null}
                            >
                                {choice.text}
                            </button>
                        ))}
                    </div>
                    {showNextButton && (
                        <button id="next-button" onClick={handleNextButton}>
                            Next
                        </button>
                    )}
                    {showBack &&
                        <Link href='/exams'>
                            <Button variant="contained">Quay lại</Button>
                        </Link>}
                </div>
            </div>
        </div>
    );
}

export default ExamDetail;