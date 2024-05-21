import { useState, useEffect } from "react";
import "./modal.css";

function QuestionModal({
  question,
  options,
  onAnswer,
}: {
  question: { question: string; correctOption: number };
  options: string[];
  onAnswer: (isCorrect: boolean) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const handleTimeout = () => {
      onAnswer(false);
    };

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [setTimeLeft, onAnswer]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption === question.correctOption);
    }
  };

  return (
    <div className="question-modal">
      <div className="modal-content">
        <h3>{question.question}</h3>
        <div className="modal-options">
          <ul>
            {options.map((option, index: number) => (
              <li
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`option ${
                  selectedOption === index ? "selected" : ""
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
          <div className="timer">Kalan Süre: {timeLeft} saniye</div>
          <button onClick={handleSubmit} disabled={selectedOption === null}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionModal;
