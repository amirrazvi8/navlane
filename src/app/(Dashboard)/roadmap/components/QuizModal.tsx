"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, X, Trophy, CheckCircle2, XCircle, Brain, Sparkles } from "lucide-react";
import axios from "axios";
import { handleApiError } from "@/lib/axios";

interface QuizQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
}

interface QuizResult {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapId: string;
  milestoneId: string;
  milestoneTitle: string;
  onQuizComplete: () => void;
}

type QuizPhase = "loading" | "quiz" | "submitting" | "results";

export function QuizModal({
  isOpen,
  onClose,
  roadmapId,
  milestoneId,
  milestoneTitle,
  onQuizComplete,
}: QuizModalProps) {
  const [phase, setPhase] = useState<QuizPhase>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const generateQuiz = async () => {
    setPhase("loading");
    setError(null);
    setAnswers({});
    setCurrentIndex(0);
    try {
      const res = await axios.post("/api/roadmap/quiz", { roadmapId, milestoneId });
      const data = res.data;
      setQuestions(data.questions);
      setPhase("quiz");
    } catch (err: any) {
      setError(handleApiError(err));
      setPhase("loading");
    }
  };

  const submitQuiz = async () => {
    setPhase("submitting");
    try {
      const res = await axios.put("/api/roadmap/quiz", { roadmapId, milestoneId, answers });
      const data = res.data;
      setScore(data.score);
      setTotal(data.total);
      setResults(data.results);
      setPhase("results");
      onQuizComplete();
    } catch (err: any) {
      setError(handleApiError(err));
      setPhase("quiz");
    }
  };

  const handleSelectAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // Start generating quiz when modal opens — only once
  useEffect(() => {
    if (isOpen && milestoneId && !hasFetched.current) {
      hasFetched.current = true;
      generateQuiz();
    }
    if (!isOpen) {
      hasFetched.current = false;
    }
  }, [isOpen, milestoneId]);

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]);
  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={phase === "results" ? onClose : undefined}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 rounded-2xl border shadow-2xl"
          style={{
            background: "linear-gradient(135deg, hsl(220 25% 8%) 0%, hsl(220 20% 12%) 100%)",
            borderColor: "rgba(0, 245, 212, 0.15)",
            boxShadow: "0 0 60px rgba(0, 245, 212, 0.08), 0 25px 50px rgba(0,0,0,0.5)",
          }}
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Close button */}
          {phase === "results" && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}

          {/* Header */}
          <div
            className="px-6 pt-6 pb-4 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: "rgba(0, 245, 212, 0.1)",
                  border: "1px solid rgba(0, 245, 212, 0.2)",
                }}
              >
                <Brain className="h-5 w-5" style={{ color: "#00f5d4" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Module Quiz</h2>
                <p className="text-xs text-gray-400 mt-0.5">{milestoneTitle}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* LOADING PHASE */}
            {phase === "loading" && !error && (
              <div className="flex flex-col items-center justify-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-12 w-12 mb-4" style={{ color: "#00f5d4" }} />
                </motion.div>
                <p className="text-sm text-gray-300 mb-1">Generating quiz questions...</p>
                <p className="text-xs text-gray-500">AI is creating conceptual questions based on your module</p>
              </div>
            )}

            {/* ERROR STATE */}
            {error && (
              <div className="flex flex-col items-center justify-center py-12">
                <XCircle className="h-12 w-12 text-red-400 mb-4" />
                <p className="text-sm text-red-400 mb-4 text-center">{error}</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="border-gray-700">
                    Close
                  </Button>
                  <Button
                    onClick={() => { setError(null); setQuestions([]); hasFetched.current = false; generateQuiz(); hasFetched.current = true; }}
                    className="bg-[#00f5d4] text-black hover:bg-[#00dbb8]"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* QUIZ PHASE */}
            {phase === "quiz" && currentQuestion && (
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>{Object.keys(answers).length}/{questions.length} answered</span>
                </div>
                <div className="h-1.5 w-full rounded-full mb-6" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #00f5d4, #7b61ff)" }}
                    initial={false}
                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className="text-base font-semibold text-white mb-5 leading-relaxed">
                      {currentQuestion.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {(Object.entries(currentQuestion.options) as [string, string][]).map(
                        ([key, value]) => {
                          const isSelected = answers[currentQuestion.id] === key;
                          return (
                            <motion.button
                              key={key}
                              onClick={() => handleSelectAnswer(currentQuestion.id, key)}
                              className="w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3"
                              style={{
                                background: isSelected
                                  ? "rgba(0, 245, 212, 0.08)"
                                  : "rgba(255,255,255,0.02)",
                                borderColor: isSelected
                                  ? "rgba(0, 245, 212, 0.4)"
                                  : "rgba(255,255,255,0.08)",
                                boxShadow: isSelected ? "0 0 20px rgba(0, 245, 212, 0.08)" : "none",
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <span
                                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                                style={{
                                  background: isSelected
                                    ? "rgba(0, 245, 212, 0.2)"
                                    : "rgba(255,255,255,0.06)",
                                  color: isSelected ? "#00f5d4" : "#94a3b8",
                                  border: isSelected
                                    ? "1px solid rgba(0, 245, 212, 0.4)"
                                    : "1px solid rgba(255,255,255,0.1)",
                                }}
                              >
                                {key}
                              </span>
                              <span
                                className="text-sm leading-relaxed pt-0.5"
                                style={{ color: isSelected ? "#e2e8f0" : "#94a3b8" }}
                              >
                                {value}
                              </span>
                            </motion.button>
                          );
                        }
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <Button
                    variant="ghost"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => i - 1)}
                    className="text-gray-400"
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1.5">
                    {questions.map((q, i) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(i)}
                        className="w-2.5 h-2.5 rounded-full transition-all"
                        style={{
                          background:
                            i === currentIndex
                              ? "#00f5d4"
                              : answers[q.id]
                              ? "rgba(0, 245, 212, 0.4)"
                              : "rgba(255,255,255,0.15)",
                          boxShadow: i === currentIndex ? "0 0 8px rgba(0, 245, 212, 0.5)" : "none",
                        }}
                      />
                    ))}
                  </div>
                  {currentIndex < questions.length - 1 ? (
                    <Button
                      onClick={() => setCurrentIndex((i) => i + 1)}
                      className="bg-[#00f5d4] text-black hover:bg-[#00dbb8] font-medium"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={submitQuiz}
                      disabled={!allAnswered}
                      className="bg-[#7b61ff] text-white hover:bg-[#6a4fff] font-medium disabled:opacity-40"
                    >
                      Submit Quiz
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* SUBMITTING PHASE */}
            {phase === "submitting" && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin mb-4" style={{ color: "#7b61ff" }} />
                <p className="text-sm text-gray-300">Grading your answers...</p>
              </div>
            )}

            {/* RESULTS PHASE */}
            {phase === "results" && (
              <div>
                {/* Score Header */}
                <motion.div
                  className="flex flex-col items-center text-center mb-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: scorePercent >= 60
                        ? "rgba(0, 245, 212, 0.1)"
                        : "rgba(255, 107, 157, 0.1)",
                      border: `2px solid ${scorePercent >= 60 ? "rgba(0, 245, 212, 0.3)" : "rgba(255, 107, 157, 0.3)"}`,
                      boxShadow: scorePercent >= 60
                        ? "0 0 40px rgba(0, 245, 212, 0.15)"
                        : "0 0 40px rgba(255, 107, 157, 0.15)",
                    }}
                  >
                    <Trophy
                      className="h-10 w-10"
                      style={{ color: scorePercent >= 60 ? "#00f5d4" : "#ff6b9d" }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {score}/{total}
                  </h3>
                  <p className="text-sm" style={{ color: scorePercent >= 60 ? "#00f5d4" : "#ff6b9d" }}>
                    {scorePercent >= 80
                      ? "Excellent! You've mastered this module! 🎉"
                      : scorePercent >= 60
                      ? "Good job! You have a solid understanding. 👍"
                      : "Keep learning! Review the concepts and try again. 💪"}
                  </p>
                  <div
                    className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: scorePercent >= 60 ? "rgba(0, 245, 212, 0.1)" : "rgba(255, 107, 157, 0.1)",
                      color: scorePercent >= 60 ? "#00f5d4" : "#ff6b9d",
                      border: `1px solid ${scorePercent >= 60 ? "rgba(0, 245, 212, 0.25)" : "rgba(255, 107, 157, 0.25)"}`,
                    }}
                  >
                    {scorePercent}% Score
                  </div>
                </motion.div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.id}
                      className="rounded-xl border p-4"
                      style={{
                        background: r.isCorrect
                          ? "rgba(0, 245, 212, 0.03)"
                          : "rgba(255, 107, 157, 0.03)",
                        borderColor: r.isCorrect
                          ? "rgba(0, 245, 212, 0.15)"
                          : "rgba(255, 107, 157, 0.15)",
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {r.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#00f5d4" }} />
                        ) : (
                          <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#ff6b9d" }} />
                        )}
                        <p className="text-sm text-white font-medium">{r.question}</p>
                      </div>
                      <div className="ml-7 space-y-1 text-xs">
                        {!r.isCorrect && (
                          <p className="text-red-400">
                            Your answer: <span className="font-semibold">{r.userAnswer}</span> — {r.options[r.userAnswer as keyof typeof r.options]}
                          </p>
                        )}
                        <p style={{ color: "#00f5d4" }}>
                          Correct: <span className="font-semibold">{r.correctAnswer}</span> — {r.options[r.correctAnswer as keyof typeof r.options]}
                        </p>
                        <p className="text-gray-400 mt-1 italic">{r.explanation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Close button */}
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={onClose}
                    className="bg-[#00f5d4] text-black hover:bg-[#00dbb8] font-medium px-8"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
