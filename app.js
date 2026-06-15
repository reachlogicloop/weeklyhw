// Initialize Supabase
const supabaseUrl = 'https://oamzutzthpawylshdvqa.supabase.co';
const supabaseKey = 'sb_publishable_FB09becLi2b-q-KcwP6nKg_pvd8jaQn';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Toggle between Login and Sign Up forms
function toggleForms() {
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');

    if (loginBox.classList.contains('hidden')) {
        loginBox.classList.remove('hidden');
        signupBox.classList.add('hidden');
    } else {
        loginBox.classList.add('hidden');
        signupBox.classList.remove('hidden');
    }
}

// Handle Sign Up Submission
document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const grade = document.getElementById('reg-grade').value;
    const group = document.getElementById('reg-group').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: name,
                grade: grade,
                group_level: group
            }
        }
    });

    if (error) {
        alert("Error signing up: " + error.message);
    } else {
        alert("Account created successfully! You can now log in.");
        toggleForms();
    }
});

// Handle Log In Submission
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Error logging in: " + error.message);
    } else {
        const metadata = data.user.user_metadata;
        localStorage.setItem('studentName', metadata.full_name);
        localStorage.setItem('studentGroup', metadata.group_level);
        
        window.location.href = 'portal.html';
    }
});
