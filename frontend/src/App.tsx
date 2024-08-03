import './App.css'

function App() {

  return (
      <div className="min-h-screen flex flex-col min-w-full">
          <header className="text-gray-700 text-center p-4 font-bold">
              National Park Advisor
          </header>
          <div className="p-52"/>
          <button className="bg-stone-200 text-forest-green outline-sage-green text-center p-4 hover:outline-sage-green">Get Your Recommendations</button>
          <main className="flex-grow container mx-auto p-4 flex-col">
          </main>
      </div>
)
}

export default App
