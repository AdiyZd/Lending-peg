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
    const wGm = document.getElementById("timerGames");
    const timerDisplay = document.getElementById("timerDisplay");

    let timerInterval;
    let defaultTime = 300; // 5 menit
    let currentQuestionTime;
    let level = 1;
    let score = 0;
    let questionIndex = 0;
    const questionsPerLevel = 10;
    let correctAnswer = 0;
    let baseTime = 300;

    submitBtn.disabled = true
    answerInput.disabled = true


    // logika tombol start
    startBtn.addEventListener("click", function () {
        level = 1;
        score = 0;
        questionIndex = 0;
        baseTime = 300;
        progressBar.style.width = '0%';
        levelBadge.textContent = `Level ${level}`;
        scoreDisplay.textContent = score;
        submitBtn.disabled = false;
        answerInput.disabled = false;
        startLevel();
    });

    function startLevel() {
        Swal.fire({
            title: `🎉 Selamat!`,
            text: `Kamu berhasil naik ke Level ${level}!`,
            icon: 'success',
            confirmButtonText: 'Lanjut!',
            showClass: {
                popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                    `
            },
            hideClass: {
                popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                    `
            }
        }).then(() => {
            answerInput.disabled = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Kirim';
            answerInput.value = '';
            startBtn.style.display = "none";
            wGm.style.display = "block";
            questionIndex = 0;
            currentQuestionTime = baseTime;
            levelBadge.textContent = `Level ${level}`;
            generateQuestion();
            startTimer();
        });
    }

    function generateQuestion() {
        const ops = ['+', '-', '*', '%', '/'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b;

        switch (level) {
            case 1:
                a = Math.floor(Math.random() * 10) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                break;
            case 2:
                a = Math.floor(Math.random() * 20) + 10;
                b = Math.floor(Math.random() * 10) + 1;
                break;
            case 3:
                a = Math.floor(Math.random() * 50) + 10;
                b = Math.floor(Math.random() * 20) + 1;
                break;
            case 4:
                a = Math.floor(Math.random() * 100) + 20;
                b = Math.floor(Math.random() * 30) + 1;
                break;
            case 5:
                a = Math.floor(Math.random() * 200) + 50;
                b = Math.floor(Math.random() * 50) + 1;
                break;
            default:
                a = 1; b = 1;
        }

        let questionText = `${a} ${op} ${b}`;
        let result;

        switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case 'x': result = a * b; break;
            case 'Modulus': result = a % b; break;
            case 'bagi': result = parseFloat((a / b).toFixed(2)); break;
        }

        correctAnswer = result;
        questionDisplay.textContent = questionText;
        answerInput.value = '';
        answerInput.focus();
    }

    submitBtn.addEventListener("click", function () {
        if (submitBtn.textContent === 'Priviuw Hasil' || submitBtn.textContent === 'Lihat Nilai Test Matematika Saya') {

            Swal.fire({
                title: "perminan Selesai!",
                icon: "info",
                text: `Skor Akhir Kamu: ${score}`,
                showCancelButton: true,
                confirmButtonText: `Main Lagi?`,
                cancelButtonText: `Oke`,
                ShowClass: {
                    popup: `
                    
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                    
                    `
                },
                hideClass: {
                    popup: `
                    
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                    
                    `
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
            return;
        }

        let userAnswer = answerInput.value.replace(',', '.');
        if (userAnswer === '') return;

        let parsedAnswer = parseFloat(userAnswer);

        if (Math.abs(parsedAnswer - correctAnswer) < 0.01) {
            score += 10;
            correctAlert.classList.remove('d-none');
            wrongAlert.classList.add('d-none');
        } else {
            correctAlert.classList.add('d-none');
            wrongAlert.classList.remove('d-none');
        }

        scoreDisplay.textContent = score;
        questionIndex++;
        updateProgress();
        nextStep();
    });

    function updateProgress() {
        const progress = (questionIndex / questionsPerLevel) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }

    function nextStep() {
        clearInterval(timerInterval);

        if (questionIndex >= questionsPerLevel) {
            level++;
            if (level > 5) {
                submitBtn.textContent = 'Lihat Nilai Test Matematika Saya';
                questionDisplay.textContent = 'Permainan selesai!';
                submitBtn.disabled = false;
                answerInput.disabled = true;
                return;
            }

            baseTime = 300; // reset waktu ke 5 menit
            startLevel();
        } else {
            baseTime = Math.max(baseTime - 60, 60);
            currentQuestionTime = baseTime;
            generateQuestion();
            startTimer();
        }
    }

    function startTimer() {
        updateTimerDisplay();

        timerInterval = setInterval(function () {
            currentQuestionTime--;
            updateTimerDisplay();

            if (currentQuestionTime <= 0) {
                clearInterval(timerInterval);
                wrongAlert.classList.remove('d-none');
                correctAlert.classList.add('d-none');
                questionIndex++;
                updateProgress();
                nextStep();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const menit = Math.floor(currentQuestionTime / 60);
        const detik = currentQuestionTime % 60;
        const display = `${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}`;
        timerDisplay.textContent = display;

        if (currentQuestionTime <= 60) {
            timerDisplay.classList.add('text-danger');
            timerDisplay.classList.remove('text-dark');
        } else {
            timerDisplay.classList.add('text-dark');
            timerDisplay.classList.remove('text-danger');
        }
    }
});
