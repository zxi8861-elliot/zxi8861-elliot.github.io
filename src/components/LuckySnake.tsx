import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type Cell = { x: number; y: number };
type Direction = "up" | "right" | "down" | "left";
type GameStatus = "ready" | "playing" | "paused" | "celebrating" | "over";

const columns = 24;
const rows = 16;
const cellSize = 20;
const vectors: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
};
const reverses: Record<Direction, Direction> = {
  up: "down",
  right: "left",
  down: "up",
  left: "right"
};

function randomFood(snake: Cell[]): Cell {
  let food: Cell;
  do {
    food = { x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows) };
  } while (snake.some((cell) => cell.x === food.x && cell.y === food.y));
  return food;
}

const initialSnake = (): Cell[] => [{ x: 6, y: 8 }, { x: 5, y: 8 }, { x: 4, y: 8 }];

export default function LuckySnake() {
  const [snake, setSnake] = useState<Cell[]>(initialSnake);
  const [food, setFood] = useState<Cell>({ x: 16, y: 8 });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [burst, setBurst] = useState<Cell | null>(null);
  const snakeRef = useRef(snake);
  const directionRef = useRef<Direction>("right");
  const queuedDirectionRef = useRef<Direction>("right");
  const foodRef = useRef(food);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => {
      const current = snakeRef.current;
      directionRef.current = queuedDirectionRef.current;
      const vector = vectors[directionRef.current];
      const head = { x: current[0].x + vector.x, y: current[0].y + vector.y };
      const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;
      const bodyToCheck = ate ? current : current.slice(0, -1);
      const hitWall = head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
      const hitSelf = bodyToCheck.some((cell) => cell.x === head.x && cell.y === head.y);

      if (hitWall || hitSelf) {
        setBurst(head);
        setStatus("celebrating");
        return;
      }

      const nextSnake = [head, ...current];
      if (ate) {
        setScore((value) => value + 1);
        const nextFood = randomFood(nextSnake);
        foodRef.current = nextFood;
        setFood(nextFood);
      } else {
        nextSnake.pop();
      }
      snakeRef.current = nextSnake;
      setSnake(nextSnake);
    }, 145);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "celebrating") return;
    const timer = window.setTimeout(() => setStatus("over"), 1350);
    return () => window.clearTimeout(timer);
  }, [status]);

  const setDirection = (next: Direction) => {
    if (status !== "playing" || reverses[directionRef.current] === next) return;
    queuedDirectionRef.current = next;
  };

  const start = () => {
    const nextSnake = initialSnake();
    snakeRef.current = nextSnake;
    setSnake(nextSnake);
    setScore(0);
    directionRef.current = "right";
    queuedDirectionRef.current = "right";
    setBurst(null);
    const nextFood = { x: 16, y: 8 };
    foodRef.current = nextFood;
    setFood(nextFood);
    setStatus("playing");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: "up", w: "up", W: "up",
      ArrowRight: "right", d: "right", D: "right",
      ArrowDown: "down", s: "down", S: "down",
      ArrowLeft: "left", a: "left", A: "left"
    };
    const next = keyMap[event.key];
    if (next) {
      event.preventDefault();
      setDirection(next);
    }
    if (event.code === "Space") {
      event.preventDefault();
      if (status === "ready" || status === "over") start();
      else if (status !== "celebrating") setStatus((value) => value === "playing" ? "paused" : "playing");
    }
  };

  const directionButtons: { direction: Direction; label: string; symbol: string }[] = [
    { direction: "up", label: "向上", symbol: "↑" },
    { direction: "left", label: "向左", symbol: "←" },
    { direction: "down", label: "向下", symbol: "↓" },
    { direction: "right", label: "向右", symbol: "→" }
  ];

  return (
    <section className="lucky-snake" tabIndex={0} onKeyDown={handleKeyDown} aria-label="好运贪吃蛇小游戏">
      <div className="lucky-snake-heading">
        <span className="eyebrow">A LITTLE LUCKY BREAK</span>
        <h2>接住今天的好运。</h2>
        <p>吃掉笑脸，收集一点好运。别撞到墙或自己。</p>
      </div>

      <div className="snake-score-row">
        <span>好运值 <strong aria-live="polite">{String(score).padStart(2, "0")}</strong></span>
        <span className={`snake-status snake-status--${status}`}>
          {status === "ready" ? "准备开始" : status === "playing" ? "游戏中" : status === "paused" ? "已暂停" : "本局结束"}
        </span>
      </div>

      <div className="snake-board-wrap">
        <svg
          className="snake-board"
          viewBox={`0 0 ${columns * cellSize} ${rows * cellSize}`}
          role="img"
          aria-label={`贪吃蛇棋盘，好运值 ${score}`}
        >
          <defs>
            <pattern id="snake-grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
              <path d={`M ${cellSize} 0 H 0 V ${cellSize}`} fill="none" className="snake-grid-line" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#snake-grid)" />
          <text
            x={(food.x + 0.5) * cellSize}
            y={(food.y + 0.7) * cellSize}
            textAnchor="middle"
            className="snake-food"
          >☺</text>
          {snake.map((cell, index) => (
            <rect
              key={`${cell.x}-${cell.y}`}
              x={cell.x * cellSize + 2}
              y={cell.y * cellSize + 2}
              width={cellSize - 4}
              height={cellSize - 4}
              rx={index === 0 ? 5 : 3}
              className={index === 0 ? "snake-segment snake-head" : "snake-segment"}
            />
          ))}
          {status === "paused" || status === "celebrating" || status === "over" ? (
            <g className={`snake-overlay snake-overlay--${status}`}>
              <rect x="0" y="0" width={columns * cellSize} height={rows * cellSize} />
              {status === "celebrating" && burst ? (
                <g className="snake-burst" transform={`translate(${(burst.x + 0.5) * cellSize} ${(burst.y + 0.5) * cellSize})`}>
                  <circle r="5" />
                  <path d="M0-9V-24 M0 9V24 M-9 0H-24 M9 0H24 M-7-7L-18-18 M7-7L18-18 M-7 7L-18 18 M7 7L18 18" />
                </g>
              ) : null}
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                {status === "paused" ? "PAUSED" : status === "celebrating" ? "OOPS!" : "HAVE A GOOD DAY"}
              </text>
              {status === "over" ? <text className="snake-overlay-subtitle" x="50%" y="59%" textAnchor="middle">今天也有好运，明天继续。</text> : null}
            </g>
          ) : null}
        </svg>
      </div>

      <div className="snake-controls-row">
        <div className="snake-control-copy">
          {status === "ready"
            ? <>开始：点击「开始游戏」或在此按空格<br />移动：方向键 / WASD · 吃到笑脸会长一格</>
            : "方向键 / WASD 移动 · 空格暂停"}
        </div>
        <div className="snake-dpad" aria-label="触屏方向控制">
          {directionButtons.map(({ direction, label, symbol }) => (
            <button
              key={direction}
              type="button"
              className="snake-direction cursor-target"
              aria-label={label}
              onClick={() => setDirection(direction)}
            >{symbol}</button>
          ))}
        </div>
      </div>

      <div className="snake-actions">
        {status === "ready" ? (
          <button type="button" className="snake-start cursor-target" onClick={start}>
            开始游戏<span aria-hidden="true">↗</span>
          </button>
        ) : status === "over" ? (
          <button type="button" className="snake-start cursor-target" onClick={start}>
            再来一次<span aria-hidden="true">↗</span>
          </button>
        ) : status === "celebrating" ? (
          <span className="snake-celebrating-label">好运正在爆开…</span>
        ) : (
          <button
            type="button"
            className="snake-start cursor-target"
            onClick={() => setStatus(status === "playing" ? "paused" : "playing")}
          >{status === "playing" ? "暂停一下" : "继续游戏"}<span aria-hidden="true">{status === "playing" ? "Ⅱ" : "▶"}</span></button>
        )}
        <span className="snake-footnote">每吃到一个笑脸，身体长一格 · 好运值 +1</span>
      </div>
    </section>
  );
}
