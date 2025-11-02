import { useState, useEffect } from 'react';
import { Sun, Moon, History, X } from 'lucide-react';

type Mode = 'standard' | 'scientific' | 'programmer' | 'date';
type AngleMode = 'deg' | 'rad';
type NumberBase = 'BIN' | 'OCT' | 'DEC' | 'HEX';

interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

export default function Calculator() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mode, setMode] = useState<Mode>('standard');
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [numberBase, setNumberBase] = useState<NumberBase>('DEC');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('calc-theme');
    if (saved) setTheme(saved as 'light' | 'dark');

    const savedHistory = localStorage.getItem('calc-history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('calc-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addToHistory = (expr: string, res: string) => {
    const newEntry = { expression: expr, result: res, timestamp: Date.now() };
    setHistory(prev => [newEntry, ...prev].slice(0, 10));
  };

  const handleNumber = (num: string) => {
    if (mode === 'programmer') {
      const valid = isValidForBase(num, numberBase);
      if (!valid) return;
    }
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setExpression(prev => prev + display + op);
    setDisplay('0');
  };

  const isValidForBase = (char: string, base: NumberBase): boolean => {
    const upper = char.toUpperCase();
    if (base === 'BIN') return /^[01]$/.test(upper);
    if (base === 'OCT') return /^[0-7]$/.test(upper);
    if (base === 'DEC') return /^[0-9]$/.test(upper);
    if (base === 'HEX') return /^[0-9A-F]$/.test(upper);
    return false;
  };

  const convertBase = (value: string, from: NumberBase, to: NumberBase): string => {
    if (!value || value === '0') return '0';
    let decimal: number;

    switch (from) {
      case 'BIN': decimal = parseInt(value, 2); break;
      case 'OCT': decimal = parseInt(value, 8); break;
      case 'DEC': decimal = parseInt(value, 10); break;
      case 'HEX': decimal = parseInt(value, 16); break;
      default: decimal = 0;
    }

    if (isNaN(decimal)) return '0';

    switch (to) {
      case 'BIN': return decimal.toString(2);
      case 'OCT': return decimal.toString(8);
      case 'DEC': return decimal.toString(10);
      case 'HEX': return decimal.toString(16).toUpperCase();
      default: return '0';
    }
  };

  const safeEvaluate = (expr: string): number => {
    try {
      const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
      return Function('"use strict"; return (' + sanitized + ')')();
    } catch {
      throw new Error('Invalid expression');
    }
  };

  const handleEquals = () => {
    try {
      const fullExpr = expression + display;
      let result: number;

      if (mode === 'programmer') {
        const decimalValue = parseInt(display, getBaseRadix(numberBase));
        result = decimalValue;
      } else {
        result = safeEvaluate(fullExpr);
      }

      const resultStr = result.toString();
      addToHistory(fullExpr, resultStr);
      setDisplay(resultStr);
      setExpression('');
    } catch {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1000);
    }
  };

  const getBaseRadix = (base: NumberBase): number => {
    switch (base) {
      case 'BIN': return 2;
      case 'OCT': return 8;
      case 'DEC': return 10;
      case 'HEX': return 16;
    }
  };

  const handleScientific = (func: string) => {
    try {
      const val = parseFloat(display);
      let result: number;

      switch (func) {
        case 'sin':
          result = angleMode === 'deg' ? Math.sin(val * Math.PI / 180) : Math.sin(val);
          break;
        case 'cos':
          result = angleMode === 'deg' ? Math.cos(val * Math.PI / 180) : Math.cos(val);
          break;
        case 'tan':
          result = angleMode === 'deg' ? Math.tan(val * Math.PI / 180) : Math.tan(val);
          break;
        case 'log':
          result = Math.log10(val);
          break;
        case 'ln':
          result = Math.log(val);
          break;
        case 'sqrt':
          result = Math.sqrt(val);
          break;
        case 'x²':
          result = val * val;
          break;
        case 'exp':
          result = Math.exp(val);
          break;
        case 'fact':
          result = factorial(Math.floor(val));
          break;
        default:
          result = val;
      }

      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1000);
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || n > 170) throw new Error('Out of range');
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const handleBitwise = (op: string) => {
    try {
      const val = parseInt(display, getBaseRadix(numberBase));
      let result: number;

      switch (op) {
        case 'NOT':
          result = ~val;
          break;
        case 'LSHIFT':
          result = val << 1;
          break;
        case 'RSHIFT':
          result = val >> 1;
          break;
        default:
          return;
      }

      setDisplay(convertBase(result.toString(), 'DEC', numberBase));
    } catch {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1000);
    }
  };

  const calculateDateDifference = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.abs(end.getTime() - start.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    setDisplay(`${days}d | ${months}m | ${years}y`);
  };

  const calculateAge = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setDisplay(`${years}y ${months}m ${days}d`);
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0b272a] via-[#244747] to-[#0b272a]'
        : 'bg-gradient-to-br from-[#dad7c5] via-[#f5f3eb] to-[#dad7c5]'
    } flex items-center justify-center p-4`}>
      <div className={`w-full max-w-md transition-all duration-300 rounded-3xl p-6 ${
        theme === 'dark'
          ? 'bg-[#244747] shadow-[0_8px_32px_rgba(11,39,42,0.5)]'
          : 'bg-white shadow-[0_8px_32px_rgba(123,156,146,0.2)]'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-semibold ${
            theme === 'dark' ? 'text-[#7b9c92]' : 'text-[#244747]'
          }`}>
            TechSolve
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`btn-3d p-3 rounded-xl ${
                theme === 'dark' ? 'bg-[#4e706b]' : 'bg-[#7b9c92]'
              }`}
            >
              {showHistory ? <X size={20} /> : <History size={20} />}
            </button>

            <button
              onClick={toggleTheme}
              className={`btn-3d relative w-16 h-8 rounded-full transition-all duration-300 ${
                theme === 'dark' ? 'bg-[#4e706b]' : 'bg-[#7b9c92]'
              }`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-[#dad7c5] transition-transform duration-300 flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-0' : 'translate-x-8'
              }`}>
                {theme === 'dark' ? <Moon size={14} className="text-[#244747]" /> : <Sun size={14} className="text-[#244747]" />}
              </div>
            </button>
          </div>
        </div>

        {showHistory && (
          <div className={`mb-4 p-4 rounded-2xl max-h-48 overflow-y-auto ${
            theme === 'dark' ? 'bg-[#0b272a]' : 'bg-[#f5f3eb]'
          }`}>
            {history.length === 0 ? (
              <p className={`text-sm ${theme === 'dark' ? 'text-[#7b9c92]' : 'text-[#4e706b]'}`}>No history yet</p>
            ) : (
              history.map((entry, idx) => (
                <div key={idx} className={`text-sm mb-2 ${theme === 'dark' ? 'text-[#dad7c5]' : 'text-[#244747]'}`}>
                  <div>{entry.expression} = {entry.result}</div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex gap-2 mb-4 relative">
          {(['standard', 'scientific', 'programmer', 'date'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setDisplay('0');
                setExpression('');
              }}
              className={`flex-1 py-2 text-sm font-medium transition-all duration-200 relative ${
                mode === m
                  ? theme === 'dark' ? 'text-[#dad7c5]' : 'text-[#244747]'
                  : theme === 'dark' ? 'text-[#7b9c92]' : 'text-[#4e706b]'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
              {mode === m && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                  theme === 'dark' ? 'bg-[#7b9c92]' : 'bg-[#244747]'
                }`} />
              )}
            </button>
          ))}
        </div>

        <div className={`p-6 rounded-2xl mb-4 ${
          theme === 'dark'
            ? 'bg-[#0b272a] shadow-inner'
            : 'bg-[#f5f3eb] shadow-inner'
        }`}>
          {expression && (
            <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-[#7b9c92]' : 'text-[#4e706b]'}`}>
              {expression}
            </div>
          )}
          <div className={`text-3xl font-light text-right ${
            theme === 'dark' ? 'text-[#dad7c5]' : 'text-[#244747]'
          }`}>
            {display}
          </div>
        </div>

        {mode === 'standard' && (
          <div className="grid grid-cols-4 gap-3">
            {['C', '←', '%', '/'].map(btn => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') handleClear();
                  else if (btn === '←') handleBackspace();
                  else handleOperator(btn);
                }}
                className={`btn-3d py-4 rounded-xl font-medium ${
                  theme === 'dark' ? 'bg-[#4e706b] text-[#dad7c5]' : 'bg-[#7b9c92] text-white'
                }`}
              >
                {btn}
              </button>
            ))}
            {['7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+'].map(btn => (
              <button
                key={btn}
                onClick={() => /[0-9]/.test(btn) ? handleNumber(btn) : handleOperator(btn)}
                className={`btn-3d py-4 rounded-xl font-medium ${
                  /[0-9]/.test(btn)
                    ? theme === 'dark' ? 'bg-[#244747] text-[#dad7c5]' : 'bg-white text-[#244747]'
                    : theme === 'dark' ? 'bg-[#4e706b] text-[#dad7c5]' : 'bg-[#7b9c92] text-white'
                }`}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => handleNumber('0')}
              className={`btn-3d py-4 rounded-xl font-medium col-span-2 ${
                theme === 'dark' ? 'bg-[#244747] text-[#dad7c5]' : 'bg-white text-[#244747]'
              }`}
            >
              0
            </button>
            <button
              onClick={() => handleNumber('.')}
              className={`btn-3d py-4 rounded-xl font-medium ${
                theme === 'dark' ? 'bg-[#244747] text-[#dad7c5]' : 'bg-white text-[#244747]'
              }`}
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className={`btn-3d py-4 rounded-xl font-medium ${
                theme === 'dark' ? 'bg-[#7b9c92] text-[#0b272a]' : 'bg-[#244747] text-[#dad7c5]'
              }`}
            >
              =
            </button>
          </div>
        )}

        {mode === 'scientific' && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
                className={`btn-3d px-4 py-2 rounded-xl text-sm ${
                  theme === 'dark' ? 'bg-[#4e706b] text-[#dad7c5]' : 'bg-[#7b9c92] text-white'
                }`}
              >
                {angleMode.toUpperCase()}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'x²', 'exp', 'fact', '(', ')', '/'].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'x²', 'exp', 'fact'].includes(btn)) {
                      handleScientific(btn);
                    } else if (['(', ')'].includes(btn)) {
                      setDisplay(prev => prev + btn);
                    } else {
                      handleOperator(btn);
                    }
                  }}
                  className={`btn-3d py-3 rounded-xl text-sm font-medium ${
                    theme === 'dark' ? 'bg-[#4e706b] text-[#dad7c5]' : 'bg-[#7b9c92] text-white'
                  }`}
                >
                  {btn}
                </button>
              ))}
              {['7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'C', '='].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    if (/[0-9.]/.test(btn)) handleNumber(btn);
                    else if (btn === 'C') handleClear();
                    else if (btn === '=') handleEquals();
                    else handleOperator(btn);
                  }}
                  className={`btn-3d py-3 rounded-xl text-sm font-medium ${
                    /[0-9.]/.test(btn)
                      ? theme === 'dark' ? 'bg-[#244747] text-[#dad7c5]' : 'bg-white text-[#244747]'
                      : btn === '='
                      ? theme === 'dark' ? 'bg-[#7b9c92] text-[#0b272a]' : 'bg-[#244747] text-[#dad7c5]'
                      : theme === 'dark' ? 'bg-[#4e706b] text-[#dad7c5]' : 'bg-[#7b9c92] text-white'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'programmer' && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-2">
              {(['BIN', 'OCT', 'DEC', 'HEX'] as NumberBase[]).map(base => (
                <button
                  key={base}
                  onClick={() => {
                    const converted = convertBase(display, numberBase, base);
                    setNumberBase(base);
                    setDisplay(converted);
                  }}
                  className={`btn-3d flex-1 py-2 rounded-xl text-sm ${
                    numberBase === base
                      ? theme === 'dark' ? 'bg-[#7b9c92] text-[#0b272a]' : 'bg-[#244747] text-[#dad7c5]'
                      : theme === 'dark' ? 'bg-[#4e706b] text-[#dad7c5]' : 'bg-[#7b9c92] text-white'
                  }`}
                >
                  {base}
                </button>
              ))}
            </div>
            <div className={`p-3 rounded-xl text-xs ${
              theme === 'dark' ? 'bg-[#0b272a] text-[#7b9c92]' : 'bg-[#f5f3eb] text-[#4e706b]'
            }`}>
              BIN: {convertBase(display, numberBase, 'BIN')}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['AND', 'OR', 'XOR', 'NOT', 'LSHIFT', 'RSHIFT', 'C', '←'].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') handleClear();
                    else if (btn === '←') handleBackspace();
                    else handleBitwise(btn);
                  }}
                  className={`btn-3d py-3 rounded-xl text-xs font-medium ${
                    theme === 'dark' ? 'bg-[#4e706b] text-[#dad7c5]' : 'bg-[#7b9c92] text-white'
                  }`}
                >
                  {btn}
                </button>
              ))}
              {(numberBase === 'HEX' ? ['A', 'B', 'C', 'D', 'E', 'F'] : []).map(hex => (
                <button
                  key={hex}
                  onClick={() => handleNumber(hex)}
                  className={`btn-3d py-3 rounded-xl font-medium ${
                    theme === 'dark' ? 'bg-[#244747] text-[#dad7c5]' : 'bg-white text-[#244747]'
                  }`}
                >
                  {hex}
                </button>
              ))}
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleNumber(btn)}
                  className={`btn-3d py-3 rounded-xl font-medium ${
                    theme === 'dark' ? 'bg-[#244747] text-[#dad7c5]' : 'bg-white text-[#244747]'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'date' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-[#7b9c92]' : 'text-[#4e706b]'}`}>
                Date Difference
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full p-3 rounded-xl mb-2 ${
                  theme === 'dark' ? 'bg-[#0b272a] text-[#dad7c5]' : 'bg-[#f5f3eb] text-[#244747]'
                }`}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full p-3 rounded-xl mb-2 ${
                  theme === 'dark' ? 'bg-[#0b272a] text-[#dad7c5]' : 'bg-[#f5f3eb] text-[#244747]'
                }`}
              />
              <button
                onClick={calculateDateDifference}
                className={`btn-3d w-full py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-[#7b9c92] text-[#0b272a]' : 'bg-[#244747] text-[#dad7c5]'
                }`}
              >
                Calculate Difference
              </button>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-[#7b9c92]' : 'text-[#4e706b]'}`}>
                Age Calculator
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={`w-full p-3 rounded-xl mb-2 ${
                  theme === 'dark' ? 'bg-[#0b272a] text-[#dad7c5]' : 'bg-[#f5f3eb] text-[#244747]'
                }`}
              />
              <button
                onClick={calculateAge}
                className={`btn-3d w-full py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-[#7b9c92] text-[#0b272a]' : 'bg-[#244747] text-[#dadcd5]'
                }`}
              >
                Calculate Age
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}