const scriptURL = 'https://script.google.com/macros/s/AKfycbxvr0rGtjTRsszw9JxIiG_yHhFzk8RoPbajCw70a4nTRCO1wVlkHhsjoggv5A04N19k/exec';

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('logDate').value = today;
});

function switchMainTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  if (tabName === 'tracker') {
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
    document.getElementById('trackerSection').classList.add('active');
  } else {
    document.querySelectorAll('.nav-btn')[1].classList.add('active');
    document.getElementById('calculatorSection').classList.add('active');
  }
}

// حساب السعرات التلقائية المستهدفة بناء على الهدف والوزن والعمر
function calculateDailyTarget() {
  const gender = document.getElementById('gender').value;
  const age = parseFloat(document.getElementById('userAge').value) || 25;
  const height = parseFloat(document.getElementById('userHeight').value) || 165;
  const weight = parseFloat(document.getElementById('weight').value);
  const goal = document.getElementById('userGoal').value;
  const activity = parseFloat(document.getElementById('userActivityLevel').value) || 1.2;

  if (!weight) return;

  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'أنثى' ? bmr - 161 : bmr + 5;
  const tdee = Math.round(bmr * activity);

  let target = tdee;
  if (goal.includes('خسارة')) target = tdee - 500;
  else if (goal.includes('زيادة')) target = tdee + 400;

  document.getElementById('targetCaloriesText').innerText = target;
  document.getElementById('calculatedTargetCalories').value = target;
  document.getElementById('targetDisplay').style.display = 'block';
}

function handleGenderChange() {
  const gender = document.getElementById('gender').value;
  document.getElementById('cycleGroup').style.display = gender === 'أنثى' ? 'block' : 'none';
  calculateDailyTarget();
}

function handleDietChange() {
  const val = document.getElementById('dietCommitment').value;
  document.getElementById('customDietGroup').style.display = val === 'أخرى' ? 'block' : 'none';
}

function handleReportChange() {
  const val = document.getElementById('wantReport').value;
  document.getElementById('reportDetailsGroup').style.display = val === 'نعم' ? 'block' : 'none';
}

function handleCycleChange() {
  const val = document.getElementById('cyclePhase').value;
  const note = document.getElementById('cycleNote');
  if (val === 'قبل الدورة') {
    note.style.display = 'block';
    note.innerText = '🌸 قد تشعرين برغبة في أكل الحلويات، لا بأس بقطعة حلوى!';
  } else if (val === 'فترة تبويض') {
    note.style.display = 'block';
    note.innerText = '🌟 قد تشعرين بأنك في أفضل حالاتك وقوتك!';
  } else if (val === 'أسبوع الدورة') {
    note.style.display = 'block';
    note.innerText = '💆‍♀️ استمعي لجسدك ولا تضغطي على نفسك، ولا بأس بتمرة مع قرفة!';
  } else {
    note.style.display = 'none';
  }
}

function handleWaterChange() {
  const val = parseFloat(document.getElementById('waterIntake').value);
  const note = document.getElementById('waterNote');
  if (isNaN(val) || val <= 0) { note.style.display = 'none'; return; }
  note.style.display = 'block';
  if (val < 2) note.innerText = '💧 حاولي ولو نص إضافي!';
  else if (val === 2.5) note.innerText = '✨ أنت تستطيعين نص إضافي!';
  else if (val >= 3) note.innerText = '🎉 ممتاز للغاية (إنجاز عظيم يا جميلة!)';
  else note.style.display = 'none';
}

function handleActivityTypeChange() {
  const type = document.getElementById('activityType').value;
  const gymSection = document.getElementById('gymSection');
  const cardioSection = document.getElementById('cardioSection');

  if (type === 'تمرين جيم') {
    gymSection.style.display = 'block';
    cardioSection.style.display = 'block';
  } else if (type === 'كارديو فقط') {
    gymSection.style.display = 'none';
    cardioSection.style.display = 'block';
  } else {
    gymSection.style.display = 'none';
    cardioSection.style.display = 'none';
  }
}

function toggleCustomCardio() {
  const val = document.getElementById('cardioTypeSelect').value;
  document.getElementById('customCardioGroup').style.display = val === 'custom' ? 'block' : 'none';
}

function handleGymSplitChange() {
  const split = document.getElementById('gymSplitSelect').value;
  const customGroup = document.getElementById('customGymGroup');
  const warmup = document.getElementById('warmupNote');
  const presetContainer = document.getElementById('presetExercisesList');

  customGroup.style.display = split === 'custom' ? 'block' : 'none';
  presetContainer.innerHTML = '';

  const presets = {
    'علوي': ['Lat Pulldown', 'Rows', 'Shoulder Press', 'Biceps Curls', 'Overhead Triceps Extensions'],
    'سفلي': ['Squats', 'RDL', 'Hip Thrust', 'Lunges', 'Hip Abduction']
  };

  if (split === 'علوي') {
    warmup.style.display = 'block';
    warmup.innerText = '🔥 إحماء الجزء العلوي (5-8 دقائق): دوائر الذراعين، إحماء الأكتاف، وتمدد الظهر.';
  } else if (split === 'سفلي') {
    warmup.style.display = 'block';
    warmup.innerText = '🔥 إحماء الجزء السفلي (5-8 دقائق): سكوات بدون وزن، إحماء الحوض، وتمدد الفخذين.';
  } else {
    warmup.style.display = 'none';
  }

  if (presets[split]) {
    presets[split].forEach((exName, idx) => {
      const card = document.createElement('div');
      card.className = 'exercise-card';
      card.innerHTML = `
        <span style="font-weight:bold; color:#6C5CE7;">${idx + 1}. ${exName}</span>
        <input type="hidden" name="ex_name_${idx+1}" value="${exName}">
        <div class="grid-3" style="margin-top:6px;">
          <input type="number" step="0.5" name="ex_weight_${idx+1}" placeholder="الوزن kg">
          <input type="number" name="ex_reps_${idx+1}" placeholder="العدات Reps">
          <input type="number" name="ex_sets_${idx+1}" placeholder="الجولات Sets">
        </div>
      `;
      presetContainer.appendChild(card);
    });
  }
}

let customExCount = 0;
function addCustomExerciseRow() {
  customExCount++;
  const container = document.getElementById('customExercisesContainer');
  const card = document.createElement('div');
  card.className = 'exercise-card';
  card.style.borderColor = '#B5EAD7';
  card.innerHTML = `
    <div class="form-group" style="margin-bottom:8px;">
      <input type="text" name="custom_ex_name_${customExCount}" placeholder="اسم التمرين المخصص (مثال: Cable Fly)...">
    </div>
    <div class="grid-3">
      <input type="number" step="0.5" name="custom_ex_weight_${customExCount}" placeholder="الوزن kg">
      <input type="number" name="custom_ex_reps_${customExCount}" placeholder="العدات">
      <input type="number" name="custom_ex_sets_${customExCount}" placeholder="الجولات">
    </div>
  `;
  container.appendChild(card);
}

function nextPage() {
  const name = document.getElementById('userName').value.trim();
  if (!name) { alert('الرجاء كتابة الاسم الكامل أولاً!'); return; }
  
  const week = document.getElementById('weekNumber').value;
  const day = document.getElementById('dayOfWeek').value;
  const date = document.getElementById('logDate').value;
  
  document.getElementById('fixedDisplay').innerText = `👤 ${name} | 📌 ${week} - ${day} (${date})`;
  document.getElementById('page1').classList.remove('active');
  document.getElementById('page2').classList.add('active');
  window.scrollTo(0, 0);
}

function prevPage() {
  document.getElementById('page2').classList.remove('active');
  document.getElementById('page1').classList.add('active');
  window.scrollTo(0, 0);
}

function calculateCalories() {
  const gender = document.getElementById('calcGender').value;
  const age = parseFloat(document.getElementById('calcAge').value);
  const weight = parseFloat(document.getElementById('calcWeight').value);
  const height = parseFloat(document.getElementById('calcHeight').value);
  const activity = parseFloat(document.getElementById('calcActivity').value);

  if (!age || !weight || !height) {
    alert('الرجاء إدخال كافة البيانات (العمر، الوزن، الطول) بشكل صحيح!');
    return;
  }

  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'female' ? bmr - 161 : bmr + 5;

  const tdee = Math.round(bmr * activity);
  const loss = Math.round(tdee - 500);
  const gain = Math.round(tdee + 400);

  document.getElementById('resMaintain').innerText = tdee;
  document.getElementById('resWeightLoss').innerText = loss;
  document.getElementById('resWeightGain').innerText = gain;
  document.getElementById('calcResults').style.display = 'block';
}

function sendData() {
  const name = document.getElementById('userName').value.trim();
  if (!name) { alert('الرجاء كتابة الاسم الكامل أولاً!'); return; }

  const loading = document.getElementById('loadingOverlay');
  const form = document.getElementById('visitorForm');
  loading.style.display = 'flex';

  const formData = new FormData(form);
  const searchParams = new URLSearchParams();

  for (const pair of formData.entries()) {
    searchParams.append(pair[0], pair[1]);
  }

  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: searchParams.toString()
  })
  .then(() => {
    loading.style.display = 'none';
    alert(`✨ تم حفظ البيانات بنجاح لـ (${name}) في قوقل شيت!`);
    form.reset();
    document.getElementById('cycleNote').style.display = 'none';
    document.getElementById('waterNote').style.display = 'none';
    document.getElementById('targetDisplay').style.display = 'none';
    document.getElementById('presetExercisesList').innerHTML = '';
    document.getElementById('customExercisesContainer').innerHTML = '';
    prevPage();
  })
  .catch(error => {
    loading.style.display = 'none';
    alert('حدث خطأ أثناء الإرسال: ' + error.message);
  });
}