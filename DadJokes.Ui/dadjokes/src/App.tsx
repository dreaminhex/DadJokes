import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { JokeForm } from "@/components/joke-form"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="dadjoke-ui-theme">
      <div className="min-h-screen min-w-full bg-background flex items-center justify-center">
        <div className="w-full max-w-8xl p-6">
          <JokeForm />
        </div>
      </div>
    </ThemeProvider>

  )
}

export default App
