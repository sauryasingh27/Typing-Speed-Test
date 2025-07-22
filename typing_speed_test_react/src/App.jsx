import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const TIME_LIMIT = 60;
const quotes_array = [
  "Push yourself, because no one else is going to do it for you.",
  "Failure is the condiment that gives success its flavor.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It's going to be hard, but hard does not mean impossible.",
  "Learning never exhausts the mind.",
  "The only way to do great work is to love what you do."
];

const App = () => {
  const [quote, setQuote] = useState('Click on the area below to start the game.');
  const [quoteNo, setQuoteNo] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [characterTyped, setCharacterTyped] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const timerRef = useRef(null);
  const quoteRef = useRef(null);

  const updateQuote = () => {
    const current = quotes_array[quoteNo];
    setQuote(current);
    setInput('');
    setQuoteNo((quoteNo + 1) % quotes_array.length);
  };

  const startGame = () => {
    resetValues();
    updateQuote();
    setGameStarted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 1) {
          setTimeElapsed(t => t + 1);
          return prev - 1;
        } else {
          finishGame();
          return 0;
        }
      });
    }, 1000);
  };

  const resetValues = () => {
    setTimeLeft(TIME_LIMIT);
    setTimeElapsed(0);
    setErrors(0);
    setTotalErrors(0);
    setAccuracy(100);
    setCharacterTyped(0);
    setQuoteNo(0);
    setCpm(0);
    setWpm(0);
    setGameStarted(false);
    setInput('');
    setQuote('Click on the area below to start the game.');
  };

  const finishGame = () => {
    clearInterval(timerRef.current);
    setGameStarted(false);
    setInput('');
    setCpm(Math.round((characterTyped / timeElapsed) * 60));
    setWpm(Math.round(((characterTyped / 5) / timeElapsed) * 60));
  };

  useEffect(() => {
    if (!gameStarted || !quoteRef.current) return;

    const quoteSpanArray = Array.from(quoteRef.current.childNodes);
    const inputArray = input.split('');

    let err = 0;
    quoteSpanArray.forEach((char, i) => {
      const typedChar = inputArray[i];

      if (!typedChar) {
        char.className = '';
      } else if (typedChar === char.innerText) {
        char.className = 'correct_char';
      } else {
        char.className = 'incorrect_char';
        err++;
      }
    });

    setErrors(err);
    setTotalErrors(prev => prev + (input.length === quote.length ? err : 0));

    const correctCharacters = characterTyped - (totalErrors + err);
    setAccuracy(Math.round((correctCharacters / characterTyped) * 100));

    if (input.length === quote.length) {
      updateQuote();
    }
  }, [input]);

  const handleInput = (e) => {
    setInput(e.target.value);
    setCharacterTyped(prev => prev + 1);
  };

  return (
    <div className="container">
      <div className="heading">Typing Speed Game</div>

      <div className="header">
        <div className="wpm">
          <div className="header_text">WPM</div>
          <div className="curr_wpm">{wpm}</div>
        </div>
        <div className="cpm">
          <div className="header_text">CPM</div>
          <div className="curr_cpm">{cpm}</div>
        </div>
        <div className="errors">
          <div className="header_text">Errors</div>
          <div className="curr_errors">{totalErrors + errors}</div>
        </div>
        <div className="timer">
          <div className="header_text">Time</div>
          <div className="curr_time">{timeLeft}s</div>
        </div>
        <div className="accuracy">
          <div className="header_text">% Accuracy</div>
          <div className="curr_accuracy">{accuracy}</div>
        </div>
      </div>

      <div className="quote" ref={quoteRef}>
        {gameStarted ? quote.split('').map((char, idx) => <span key={idx}>{char}</span>) : quote}
      </div>

      <textarea
        className="input_area"
        placeholder="start typing here..."
        value={input}
        onChange={handleInput}
        onFocus={startGame}
        disabled={!gameStarted && timeLeft !== TIME_LIMIT}
      ></textarea>

      {!gameStarted && timeLeft !== TIME_LIMIT && (
        <button className="restart_btn" onClick={startGame}>Restart</button>
      )}
    </div>
  );
};

export default App;
