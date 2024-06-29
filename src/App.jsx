import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from './components/Header';

const App = () => {
    const [text, setText] = useState('');
    const [speechUrl, setSpeechUrl] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false); // State to track button click
    const [language, setLanguage] = useState('en-US'); // State for selected language
    const [voiceName, setVoiceName] = useState('en-US-Studio-O'); // State for selected voice name
    const [loading, setLoading] = useState(false); // State for loading
    const [darkMode, setDarkMode] = useState(false); // State for dark mode
    const audioRef = useRef(null); // Ref for <audio> element

    const voices = {
        'en-US': [
            { value: 'en-US-Studio-O', label: 'en-US-Studio-O' },
            { value: 'en-US-Wavenet-D', label: 'en-US-Wavenet-D' },
            { value: 'en-US-Journey-D', label: 'en-US-Journey-D' },
            { value: 'en-US-Journey-F', label: 'en-US-Journey-F' },
        ],
        'en-IN': [
            { value: 'en-IN-Neural2-A', label: 'en-IN-Neural2-A' },
            { value: 'en-IN-Neural2-B', label: 'en-IN-Neural2-B' },
            { value: 'en-IN-Neural2-C', label: 'en-IN-Neural2-C' },
            { value: 'en-IN-Neural2-D', label: 'en-IN-Neural2-D' },
            { value: 'en-IN-Wavenet-A', label: 'en-IN-Wavenet-A' },
            { value: 'en-IN-Wavenet-B', label: 'en-IN-Wavenet-B' },
            // Add more Indian English voices as needed
        ]
    };

    useEffect(() => {
        const convertToSpeech = async () => {
            try {
                setLoading(true); // Set loading to true before API call
                const apiKey = import.meta.env.VITE_API_KEY;
                const url = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

                const requestBody = {
                    input: { text: text },
                    voice: { languageCode: language, name: voiceName },
                    audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 },
                };

                const response = await axios.post(url, requestBody);
                const audioContent = response.data.audioContent;
                setSpeechUrl(`data:audio/mp3;base64,${audioContent}`); // Update speechUrl with new content
                console.log(response); // Optional: log response for debugging
            } catch (error) {
                console.error('Error converting text to speech:', error);
            } finally {
                setLoading(false); // Set loading to false after API call
            }
        };

        if (buttonClicked && text.trim() !== '') {
            convertToSpeech(); // Call API when buttonClicked state changes and text is not empty
        }
    }, [buttonClicked, text, language, voiceName]);

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

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setVoiceName(voices[e.target.value][0].value); // Reset voice name to the first option of the selected language
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={darkMode ? 'app dark-mode' : 'app'}>
            <Header />
            <button onClick={toggleDarkMode} className='dark-mode-toggle'>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className='section'>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to convert to speech"
                    className={darkMode ? 'textarea-dark' : 'textarea-light'}
                />
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className='language-select'
                >
                    <option value="en-US">English (US)</option>
                    <option value="en-IN">English (Indian)</option>
                </select>
                <select
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    className='voice-select'
                >
                    {voices[language].map((voice) => (
                        <option key={voice.value} value={voice.value}>
                            {voice.label}
                        </option>
                    ))}
                </select>
                <button onClick={handleClick} className='btn-converter' disabled={loading}>
                    {loading ? 'Converting...' : 'Convert to Speech'}
                </button>
                {loading && <div className='loader'>Loading...</div>} {/* Display loader while loading */}
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
