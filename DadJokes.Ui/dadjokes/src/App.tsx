import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { JokeForm } from "@/components/joke-form"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="dadjoke-ui-theme">
      <JokeForm />
    </ThemeProvider>
  )
}

export default App
