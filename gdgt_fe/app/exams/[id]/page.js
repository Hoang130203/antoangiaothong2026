'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Trophy, RotateCcw } from 'lucide-react';
import PageWrapper from '@/components/ui/PageWrapper';
import Api from '../../api/api';

function shuffle(array) {
  const s = [...array];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

export default function ExamDetail({ params }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [choices, setChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [finished, setFinished] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [countTime, setCountTime] = useState(0);
  const [examName, setExamName] = useState('Bài kiểm tra an toàn giao thông');
  const totalTime = minutes * 60 + seconds; // will be recalculated

  useEffect(() => {
    Api.getExamById(params.id).then((res) => {
      const list = res.data.questions.map((item) => ({
        question: item.question,
        choices: [
          { text: item.choice1, answer: item.answer === '1' },
          { text: item.choice2, answer: item.answer === '2' },
          { text: item.choice3, answer: item.answer === '3' },
          { text: item.choice4, answer: item.answer === '4' },
        ],
      }));
      setQuestions(list);
      setMinutes(res.data.time);
      if (res.data.name) setExamName(res.data.name);
      setLoaded(true);
    }).catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (questions.length > 0) showQuestion(0);
  }, [questions]);

  useEffect(() => {
    if (!loaded || finished) return;
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds((s) => s - 1);
        setCountTime((c) => c + 1);
      } else if (minutes === 0) {
        clearInterval(timer);
        handleFinish(score);
      } else {
        setMinutes((m) => m - 1);
        setSeconds(59);
        setCountTime((c) => c + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds, loaded, finished]);

  const showQuestion = (index) => {
    setChoices([]);
    setSelectedAnswer(null);
    const q = questions[index];
    if (!q) return;
    setQuestionText(`${index + 1}. ${q.question}`);
    setChoices(shuffle(q.choices));
  };

  const selectChoice = (isCorrect, index) => {
    if (selectedAnswer !== null) return;
    if (isCorrect) setScore((s) => s + 1);
    setSelectedAnswer(index);
    setShowNextButton(true);
  };

  const handleNext = () => {
    setShowNextButton(false);
    const next = currentQuestionIndex + 1;
    if (next < questions.length) {
      setCurrentQuestionIndex(next);
      showQuestion(next);
    } else {
      handleFinish(selectedAnswer !== null && choices[selectedAnswer]?.answer ? score + 1 : score);
    }
  };

  const handleFinish = (finalScore) => {
    setFinished(true);
    setMinutes(0);
    setSeconds(0);
    Api.postResult(params.id, finalScore, countTime, questions.length).catch(() => {});
  };

  const timerColor = minutes === 0 && seconds <= 30 ? 'text-red-500' : 'text-orange-500';
  const progress = questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0;

  return (
    <PageWrapper>
      {!loaded && (
        <div className="loader_container">
          <div className="loader_spinner" />
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-heading)', fontFamily: 'Nunito, sans-serif' }}>{examName}</h1>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm">
              Câu {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}
            </p>
            <div className={`flex items-center gap-1.5 font-mono font-bold text-lg ${timerColor}`}>
              <Clock className="w-5 h-5" />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--card-border)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--primary)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {finished ? (
          /* Result screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl shadow-sm p-10 text-center"
            style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}
          >
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-heading)' }}>Hoàn thành!</h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Bài kiểm tra an toàn giao thông</p>
            <div className="flex justify-center gap-8 mb-8">
              <div>
                <div className="text-4xl font-black" style={{ color: 'var(--primary)' }}>{score}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Câu đúng</div>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <div className="text-4xl font-black text-slate-600">{questions.length}</div>
                <div className="text-slate-400 text-sm">Tổng câu</div>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <div className="text-4xl font-black text-green-500">
                  {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%
                </div>
                <div className="text-slate-400 text-sm">Tỉ lệ đúng</div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Link href="/exams">
                <motion.button whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-slate-300 font-semibold text-sm transition-all flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Quay lại
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Quiz screen */
          <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}>
            <h2 className="text-base font-semibold text-slate-800 mb-5 leading-relaxed">{questionText}</h2>

            <div className="space-y-3">
              {choices.map((choice, index) => {
                let btnClass = 'quiz-btn';
                if (selectedAnswer !== null) {
                  if (index === selectedAnswer) {
                    btnClass += choice.answer ? ' correct' : ' incorrect';
                  } else if (choice.answer) {
                    btnClass += ' correct';
                  }
                }
                return (
                  <motion.button
                    key={index}
                    whileHover={selectedAnswer === null ? { x: 4 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    className={btnClass}
                    onClick={() => selectChoice(choice.answer, index)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {choice.text}
                  </motion.button>
                );
              })}
            </div>

            {showNextButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex justify-end"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <><ChevronRight className="w-4 h-4" /> Câu tiếp theo</>
                  ) : (
                    <><Trophy className="w-4 h-4" /> Nộp bài</>
                  )}
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}