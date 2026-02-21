// --- গ্লোবাল ভেরিয়েবল ---
let selectedOperator = "";
const mobileInput = document.getElementById('mobileNumber');
const submitButton = document.getElementById('submitBtn');
const responseMsg = document.getElementById('responseMessage');

// ১. অপারেটর সিলেক্ট ফাংশন
function selectOp(op, element) {
    selectedOperator = op;
    
    // সব কার্ড থেকে সিলেক্টেড ক্লাস রিমুভ করা
    document.querySelectorAll('.op-card').forEach(card => card.classList.remove('selected'));
    // বর্তমান কার্ড হাইলাইট করা
    element.classList.add('selected');

    const inputArea = document.getElementById('input-area');
    inputArea.style.display = 'block';
    document.getElementById('selectedLabel').innerHTML = `<i class="fas fa-mobile-alt"></i> আপনার ${op} নম্বর দিন:`;

    // স্মুথ স্ক্রল
    window.scrollTo({ top: inputArea.offsetTop - 80, behavior: 'smooth' });
}

// ২. মোবাইল নম্বর ভ্যালিডেশন এবং ফর্ম সাবমিট
function submitForm() {
    const num = mobileInput.value.trim();
    const operatorPrefixes = {
        "Grameenphone": ["017", "013"],
        "Banglalink": ["019", "014"],
        "Robi": ["018"],
        "Teletalk": ["015"]
    };

    // নম্বর ফরম্যাট চেক
    if (num.length !== 11 || isNaN(num)) {
        showMsg("❌ সঠিক 11 ডিজিটের মোবাইল নম্বর দিন।", "error");
        return;
    }

    // অপারেটর ও প্রিফিক্স চেক
    if (!selectedOperator) {
        showMsg("🚫 আগে একটি অপারেটর সিলেক্ট করুন।", "error");
        return;
    }

    if (!operatorPrefixes[selectedOperator].includes(num.substring(0, 3))) {
        showMsg(`🚫 এটি ${selectedOperator}-এর সঠিক নম্বর নয়।`, "error");
        return;
    }

    // বাটন লোডিং অ্যানিমেশন
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রসেসিং...';

    // ১.২ সেকেন্ড পর পরবর্তী ধাপে যাওয়া
    setTimeout(() => {
        document.querySelector('.main-card').style.display = 'none';
        document.querySelector('.hero-area').style.display = 'none';
        document.getElementById('otp-section').style.display = 'block';
        document.getElementById('displayNum').innerText = num;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
}

// ৩. ভেরিফিকেশন বা বিজ্ঞাপন প্রসেস শুরু
function startAdProcess() {
    const adBtn = document.getElementById('adBtn');
    const countdownDisplay = document.getElementById('countdown');
    let timeLeft = 10;

    // বাটন ডিজেবল করা
    adBtn.style.pointerEvents = "none";
    adBtn.style.opacity = "0.6";
    adBtn.innerHTML = '<i class="fas fa-sync fa-spin"></i> ভেরিফাই হচ্ছে...';

    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdownDisplay.innerHTML = "<div class='success-msg' style='color: #28a745; font-weight: bold; margin-bottom: 15px;'>✅ ভেরিফিকেশন সফল! আপনার OTP এখন প্রস্তুত।</div>";
            adBtn.style.display = "none";

            const instruction = document.getElementById('ad-instruction');
            if (instruction) instruction.style.display = "none";

            // OTP সাবমিট বাটন দেখানো
            const otpBtn = document.getElementById('otpSubmitBtn');
            otpBtn.style.display = "flex";
            otpBtn.classList.add('popIn'); 
        } else {
            countdownDisplay.innerHTML = `<div class='waiting-msg' style='color: #555;'>⏳ অপেক্ষা করুন: <b>${timeLeft}</b> সেকেন্ড বাকি...</div>`;
            timeLeft -= 1;
        }
    }, 1000);
}

// ৪. ভিডিও পপআপ দেখানো
function showVideoPopup() {
    const videoArea = document.getElementById('videoArea');
    videoArea.style.display = 'flex';
    document.getElementById('successVideo').play().catch(() => {
        console.log("Auto-play blocked.");
    });
}

// ৫. ভিডিও বন্ধ করা এবং সব রিসেট করে অন্য পেজে পাঠানো
function closeVideo() {
    const video = document.getElementById('successVideo');
    if (video) video.pause();
    document.getElementById('videoArea').style.display = 'none';

    // পুরো সিস্টেম রিসেট (Data Clear)
    selectedOperator = "";
    mobileInput.value = "";
    submitButton.disabled = false;
    submitButton.innerHTML = 'সাবমিট করুন';
    
    // মেইন ইন্টারফেস ফিরিয়ে আনা
    document.getElementById('otp-section').style.display = 'none';
    document.getElementById('input-area').style.display = 'none';
    document.querySelector('.main-card').style.display = 'block';
    document.querySelector('.hero-area').style.display = 'block';
    document.querySelectorAll('.op-card').forEach(card => card.classList.remove('selected'));

    // রিডাইরেক্ট করা
    window.location.href = "contact.html";
}

// ৬. নোটিফিকেশন মেসেজ ফাংশন
function showMsg(text, type) {
    responseMsg.innerText = text;
    responseMsg.className = "message-box " + type; 
    responseMsg.style.display = "block";
    setTimeout(() => { responseMsg.style.display = "none"; }, 3500);
}

// ৭. ব্রাউজার ব্যাক করলে যেন সব নতুনভাবে শুরু হয় (অটো-রিসেট)
window.addEventListener('pageshow', function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        window.location.reload();
    }
});