import './App.css'
import {useState} from "react";
import Learn from "./learn.tsx";

function App() {
    const [showLearn, setShowLearn] = useState<boolean|null>(null)
    const [showPlan, setShowPlan] = useState<boolean|null>(null)

  return (
      <div className="min-h-screen flex flex-col min-w-full">
          <header className="text-gray-700 text-center p-4 font-bold">
              National Park Advisor
          </header>
          <main className="flex-grow container mx-auto p-4 flex-col">
              <div className="md:flex">
                  <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                      <li>
                          <a href="#"
                             className="inline-flex items-center px-4 py-3 text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600"
                             aria-current="page"
                             onClick={() =>{
                                    setShowLearn(true)
                                    setShowPlan(false)
                             }}>
                              <svg className="w-4 h-4 me-2 text-white" aria-hidden="true"
                                   xmlns="http://www.w3.org/2000/svg"
                                   fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                      d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                              </svg>
                              Learn
                          </a>
                      </li>
                      <li>
                          <a href="#"
                             className="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                             onClick={() =>{
                                 setShowLearn(false)
                                 setShowPlan(true)
                             }}>
                              <svg className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                   xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                  <path
                                      d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                              </svg>
                              Plan
                          </a>
                      </li>
                  </ul>
                  {!showLearn && !showPlan &&
                  <div
                      className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Profile Tab</h3>
                      <p className="mb-2">This is some placeholder content the Profile tab's associated content,
                          clicking
                          another tab will toggle the visibility of this one for the next.</p>
                      <p>The tab JavaScript swaps classes to control the content visibility and styling.</p>
                  </div>}
                  {showLearn && <Learn />}
                  {showPlan && <div />}
              </div>

          </main>
          <button
              className="bg-stone-200 text-forest-green outline-sage-green text-center p-4 hover:outline-sage-green">Get
              Your Recommendations
          </button>

      </div>
  )
}

export default App
