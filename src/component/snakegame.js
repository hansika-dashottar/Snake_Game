import { useEffect, useRef, useState } from "react";
import './snakegame.css';

const GRID_SIZE = 15;
const GAMEGRID = Array.from({ length: GRID_SIZE }, () =>
    new Array(GRID_SIZE).fill("")
);
const INITIAL_SNAKE = [[5, 5]];

const generateFood = (snakeBody) => {
    let newFood;
    do{
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    newFood = [x, y];
    } while(
        snakeBody.some(([snakeX, snakeY]) => snakeX === newFood[0] && snakeY === newFood[1])
    );
    return newFood;
};

export default function SnakeGame() {
    const [snakeBody, setSnakeBody] = useState(INITIAL_SNAKE);
    const [score, setscore] = useState(0)
    const [isGameOver, setIsGameOver] = useState(false);
    const directionRef = useRef([1, 0]);
    const [foodRef, setFood] = useState(generateFood(INITIAL_SNAKE));

    const isSnakeBodyDiv = (xc, yc) => {
        return snakeBody.some(([x, y]) => {
            return x === xc && y === yc;
        });
    };

    useEffect(() => {
        if (isGameOver) return;

        const intervalId = setInterval(() => {
            setSnakeBody((prevSnakeBody) => {
                const newHead = [
                    prevSnakeBody[0][0] + directionRef.current[0],
                    prevSnakeBody[0][1] + directionRef.current[1],
                ];

                if (
                    newHead[0] < 0 ||
                    newHead[0] >= GRID_SIZE ||
                    newHead[1] < 0 ||
                    newHead[1] >= GRID_SIZE ||
                    prevSnakeBody.some(([x, y]) => {
                        return newHead[0] === x && newHead[1] ===y;
                    })
                ) {
                    directionRef.current = [1, 0];
                    setscore(0);
                    setIsGameOver(true);
                    setFood(generateFood(INITIAL_SNAKE));
                    return INITIAL_SNAKE;
                }
                const copySnakeBody = [...prevSnakeBody];
                if(
                    newHead[0] === foodRef[0] && newHead[1] === foodRef[1]
                ) {
                    setFood(generateFood(copySnakeBody));
                    setscore( score + 1);
                } else {
                    copySnakeBody.pop();
                }

                copySnakeBody.unshift(newHead);
                return copySnakeBody;
            });
        }, 300);

        const handleDirection = (e) => {
            const key = e.key;
            console.log(key);
            if(key === "ArrowUp" && directionRef.current[1] !== 1) {
                directionRef.current = [0, -1];
            } else if (key === "ArrowLeft" && directionRef.current[0] !== 1) {
                directionRef.current = [-1, 0];
            } else if (key === "ArrowRight" && directionRef.current[0] !== -1) {
                directionRef.current = [1, 0];
            } else if (key === "ArrowDown" && directionRef.current[1] !== -1) {
                directionRef.current = [0, 1];
            }
        };

        window.addEventListener("keydown", handleDirection);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleDirection);
        };
    }, [foodRef, isGameOver]);

    return (
        <>
        <div className="title">Snake Game</div>
        <div className="subtitle">Use arrow keys to control the snake</div>
        <div className="container">
            {isGameOver ? (
                <div className="game-over">
                    <h1>Game Over</h1>
                    <button onClick={() => window.location.reload()}>Restart</button>
                </div>
            ) : (
            GAMEGRID.map((row, yc) => {
                return row.map((cell, xc) => {
                    const isSnakeHead = snakeBody[0][0] === xc && snakeBody[0][1] === yc;
                    const isSnakeBody = snakeBody.some(([x,y]) => x === xc && y === yc);
                    return (
                        <div
                          key={`${xc}-${yc}`}
                          className={ `cell 
                            ${isSnakeHead ? "snake-head" : ""}
                            ${isSnakeBody && !isSnakeHead ? "snake" : ""} 
                            ${
                                foodRef[0] === xc && foodRef[1] === yc
                            ? "food"
                            : ""
                        }`}
                        ></div>
                    );
                });
            })
        )}
        </div>
        <div className="score-board">
            <h1>Score:{score}</h1>
        </div>
        </>
    );
}
