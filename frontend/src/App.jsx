
import { useEffect , useState } from 'react';
import './App.css'
import "prismjs/themes/prism-okaidia.css";
import Editor from 'react-simple-code-editor';
import axios from 'axios';
import prism from "prismjs";
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/atom-one-dark.css";



function App() {

  const [code, setcode] = useState(`function sum(){}`)
  const [review, setreview] = useState()

  useEffect(() => {
    // Highlight all code blocks on the page
    prism.highlightAll();
    })


   //hendel backend 
      async function reviewCode() {
       const response = await axios.post("http://localhost:3000/ai/get-review" , {code})
       setreview(response.data)
       
      }

  return (
    <>
      <main className="flex md:flex-row h-screen p-4 gap-3 rounded-lg bg-stone-900">
      <div className="left min-w-[50%] bg-black h-full rounded-xl relative">

        <div className="p-3 rounded-s-xl h-full">
          <Editor
            value={code}
            onValueChange={code => setcode(code)}
            highlight={code => prism.highlight(code, prism.languages.js, 'js')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 15,
              backgroundColor: 'black',
              color: 'white'
            }}
          />
        </div>
        <button
        className="review h-10 rounded-lg mb-2 flex items-center justify-center w-40 bg-gray-600 text-white duration-200 absolute bottom-4 right-4"
        onClick={reviewCode}
        >
        Review
        </button>
      </div>



      <div className="right overflow-auto min-w-[50%] bg-stone-300 h-full rounded-xl  p-4">

      <Markdown 
      rehypePlugins={[rehypeHighlight]}
      >
        {review}</Markdown>


      </div>
      </main>
    </>
    )
}



export default App;
