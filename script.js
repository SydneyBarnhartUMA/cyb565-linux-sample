/* ============================================================
   CIS 565 — Oakridge Technologies Lab Tour
   script.js
   ============================================================ */

// --- State ---
const totalStops = 8;
const completedStops = new Set();

// --- Panel Collapse/Expand ---
const collapseTab = document.getElementById('collapseTab');
const collapseIcon = document.getElementById('collapseIcon');
const labPanel = document.getElementById('labPanel');

collapseTab.addEventListener('click', () => {
    labPanel.classList.toggle('hidden');
    collapseIcon.classList.toggle('collapsed');
});

// --- Toggle Tour Stops ---
function toggleStop(stopId) {
    const body = document.getElementById(`stop-body-${stopId}`);
    const chevron = document.getElementById(`chevron-${stopId}`);
    const isOpen = body.classList.contains('open');

    // Close all other stops
    document.querySelectorAll('.stop-body').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.stop-chevron').forEach(el => el.classList.remove('open'));

    // Toggle this one
    if (!isOpen) {
        body.classList.add('open');
        chevron.classList.add('open');

        // Scroll into view
        setTimeout(() => {
            body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// --- Toggle How-To Panels ---
function toggleHowTo(header) {
    const body = header.nextElementSibling;
    const chevron = header.querySelector('.how-to-chevron');
    body.classList.toggle('open');
    chevron.classList.toggle('open');
}

// --- Check Answers ---
function checkAnswer(stopId, inputId, acceptedAnswers) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(`feedback-${stopId}`);
    const answer = input.value.trim().toLowerCase();

    if (!answer) {
        feedback.textContent = 'Type something first!';
        feedback.className = 'answer-feedback incorrect';
        return;
    }

    const isCorrect = acceptedAnswers.some(a => answer.includes(a.toLowerCase()));

    if (isCorrect) {
        feedback.textContent = '✅ Nailed it!';
        feedback.className = 'answer-feedback correct';
        input.disabled = true;
        input.style.opacity = '0.6';

        // Mark stop as completed (only numbered stops)
        const numericStop = parseInt(stopId);
        if (!isNaN(numericStop)) {
            completeStop(numericStop);
        }
    } else {
        feedback.textContent = '❌ Not quite — try again!';
        feedback.className = 'answer-feedback incorrect';
        input.value = '';
        input.focus();
    }
}

// --- Mark Stop Complete ---
function completeStop(stopNum) {
    completedStops.add(stopNum);

    // Update stop visual
    const stopEl = document.querySelector(`.tour-stop[data-stop="${stopNum}"]`);
    if (stopEl) {
        stopEl.classList.add('completed');
    }

    // Update progress
    updateProgress();

    // Show toast
    const messages = [
        '', // no stop 0
        'Nice! You found your way around. 🏠',
        'Phishing detected! You have sharp eyes. 🎣',
        'You found the break-in! 🚨',
        'Web attacks identified! 🕵️',
        'Firewall analysis complete! 🚪',
        'Backdoor discovered! 😱',
        'Attack timeline reconstructed! 📋',
        'Full packet analysis! You\'re a pro. 📡',
    ];
    showToast(messages[stopNum] || 'Great job!');

    // Check if all complete
    if (completedStops.size === totalStops) {
        setTimeout(() => {
            const completeEl = document.getElementById('tourComplete');
            completeEl.classList.add('visible');
            completeEl.scrollIntoView({ behavior: 'smooth' });
            showToast('🎉 Tour complete! Amazing work!');
        }, 1500);
    }
}

// --- Update Progress Bar ---
function updateProgress() {
    const pct = (completedStops.size / totalStops) * 100;
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');

    bar.style.setProperty('--progress', `${pct}%`);
    text.textContent = `${completedStops.size} / ${totalStops} stops`;
}

// --- Toast Notification ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// --- Click-to-Copy Code Blocks ---
document.querySelectorAll('.code-block').forEach(block => {
    block.addEventListener('click', () => {
        const text = block.textContent.replace('click to copy', '').replace('copied!', '').trim();
        navigator.clipboard.writeText(text).then(() => {
            block.classList.add('copied');
            setTimeout(() => block.classList.remove('copied'), 1500);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            block.classList.add('copied');
            setTimeout(() => block.classList.remove('copied'), 1500);
        });
    });
});

// --- Auto-open first stop on load ---
window.addEventListener('load', () => {
    setTimeout(() => toggleStop(1), 500);
});
