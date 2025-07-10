// Função para falar a mensagem usando Web Speech API
export function speakMessage(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
}

// Função para funcionar o botão de microfone
const micButton = document.querySelector('.microfone');
const input = document.querySelector('.input-text');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let isRecording = false;

    micButton.addEventListener('click', () => {
        if (!isRecording) {
            recognition.start();
            micButton.classList.add('gravando');
            isRecording = true;
        } else {
            recognition.stop();
            micButton.classList.remove('gravando');
            isRecording = false;
        }
    });

    recognition.addEventListener('result', (event) => {
        let textoFinal = '';
        for (let i = 0; i < event.results.length; i++) {
            textoFinal += event.results[i][0].transcript;
        }
        input.value = textoFinal;
    });

    recognition.addEventListener('end', () => {
        micButton.classList.remove('gravando');
        isRecording = false;
    });

    recognition.addEventListener('error', (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        micButton.classList.remove('gravando');
        isRecording = false;
    });
}