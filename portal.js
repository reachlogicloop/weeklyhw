const supabaseUrl = 'https://oamzutzthpawylshdvqa.supabase.co';
const supabaseKey = 'sb_publishable_FB09becLi2b-q-KcwP6nKg_pvd8jaQn';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
    const studentName = localStorage.getItem('studentName');
    const studentGroup = localStorage.getItem('studentGroup');
    const joinedAt = localStorage.getItem('studentJoined');

    if (!studentName) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('welcome-message').innerText = `Welcome Back, ${studentName}!`;
    document.getElementById('level-display').innerText = studentGroup;

    // Calculate active homework milestone day sequence via timestamp matrix
    const joinDate = new Date(joinedAt);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const activeDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
        const { data: attempts } = await supabase
         .from('quiz_attempts')
         .select('score')
         .eq('student_id', session.session.user.id)
         .eq('day_number', activeDay);

        const practiceBtn = document.querySelector('.ai-card .btn');
        if (attempts && attempts.length > 0) {
            practiceBtn.innerText = `Day ${activeDay} Completed! (Score: ${attempts[0].score}/10)`;
            practiceBtn.disabled = true;
            practiceBtn.style.background = '#475569';
        } else {
            practiceBtn.innerText = `Launch Day ${activeDay} Quiz`;
            practiceBtn.onclick = () => {
                localStorage.setItem('activeQuizDay', activeDay);
                window.location.href = 'quiz.html';
            };
        }
    }

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.href = 'index.html';
    });
});
