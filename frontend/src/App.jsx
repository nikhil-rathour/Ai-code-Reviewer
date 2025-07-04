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
    // Get DOM elements
    const textarea = document.getElementById('text-input');
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');

    // Function to count characters and words
    function updateCounts() {
      const text = textarea.value;
      
      // Count characters
      charCount.textContent = text.length;

      // Count words (ignoring extra spaces)
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      wordCount.textContent = words.length;
    }

    // Event listener on input
    textarea.addEventListener('input', updateCounts);
  </script>

</body>
</html>
`)
  const [review, setreview] = useState()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Highlight all code blocks on the page
    prism.highlightAll();
  })

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  //hendel backend 
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  async function reviewCode() {
    setIsLoading(true);
    
    try {
      const response = await axios.post(backendUrl, {code})
      setreview(response.data)
    } catch (error) {
      setreview('Error: Unable to review code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Theme Toggle Button */}
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
        <div className={`left min-w-[50%] h-full rounded-xl relative overflow-hidden ${
          isDarkMode ? 'bg-black' : 'bg-gray-900 border border-gray-300'
        }`}>
          <div className="p-3 rounded-s-xl h-full overflow-auto">
            <Editor
              value={code}
              onValueChange={code => setcode(code)}
              highlight={code => prism.highlight(code, prism.languages.js, 'js')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 15,
                backgroundColor: isDarkMode ? 'black' : '#1a1a1a',
                color: isDarkMode ? 'white' : '#f8f8f2'
              }}
            />
          </div>
          <button
            className={`review h-10 rounded-lg flex items-center justify-center w-40 duration-200 absolute bottom-6 right-6 ${
              isDarkMode 
                ? 'bg-gray-600 text-white hover:bg-gray-500' 
                : 'bg-blue-600 text-white hover:bg-blue-500'
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
            <Markdown 
              rehypePlugins={[rehypeHighlight]}
            >
              {review}
            </Markdown>
          )}
        </div>
      </main>
    </>
  )
}

export default App;