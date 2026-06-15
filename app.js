// Function to toggle between Login and Sign Up forms
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
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the page from refreshing
    
    // Grab the data the user typed in
    const name = document.getElementById('reg-name').value;
    const grade = document.getElementById('reg-grade').value;
    const group = document.getElementById('reg-group').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    console.log("Signing up:", { name, grade, group, email });
    
    // TODO: Later, you will add your Supabase code here!
    // Example: supabase.auth.signUp({ email, password })
    
    alert(`Awesome! Account created for ${name} in the ${group} group.`);
});

// Handle Log In Submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    console.log("Logging in:", { email });

    // TODO: Later, you will add your Supabase code here!
    // Example: supabase.auth.signInWithPassword({ email, password })
    
    alert("Logging you into Logic Loop...");
});
