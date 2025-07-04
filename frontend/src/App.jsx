import { useEffect, useState } from 'react';
import { Sun, Moon, Loader2 } from 'lucide-react';
import './App.css'
import "prismjs/themes/prism-okaidia.css";
import Editor from 'react-simple-code-editor';
import axios from 'axios';
import prism from "prismjs";
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/atom-one-dark.css";

function App() {
  const [code, setcode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Word & Character Counter</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    textarea { width: 100%; height: 150px; }
    .count-box { margin-top: 10px; font-size: 18px; }
  </style>
</head>
<body>

  <h2>Word & Character Counter</h2>

  <textarea id="text-input" placeholder="Type something here..."></textarea>

  <div class="count-box">
    Characters: <span id="char-count">0</span><br>
    Words: <span id="word-count">0</span>
  </div>

  <script>
    const textarea = document.getElementById('text-input');
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');

    function updateCounts() {
      const text = textarea.value;
      charCount.textContent = text.length;
      const words = text.trim().split(/\\s+/).filter(word => word.length > 0);
      wordCount.textContent = words.length;
    }

    textarea.addEventListener('input', updateCounts);
  </script>

</body>
</html>`);

  const [review, setreview] = useState();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  });

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  async function reviewCode() {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/ai/get-review", { code });
      setreview(response.data);
    } catch (error) {
      setreview('Error: Unable to review code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setcode(prev => prev + "\n" + text);
    } catch (err) {
      alert("Paste failed: " + err.message);
    }
  }

  return (
    <>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-lg border transition-all duration-200 hover:scale-105 shadow-lg ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
            : 'bg-white border-gray-300 hover:bg-gray-100'
        }`}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      <main className={`flex md:flex-row h-screen p-4 gap-3 rounded-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-stone-900' : 'bg-gray-100'
      }`}>
        {/* Code Editor Panel */}
        <div
          className={`left min-w-[50%] h-full rounded-xl relative flex flex-col overflow-hidden ${
            isDarkMode ? 'bg-black' : 'bg-white'
          }`}
        >
          {/* Paste Button */}
          <div className="flex justify-between items-center px-4 pt-3 pb-1">
            <span className="text-sm font-semibold text-gray-400">Code Editor</span>
            <button
              onClick={pasteClipboard}
              className={`text-xs px-3 py-1 rounded-md shadow ${
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              Paste
            </button>
          </div>

          {/* Code Editor with Border */}
          <div className="p-3 flex-1 overflow-auto border rounded-xl mx-4 mb-4 focus-within:ring-2 focus-within:ring-blue-400"
     style={{ borderColor: isDarkMode ? '#4B5563' : '#D1D5DB' }}>
  <Editor
    value={code}
    onValueChange={code => setcode(code)}
    highlight={code => prism.highlight(code, prism.languages.js, 'js')}
    padding={10}
    style={{
      fontFamily: '"Fira code", "Fira Mono", monospace',
      fontSize: 15,
      backgroundColor: '#1e1e1e',     // Always dark
      color: 'orange',                // Always light text
      outline: 'none',
      minHeight: '100%',
      borderRadius: '0.75rem'
    }}
  />
</div>


          {/* Review Button */}
          <div className="px-6 pb-6">
            <button
              className={`w-full h-10 rounded-lg flex items-center justify-center duration-200 ${
                isDarkMode 
                  ? 'bg-gray-600 text-white hover:bg-gray-500' 
                  : 'bg-slate-600 text-white hover:bg-slate-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={reviewCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                'Review'
              )}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className={`right overflow-auto min-w-[50%] h-full rounded-xl p-4 transition-colors duration-300 ${
          isDarkMode ? 'bg-stone-300 text-gray-900' : 'bg-gray-50 border border-gray-200 text-gray-900'
        }`}>
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-black rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600 animate-pulse">
                Analyzing your code...
              </p>
            </div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
