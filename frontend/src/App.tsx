import './App.css'
import {useState} from "react";
import Learn from "./learn.tsx";
import Plan from "./plan.tsx";
import Sidebar from "./sidebar.tsx";

function App() {
    const [showLearn, setShowLearn] = useState<boolean|null>(true)
    const [showPlan, setShowPlan] = useState<boolean|null>(null)

  return (
      <div className="min-h-screen flex flex-col min-w-full">
          <header className="text-dark-green text-center p-4 font-bold bg-gold mb-4 text-2xl">
              National Park Advisor
          </header>
          <main className="flex-grow container mx-auto flex-col">
              <div className="md:flex">
                  <div className="w-1/6">
                  <Sidebar showLearn={showLearn} setShowLearn={setShowLearn} showPlan={showPlan} setShowPlan={setShowPlan}/>
                  </div>
                      <div className="w-5/6">
                      {showLearn && <Learn />}
                      {showPlan && <Plan />}
                  </div>
              </div>
          </main>
      </div>
  )
}

export default App
