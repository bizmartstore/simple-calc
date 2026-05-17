import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Calculator,
  head: () => ({
    meta: [
      { title: "Calculator" },
      { name: "description", content: "A simple, elegant calculator." },
    ],
  }),
});

type Op = "+" | "-" | "×" | "÷";

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [waiting, setWaiting] = useState(false);

  const inputDigit = (d: string) => {
    if (waiting) {
      setDisplay(d);
      setWaiting(false);
    } else {
      setDisplay(display === "0" ? d : display + d);
    }
  };

  const inputDot = () => {
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setWaiting(false);
  };

  const toggleSign = () =>
    setDisplay(display.startsWith("-") ? display.slice(1) : display === "0" ? "0" : "-" + display);

  const percent = () => setDisplay(String(parseFloat(display) / 100));

  const calc = (a: number, b: number, o: Op) =>
    o === "+" ? a + b : o === "-" ? a - b : o === "×" ? a * b : a / b;

  const performOp = (next: Op) => {
    const value = parseFloat(display);
    if (prev === null) {
      setPrev(value);
    } else if (op && !waiting) {
      const result = calc(prev, value, op);
      setPrev(result);
      setDisplay(String(result));
    }
    setOp(next);
    setWaiting(true);
  };

  const equals = () => {
    const value = parseFloat(display);
    if (op && prev !== null) {
      const result = calc(prev, value, op);
      setDisplay(String(result));
      setPrev(null);
      setOp(null);
      setWaiting(true);
    }
  };

  const Btn = ({
    children,
    onClick,
    variant = "default",
    className = "",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "accent" | "muted";
    className?: string;
  }) => (
    <Button
      onClick={onClick}
      className={`h-16 text-xl font-medium rounded-2xl transition-all active:scale-95 ${
        variant === "accent"
          ? "bg-accent-foreground text-background hover:bg-accent-foreground/90"
          : variant === "muted"
            ? "bg-muted text-foreground hover:bg-muted/80"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      } ${className}`}
    >
      {children}
    </Button>
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm p-6 rounded-3xl shadow-2xl border-border/50">
        <h1 className="sr-only">Calculator</h1>
        <div className="bg-muted/40 rounded-2xl p-6 mb-4 text-right">
          <div className="text-sm text-muted-foreground h-5">
            {prev !== null && op ? `${prev} ${op}` : ""}
          </div>
          <div className="text-5xl font-light text-foreground truncate tabling-nums">
            {display}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Btn variant="muted" onClick={clear}>AC</Btn>
          <Btn variant="muted" onClick={toggleSign}>+/−</Btn>
          <Btn variant="muted" onClick={percent}>%</Btn>
          <Btn variant="accent" onClick={() => performOp("÷")}>÷</Btn>

          <Btn onClick={() => inputDigit("7")}>7</Btn>
          <Btn onClick={() => inputDigit("8")}>8</Btn>
          <Btn onClick={() => inputDigit("9")}>9</Btn>
          <Btn variant="accent" onClick={() => performOp("×")}>×</Btn>

          <Btn onClick={() => inputDigit("4")}>4</Btn>
          <Btn onClick={() => inputDigit("5")}>5</Btn>
          <Btn onClick={() => inputDigit("6")}>6</Btn>
          <Btn variant="accent" onClick={() => performOp("-")}>−</Btn>

          <Btn onClick={() => inputDigit("1")}>1</Btn>
          <Btn onClick={() => inputDigit("2")}>2</Btn>
          <Btn onClick={() => inputDigit("3")}>3</Btn>
          <Btn variant="accent" onClick={() => performOp("+")}>+</Btn>

          <Btn onClick={() => inputDigit("0")} className="col-span-2">0</Btn>
          <Btn onClick={inputDot}>.</Btn>
          <Btn variant="accent" onClick={equals}>=</Btn>
        </div>
      </Card>
    </main>
  );
}
