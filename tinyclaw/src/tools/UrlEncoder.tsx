"use client";

import { useState, useMemo, useCallback } from 'react';

export default function UrlEncoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('https://example.com/search?q=React Hooks & State');
  const [error, setError] = useState<string>('');
  const [copyText, setCopyText] = useState<string>('Copy');

  const output = useMemo(() => {
    setError('');
    if (!input) {
      return '';
    }
    try {
      if (mode === 'encode') {
        return encodeURIComponent(input);
      } else {
        return decodeURIComponent(input);
      }
    } catch (e) {
      if (e instanceof URIError) {
        setError('Invalid URI sequence. Please check the input text.');
      } else {
        setError('An unexpected error occurred during processing.');
      }
      return '';
    }
  }, [input, mode]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  }, []);

  const toggleMode = useCallback(() => {
    setInput(output);
    setMode(prevMode => (prevMode === 'encode' ? 'decode' : 'encode'));
  }, [output]);

  const handleCopy = useCallback(() => {
    if (!output || copyText === 'Copied!') return;
    navigator.clipboard.writeText(output).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [output, copyText]);

  const inputLabel = mode === 'encode' ? 'Decoded' : 'Encoded';
  const outputLabel = mode === 'encode' ? 'Encoded' : 'Decoded';

  return (
    <div className="tool-stack">
      <div className="tool-toggle-row">
        <button
          onClick={toggleMode}
          className="tool-toggle tool-btn-secondary"
          aria-label={`Switch to ${mode === 'encode' ? 'decode' : 'encode'} mode`}
        >
          {`Current mode: ${mode}. Switch to ${mode === 'encode' ? 'decode' : 'encode'}.`}
        </button>
      </div>

      <div className="tool-split">
        <div className="tool-stack">
          <label htmlFor="url-input">{inputLabel}</label>
          <textarea
            id="url-input"
            className="tool-textarea tool-mono"
            value={input}
            onChange={handleInputChange}
            placeholder={`Enter text to ${mode}...`}
            rows={10}
            spellCheck="false"
          />
        </div>

        <div className="tool-stack">
          <div className="tool-btn-row">
            <label htmlFor="url-output">{outputLabel}</label>
            <button
              className="tool-copy-btn tool-btn-secondary"
              onClick={handleCopy}
              disabled={!output}
            >
              {copyText}
            </button>
          </div>
          <div className="tool-output">
            <pre id="url-output" className="tool-output-pre tool-mono">
              {output}
            </pre>
          </div>
          {error && <div className="tool-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}