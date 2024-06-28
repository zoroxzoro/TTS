import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from './components/Header';

const App = () => {
    const [text, setText] = useState('');
    const [speechUrl, setSpeechUrl] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false); // State to track button click
    const audioRef = useRef(null); // Ref for <audio> element

    useEffect(() => {
        const convertToSpeech = async () => {
            try {
                const apiKey = import.meta.env.VITE_API_KEY;
                const url = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

                const requestBody = {
                    input: { text: text },
                    voice: { languageCode: 'en-US', name: 'en-US-Studio-O' },
                    audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 },
                };

                const response = await axios.post(url, requestBody);
                const audioContent = response.data.audioContent;
                setSpeechUrl(`data:audio/mp3;base64,${audioContent}`); // Update speechUrl with new content
                console.log(response); // Optional: log response for debugging
            } catch (error) {
                console.error('Error converting text to speech:', error);
            }
        };

        if (buttonClicked && text.trim() !== '') {
            convertToSpeech(); // Call API when buttonClicked state changes and text is not empty
        }
    }, [buttonClicked, text]);

    const handleClick = () => {
        if (text.trim() !== '') {
            setButtonClicked(!buttonClicked); // Toggle buttonClicked to trigger useEffect
        }
    };

    useEffect(() => {
        if (speechUrl && audioRef.current) {
            audioRef.current.load(); // Force reload audio when speechUrl updates
        }
    }, [speechUrl]);

    return (
        <div>
            <Header />
            <div className='section'>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to convert to speech"
                />
                <button onClick={handleClick} className='btn-converter'>Convert to Speech</button>
                {speechUrl && (
                    <audio ref={audioRef} controls className='sound'>
                        <source src={speechUrl} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>
        </div>
    );
};

export default App;
