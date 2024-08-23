import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import React, { useEffect, useRef, useState } from 'react';
import ScoreBoard from './ScoreBoard';

gsap.registerPlugin(Draggable);

const Game = () => {
    const ballRef = useRef(null);
    const baseRef = useRef(null);
    const [point, setPoint] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (gameStarted && ballRef.current) {
            Draggable.create(ballRef.current, {
                bounds: ".game-container",
                onPress: () => {
                    const ball = ballRef.current.getBoundingClientRect();
                    startPos.current = { x: ball.left, y: ball.top };
                    gsap.to(ballRef.current, { scale: 1.1 });
                },
                onDragEnd: handleThrow,
                onDrag: () => {
                    const ball = ballRef.current.getBoundingClientRect();
                    velocity.current = {
                        x: startPos.current.x - ball.left,
                        y: startPos.current.y - ball.top
                    };
                },
                onRelease: () => gsap.to(ballRef.current, { scale: 1 })
            });
        }
    }, [gameStarted]);

    const handleThrow = () => {
        const inVelocX = velocity.current.x * 2;
        const inVelocY = velocity.current.y * 2;
        const throwTimeX = Math.abs(inVelocX) / 400;
        const throwTimeY = Math.abs(inVelocY) / 400;
        const gravity = 1000;

        gsap.to(ballRef.current, {
            duration: throwTimeX,
            x: `+=${inVelocX}`,
            ease: "power1.inOut"
        });

        gsap.to(ballRef.current, {
            duration: throwTimeY,
            y: `+=${inVelocY}`,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(ballRef.current, {
                    duration: 1.5,
                    y: `+=${gravity}`,
                    ease: "power2.in",
                    onComplete: () => {
                        checkScore();
                        gsap.set(ballRef.current, { x: 0, y: 0 });
                    }
                });
            }
        });
    };

    const checkScore = () => {
        const ballRect = ballRef.current.getBoundingClientRect();
        const baseRect = baseRef.current.getBoundingClientRect();
        console.log(ballRect.left < ballRect.right && ballRect.right > baseRect.left && ballRect.bottom >= baseRect.top , ballRect.top <= baseRect.bottom);
        

        if (
            ballRect.left < baseRect.right &&
            ballRect.right > baseRect.left &&
            ballRect.bottom >= baseRect.top &&
            ballRect.top <= baseRect.bottom
        ) {
            setPoint(prevPoints => prevPoints + 1);
        } else {
            console.log('No goal');
        }
    };

    const startGame = () => {
        setGameStarted(true);
        gsap.to(ballRef.current, { autoAlpha: 1, duration: 0.5 });
        gsap.to(baseRef.current, { autoAlpha: 1, duration: 0.5 });
    };

    return (
        <div className="game-container">
            <ScoreBoard point={point} />
            {!gameStarted && (
                <button className="start-button" onClick={startGame}>
                    Start Game
                </button>
            )}
            <div className="base" ref={baseRef} style={{ visibility: gameStarted ? 'visible' : 'hidden' }}>
                <img src="/bask.png" alt="bask" />
            </div>
            <div className="ball" ref={ballRef} style={{ visibility: gameStarted ? 'visible' : 'hidden' }}>
                <img src="/ball.png" alt="ball" />
            </div>
        </div>
    );
};

export default Game;
