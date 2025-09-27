import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Conversation from "@/Conversation.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Conversation>
            <App/>
        </Conversation>
    </StrictMode>,
)
