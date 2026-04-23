// Elementos do DOM
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const jokeText = document.getElementById('joke-text');
const jokeCategory = document.getElementById('joke-category');
const loading = document.getElementById('loading');
const typeSelect = document.getElementById('type-select');
const counter = document.getElementById('counter');

let jokeCount = 0;
let currentJoke = '';

// API: JokeAPI (https://jokeapi.dev/)
const API_URL = 'https://v2.jokeapi.dev/joke/';

// Inicializar
generateBtnBtnListener();

function generateBtn BtnListener() {
    generateBtn.addEventListener('click', fetchJoke);
    copyBtn.addEventListener('click', copyToClipboard);
}

async function fetchJoke() {
    const type = typeSelect.value;
    const category = 'Any'; // Pode ser: Any, Miscellaneous, Programming, Knock-Knock, General, Christmas
    
    try {
        loading.classList.add('active');
        generateBtn.disabled = true;
        jokeText.textContent = '';
        jokeCategory.textContent = '';
        
        // Construir URL baseado no tipo
        let url = `${API_URL}${category}`;
        if (type !== 'any') {
            url += `?type=${type}`;
        } else {
            url += '?type=single,twopart';
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar piada');
        }
        
        const data = await response.json();
        
        if (data.error) {
            showError('Nenhuma piada encontrada para este filtro');
            return;
        }
        
        // Processar resposta
        if (data.type === 'twopart') {
            currentJoke = `${data.setup}\n\n${data.delivery}`;
            jokeCategory.textContent = `Tipo: ${data.category} • Pergunta/Resposta`;
        } else {
            currentJoke = data.joke;
            jokeCategory.textContent = `Tipo: ${data.category} • Uma linha`;
        }
        
        jokeText.textContent = currentJoke;
        jokeCount++;
        counter.textContent = jokeCount;
        
        loading.classList.remove('active');
        generateBtn.disabled = false;
        
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar piada. Tente novamente!');
        loading.classList.remove('active');
        generateBtn.disabled = false;
    }
}

function copyToClipboard() {
    if (!currentJoke) {
        showError('Gere uma piada primeiro!');
        return;
    }
    
    navigator.clipboard.writeText(currentJoke).then(() => {
        showSuccess('Piada copiada para a área de transferência!');
    }).catch(() => {
        showError('Erro ao copiar piada');
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    jokeText.parentElement.insertAdjacentElement('afterend', errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    jokeText.parentElement.insertAdjacentElement('afterend', successDiv);
    setTimeout(() => successDiv.remove(), 2000);
}

// Gerar piada automática ao carregar a página
window.addEventListener('load', () => {
    setTimeout(fetchJoke, 500);
});
