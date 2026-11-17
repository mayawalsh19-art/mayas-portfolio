import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import FeaturedWork from './components/FeaturedWork'
import BrandingSystem from './components/BrandingSystem'
import Contact from './components/Contact'
import Footer from './components/Footer'
import useReveal from './useReveal'

export default function App() {
  useReveal()
  return (
    <>
      <Navbar />
      <Hero />
      <AboutMe />
      <FeaturedWork />
      <BrandingSystem />
      <Contact />
      <Footer />
    </>
  )
}
