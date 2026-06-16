// @ts-check

/** @type {any} */
const quizWindow = window;
const supabaseUrl = 'https://oamzutzthpawylshdvqa.supabase.co';
const supabaseKey = 'sb_publishable_FB09becLi2b-q-KcwP6nKg_pvd8jaQn';
const supabase = quizWindow.supabase.createClient(supabaseUrl, supabaseKey);

/** @type {Array<{id: number, question: string, options: string[], correct: string}>} */
let globalQuizData = [];

document.addEventListener("DOMContentLoaded", async () => {
    const activeDay = localStorage.getItem('activeQuizDay') || '1';
    const dayBadge = document.getElementById('quiz-day-badge');
    if (dayBadge) dayBadge.innerText = `Assignment Day ${activeDay}`;

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${supabaseUrl}/functions/v1/generate-quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionData.session.access_token}`
            },
            body: JSON.stringify({ 
                grade: localStorage.getItem('studentGrade') || '5th', 
                group_level: localStorage.getItem('studentGroup') || 'beginner', 
                day_number: parseInt(activeDay)
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        globalQuizData = data.questions;
        renderQuiz(globalQuizData);

    } catch (err) {
        console.log("Using instant fallback calculations track grid matrix setup...", err);
        globalQuizData = generateLocalQuizFallback(localStorage.getItem('studentGrade') || '5th', activeDay);
        renderQuiz(globalQuizData);
    }
});

/**
 * Creates alternative questions offline if the network API edge returns a status drop.
 * @param {string} grade
 * @param {string} day
 */
function generateLocalQuizFallback(grade, day) {
    /** @type {Array<{id: number, question: string, options: string[], correct: string}>} */
    let arr = [];
    const parsedDay = parseInt(day) || 1;
    for(let i = 1; i <= 10; i++) {
        let valA = i * parsedDay + 2;
        let valB = i + 3;
        arr.push({
            id: i,
            question: `[Grade ${grade} Practice] Solve the logical pattern optimization problem: Find the tracking value where parameter equals (${valA} + ${valB}).`,
            options: [`${valA + valB}`, `${valA * valB}`, `${valA - valB}`, `${valA + valB + 10}`],
            correct: `${valA + valB}`
        });
    }
    return arr;
}

/**
 * Appends quiz objects into DOM nodes safely.
 * @param {Array<{id: number, question: string, options: string[], correct: string}>} questions
 */
function renderQuiz(questions) {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('hidden');
    
    const form = document.getElementById('quiz-render-form');
    const wrapper = document.getElementById('questions-wrapper');
    if (form && wrapper) {
        form.classList.remove('hidden');
        wrapper.innerHTML = ""; // Clear loader references

        questions.forEach((q, qIdx) => {
            const box = document.createElement('div');
            box.className = 'quiz-box';
            box.innerHTML = `<h3>${qIdx + 1}. ${q.question}</h3>`;

            q.options.forEach((opt) => {
                const label = document.createElement('label');
                label.className = 'option-field';
                label.innerHTML = `
                    <input type="radio" name="question-${qIdx}" value="${opt}" required>
                    <span>${opt}</span>
                `;
                box.appendChild(label);
            });
            wrapper.appendChild(box);
        });
    }
}

const quizForm = document.getElementById('quiz-render-form');
if (quizForm) {
    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const activeDay = localStorage.getItem('activeQuizDay') || '1';
        let score = 0;

        const evaluatedData = globalQuizData.map((q, qIdx) => {
            const checkedInput = /** @type {HTMLInputElement | null} */ (document.querySelector(`input[name="question-${qIdx}"]:checked`));
            const selectedOpt = checkedInput ? checkedInput.value : '';
            const isCorrect = selectedOpt === q.correct;
            if (isCorrect) score++;
            return { ...q, selected: selectedOpt, status_correct: isCorrect };
        });

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) {
            alert("Session missing, authentication tracking failure.");
            return;
        }
        const studentId = sessionData.session.user.id;

        const { error } = await supabase.from('quiz_attempts').insert({
            student_id: studentId,
            day_number: parseInt(activeDay),
            score: score,
            total_questions: 10,
            quiz_data: evaluatedData
        });

        if (error) {
            alert("Error updating quiz data: " + error.message);
        } else {
            alert(`Assessment calculated and recorded! Your Score: ${score}/10`);
            window.location.href = 'portal.html';
        }
    });
}
