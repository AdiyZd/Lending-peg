document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const startBtn = document.getElementById('startBtn');
    const submitBtn = document.getElementById('submitBtn');
    const answerInput = document.getElementById('answerInput');
    const questionDisplay = document.getElementById('questionDisplay');
    const correctAlert = document.getElementById('correctAlert');
    const wrongAlert = document.getElementById('wrongAlert');
    const scoreDisplay = document.querySelector('.score-display');
    const progressBar = document.querySelector('.progress-bar');
    const levelBadge = document.querySelector('.level-badge');

    // Game Variables
    let score = 0;
    let currentLevel = 1;
    let correctAnswers = 0;
    let currentQuestion = {};
    let gameActive = false;

    // Timer Variables
    let levelTimeout;
    const levelTimerDuration = 30000; // 30 detik

    // Start Game
    startBtn.addEventListener('click', function () {
        gameActive = true;
        startBtn.classList.add('d-none');
        answerInput.disabled = false;
        submitBtn.disabled = false;
        answerInput.focus();
        generateQuestion();
    });

    // Submit Answer
    submitBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Generate Math Question
    function generateQuestion() {
        const operations = ['+', '-', '*', '/', '%', '**'];
        const operation = operations[Math.floor(Math.random() * operations.length)];

        let num1, num2;

        // Adjust difficulty based on level
        if (currentLevel === 1) {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
        } else if (currentLevel === 2) {
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
        } else {
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
        }

        // Ensure subtraction results are positive
        if (operation === '-' && num2 > num1) {
            [num1, num2] = [num2, num1]; // Swap
        }

        currentQuestion = {
            num1: num1,
            num2: num2,
            operation: operation,
            answer: calculateAnswer(num1, num2, operation)
        };

        questionDisplay.textContent = `${num1} ${operation} ${num2} = ?`;
        answerInput.value = '';
    }

    // Calculate Correct Answer
    function calculateAnswer(num1, num2, operation) {
        switch (operation) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/': return parseFloat((num1 / num2).toFixed(2));
            case '%': return num1 % num2;
            case '**': return Math.pow(num1, num2);
            default: return num1 + num2;
        }
    }

    // Check User's Answer
    function checkAnswer() {
        if (!gameActive) return;

        const userAnswer = parseFloat(answerInput.value);

        if (isNaN(userAnswer)) {
            wrongAlert.textContent = "Masukkan jawaban yang valid!";
            wrongAlert.classList.remove('d-none');
            correctAlert.classList.add('d-none');
            return;
        }

        if (userAnswer === currentQuestion.answer) {
            // Correct
            score += 10;
            correctAnswers++;
            scoreDisplay.textContent = score;

            const progress = (correctAnswers % 5) * 20;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);

            correctAlert.classList.remove('d-none');
            wrongAlert.classList.add('d-none');

            // Naik Level
            if (correctAnswers > 0 && correctAnswers % 5 === 0) {
                currentLevel++;
                levelBadge.textContent = `Level ${currentLevel}`;
                alert(`Selamat! Anda naik ke Level ${currentLevel}`);
                startLevelTimer(); // Mulai hitung mundur 30 detik
            }

            // Cek kalau skor 1000
            if (score >= 1000) {
                gameActive = false;
                clearTimeout(levelTimeout); // stop timer
                const nilaiAkhir = Math.round(score / correctAnswers * currentLevel);
                alert(`Skor kamu: ${score}\nNilai akhir: ${nilaiAkhir}`);
                nextTask();
                return;
            }

            setTimeout(generateQuestion, 1500);
        } else {
            // Salah
            wrongAlert.textContent = "Salah! Coba lagi";
            wrongAlert.classList.remove('d-none');
            correctAlert.classList.add('d-none');
        }

        answerInput.value = '';
    }

    // Timer Level
    function startLevelTimer() {
        clearTimeout(levelTimeout);
        levelTimeout = setTimeout(() => {
            gameActive = false;
            alert("Waktu habis! Lanjut ke tugas berikutnya.");
            nextTask();
        }, levelTimerDuration);
    }

    // Lanjut ke tugas berikutnya
    function nextTask() {
        // Misalnya redirect ke halaman lain
        window.location.href = 'tugas-berikutnya.html';

        // Atau tampilin modal, konten lain dsb
        // document.getElementById('tugasLain').classList.remove('d-none');
    }
});