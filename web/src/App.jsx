import Blobs from "./components/Blobs"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import Section from "./components/Section"
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from "react";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function App() {
  const [info, setInfo] = useState(null);
  const [chat, setChat] = useState(null);

  const infoFunc = (info) => {
    setInfo(info)
  }

  const chatFunc = (chat) => {
    setChat([...chat, chat])
  }

  useEffect(() => {
  }, [info])
  

  return (
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
      <Blobs />
      <SearchBar infoFunc={infoFunc} />
      <Header info={info} />
      <Section info={info} chatFunc={chatFunc} chat={chat} />
      {/* Uncomment if you decide to use Footer <Footer/> */}
    </div>
  )
  
}

export default App
