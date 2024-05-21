import "./map.css";
import { useState, useEffect } from "react";
import QuestionModal from "./questionModal";
import questions from "./questionData";
import { Socket } from "socket.io-client";

const regionImages = {
  default: (id: number) => `/images/region${id}-default.png`,
  red: (id: number) => `/images/region${id}-red.png`,
  blue: (id: number) => `/images/region${id}-blue.png`,
};

function Map({
  socket,
  playerInfo,
}: {
  socket: Socket;
  playerInfo: {
    id: string;
    color: string;
    regions: { id: number; color: string }[];
  };
}) {
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionRegionId, setQuestionRegionId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    options: string[];
    correctOption: number;
  } | null>(null);
  const [updatedRegions, setUpdatedRegions] = useState<
    {
      id: number;
      color: string;
    }[]
  >(playerInfo.regions || []);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false); // Sıranın kimde olduğunu tutacak state

  useEffect(() => {
    if (!socket) return;

    socket.on("regionUpdated", (updatedRegion) => {
      setUpdatedRegions((prevRegions) => {
        const index = prevRegions.findIndex(
          (region) => region.id === updatedRegion.id
        );
        if (index !== -1) {
          prevRegions[index] = updatedRegion;
        }
        return [...prevRegions];
      });
    });

    socket.on("playerTurn", (currentTurnPlayerId) => {
      setIsPlayerTurn(playerInfo.id === currentTurnPlayerId); // Sıranın kimde olduğunu kontrol et
    });

    return () => {
      socket.off("regionUpdated");
      socket.off("playerTurn");
    };
  }, [socket, playerInfo]);

  const handleClick = (regionId: number) => {
    if (!isPlayerTurn || showQuestion) return;

    const region = updatedRegions.find((region) => region.id === regionId);

    if (!region || !regionId) return;

    if (region.color === "default" || region.color !== playerInfo.color) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion(randomQuestion);
      setShowQuestion(true);
      setQuestionRegionId(regionId);
    }
  };

  const handleQuestionAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const updatedRegion = { id: questionRegionId, color: playerInfo.color };
      socket.emit("updateRegion", updatedRegion);
      setUpdatedRegions((prevRegions) => {
        const index = prevRegions.findIndex(
          (region) => region.id === updatedRegion.id
        );
        if (index !== -1) {
          prevRegions[index] = {
            ...prevRegions[index],
            color: updatedRegion.color,
          };
        }
        return [...prevRegions];
      });
    }
    setShowQuestion(false);
    setQuestionRegionId(null);
    setCurrentQuestion(null);
  };

  return (
    <div className="game-container">
      {isPlayerTurn ? (
        <div className="turn-indicator">Sıra sende!</div>
      ) : (
        <div className="turn-indicator">Karşı tarafın sırası...</div>
      )}
      <div className="map">
        {updatedRegions.map((region) => (
          <img
            key={region.id}
            src={
              region.color === "default"
                ? regionImages.default(region.id)
                : region.color === "red"
                ? regionImages.red(region.id)
                : regionImages.blue(region.id)
            }
            alt={`Region ${region.id}`}
            onClick={() => handleClick(region.id)}
            className={`region-${region.id}`}
            style={{
              cursor:
                region.color === "default" || region.color !== playerInfo.color
                  ? "pointer"
                  : "not-allowed",
              opacity: region.color === playerInfo.color ? 0.5 : 1,
            }}
          />
        ))}
        {showQuestion && currentQuestion && (
          <QuestionModal
            question={currentQuestion}
            options={currentQuestion.options}
            onAnswer={handleQuestionAnswer}
          />
        )}
      </div>
    </div>
  );
}

export default Map;
