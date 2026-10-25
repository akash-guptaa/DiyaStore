'use client';
import { useState, useRef, useEffect } from 'react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  isDestructive?: boolean;
}

export default function PinModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Security PIN Required',
  description = 'Please enter your 4-digit administrator PIN to perform this action.',
  confirmButtonText = 'Verify & Confirm',
  isDestructive = true,
}: PinModalProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError(null);
      setVerifying(false);
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(null);

    // Auto-advance to next box
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const digits = pasteData.split('');
      const newPin = [...pin];
      digits.forEach((d, i) => {
        if (i < 4) newPin[i] = d;
      });
      setPin(newPin);
      const nextIndex = Math.min(digits.length, 3);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      setError('Please enter all 4 digits of your PIN.');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVerifying(false);
        onClose();
        await onSuccess();
      } else {
        setVerifying(false);
        setError(data.error || 'Incorrect PIN. Current default is 1234.');
        setPin(['', '', '', '']);
        inputsRef.current[0]?.focus();
      }
    } catch (err) {
      setVerifying(false);
      setError('Verification failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-stone-200 text-center">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center text-xl mb-3 ${
          isDestructive ? 'bg-red-50 text-red-600' : 'bg-rose-50 text-rose-800'
        }`}>
          {isDestructive ? '🗑️' : '🔒'}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-stone-900 mb-1">{title}</h3>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">{description}</p>

        {/* PIN Inputs */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={pin[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border transition-all outline-none font-mono ${
                  error
                    ? 'border-red-400 bg-red-50/50 text-red-700'
                    : 'border-stone-300 bg-stone-50 focus:bg-white focus:border-rose-800 focus:ring-2 focus:ring-rose-800/20 text-stone-900'
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs font-semibold text-red-600 bg-red-50 py-1.5 px-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="text-[11px] text-stone-400">
            Default PIN: <span className="font-mono font-semibold text-stone-600">1234</span> (configurable in Settings)
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={verifying}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={verifying || pin.join('').length < 4}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-all shadow-sm disabled:opacity-50 ${
                isDestructive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-rose-800 hover:bg-rose-900'
              }`}
            >
              {verifying ? 'Checking...' : confirmButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
