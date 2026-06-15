document.addEventListener('DOMContentLoaded', function() {
    
    // Grab the user data stored during login
    const studentName = localStorage.getItem('studentName');
    const studentGroup = localStorage.getItem('studentGroup');

    // Security check: if no data exists, send them back to login
    if (!studentName) {
        window.location.href = 'index.html';
    }

    // Populate the dashboard
    document.getElementById('welcome-message').innerText = `Welcome back, ${studentName}!`;
    document.getElementById('level-display').innerText = studentGroup;

});

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', async function() {
    // If you initialized supabase in portal.js, you'd sign out here.
    // For now, we clear the local browser storage to "log out" the user on the frontend.
    localStorage.clear();
    
    window.location.href = 'index.html';
});
