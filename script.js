document.addEventListener('DOMContentLoaded', () => {
    // === STARTER PANEL ELEMENTS (VERIFICATION CONTROLS) ===
    const starterStep = document.getElementById('starterStep');
    const verifyBtn = document.getElementById('verifyBtn');
    const mainForm = document.getElementById('jobForm');

    const twStudentYes = document.getElementById('twStudentYes');
    const twStudentNo = document.getElementById('twStudentNo');
    const twStudentFields = document.getElementById('twStudentFields');
    const studentIdInput = document.getElementById('student_id');

    const otherStudentFields = document.getElementById('otherStudentFields');
    const doneTallyYes = document.getElementById('doneTallyYes');
    const doneTallyNo = document.getElementById('doneTallyNo');
    const otherInstituteDetails = document.getElementById('otherInstituteDetails');

    const otherInstituteName = document.getElementById('other_institute_name');
    const otherInstituteCity = document.getElementById('other_institute_city');
    const courseCompletionPeriod = document.getElementById('course_completion_period');

    // === EXPERIENCE ELEMENTS ===
    const fresherRadio = document.getElementById('fresherRadio');
    const expRadio = document.getElementById('expRadio');
    const expFieldsPanel = document.getElementById('expFieldsPanel');
    const expYears = document.getElementById('expYears');
    const expMonths = document.getElementById('expMonths');
    const workPlace = document.getElementById('workPlace');
    const workProfile = document.getElementById('workProfile');

    // === FORM & INTERACTIVE UI ELEMENTS ===
    const declarationCheck = document.getElementById('declarationCheck');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.getElementById('progressBar');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // === CV UPLOAD ELEMENTS ===
    const fileInput = document.getElementById('cv_file_input');
    const uploadZone = document.getElementById('uploadZone');
    const fileNameDisplay = document.getElementById('file-name-display');
    const fileNameText = document.getElementById('fileNameText');

    // Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycby91GaIiIISKjqPyExQRjkYw6Whr6w8pgJ0lo02jeqIyba2WaFY6ykXqAD270PqXWRZ/exec';

    // ==========================================
    // SMOOTH SCROLL & LIVE RED OUTLINE ENGINE
    // ==========================================
    function highlightError(element) {
        if (!element) return;
        
        // Red outline class lagayein
        element.classList.add('validation-error');
        
        // Smooth scroll to element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Agar direct input field hai to focus set karein
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
            element.focus();
        }

        // Live Cleanup: Jaise hi user input badle, red outline turant hat jaye
        const clearError = () => {
            element.classList.remove('validation-error');
            element.removeEventListener('input', clearError);
            element.removeEventListener('change', clearError);
        };
        element.addEventListener('input', clearError);
        element.addEventListener('change', clearError);
    }

    // ==========================================
    // DYNAMIC POPUP & LOADER MANAGER (ONLY FOR SERVER STATUS / SUCCESS)
    // ==========================================
    function showCustomPopup(title, message, isError = true) {
        const modalTitle = successModal.querySelector('h2') || successModal.querySelector('.modal-title');
        const modalText = successModal.querySelector('p') || successModal.querySelector('.modal-text');
        const modalIcon = successModal.querySelector('.modal-icon') || successModal.querySelector('i');
        
        if (modalTitle) modalTitle.innerText = title;
        if (modalText) modalText.innerText = message;
        
        if (modalIcon) {
            modalIcon.className = isError ? "fas fa-exclamation-triangle" : "fas fa-check-circle";
            modalIcon.style.color = isError ? "#e74c3c" : "#2e8d47";
            modalIcon.style.fontSize = "3rem";
        }
        
        if (closeModalBtn) closeModalBtn.style.display = 'inline-block';
        successModal.classList.add('active');
    }

    function showPopupLoader(message) {
        const modalTitle = successModal.querySelector('h2') || successModal.querySelector('.modal-title');
        const modalText = successModal.querySelector('p') || successModal.querySelector('.modal-text');
        const modalIcon = successModal.querySelector('.modal-icon') || successModal.querySelector('i');
        
        if (modalTitle) modalTitle.innerText = "Please Wait...";
        if (modalText) modalText.innerText = message;
        if (modalIcon) {
            modalIcon.className = "fas fa-spinner fa-spin";
            modalIcon.style.color = "#2b3a8d";
            modalIcon.style.fontSize = "3rem";
        }
        
        if (closeModalBtn) closeModalBtn.style.display = 'none';
        successModal.classList.add('active');
    }

    function hideCustomPopup() {
        successModal.classList.remove('active');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideCustomPopup);
    }

    // ==========================================
    // 1. STARTER PANEL CONTROLS & LOGIC
    // ==========================================
    function evaluateStarterState() {
        if (twStudentYes.checked) {
            twStudentFields.classList.remove('hidden-element');
            otherStudentFields.classList.add('hidden-element');
            studentIdInput.required = true;
            resetOtherInstituteFields(false);
        } else if (twStudentNo.checked) {
            twStudentFields.classList.add('hidden-element');
            otherStudentFields.classList.remove('hidden-element');
            studentIdInput.required = false;
            studentIdInput.value = '';
            evaluateOtherInstituteState();
        } else {
            twStudentFields.classList.add('hidden-element');
            otherStudentFields.classList.add('hidden-element');
        }
        calculateFormProgress();
    }

    function evaluateOtherInstituteState() {
        if (twStudentNo.checked && doneTallyYes.checked) {
            otherInstituteDetails.classList.remove('hidden-element');
            resetOtherInstituteFields(true);
        } else {
            otherInstituteDetails.classList.add('hidden-element');
            resetOtherInstituteFields(false);
        }
        calculateFormProgress();
    }

    function resetOtherInstituteFields(isReadOnly) {
        otherInstituteName.required = isReadOnly;
        otherInstituteCity.required = isReadOnly;
        courseCompletionPeriod.required = isReadOnly;

        if (!isReadOnly) {
            otherInstituteName.value = '';
            otherInstituteCity.value = '';
            courseCompletionPeriod.value = '';
        }
    }

    twStudentYes.addEventListener('change', evaluateStarterState);
    twStudentNo.addEventListener('change', evaluateStarterState);
    doneTallyYes.addEventListener('change', evaluateOtherInstituteState);
    doneTallyNo.addEventListener('change', evaluateOtherInstituteState);

    verifyBtn.addEventListener('click', () => {
        const starterContainer = document.querySelector('.starter-radio-group') || starterStep;
        
        if (!twStudentYes.checked && !twStudentNo.checked) {
            highlightError(starterContainer);
            return;
        }

        if (twStudentYes.checked) {
            const studentIdValue = studentIdInput.value.trim();
            if (!studentIdValue) {
                highlightError(studentIdInput);
                return;
            }

            showPopupLoader("Verifying Student ID...");
            const verificationURL = `${scriptURL}?action=verifyStudent&student_id=${encodeURIComponent(studentIdValue)}`;

            fetch(verificationURL)
                .then(response => response.json())
                .then(data => {
                    hideCustomPopup();
                    if (data.status === "valid") {
                        unlockMainForm();
                    } else if (data.status === "duplicate") {
                        showCustomPopup("Submission Blocked", data.message, true);
                    } else {
                        highlightError(studentIdInput);
                        showCustomPopup("ID Not Found", "The entered Student ID is invalid or not registered. Please verify and try again.", true);
                    }
                })
                .catch(error => {
                    console.error("Verification Error:", error);
                    hideCustomPopup();
                    showCustomPopup("Network Error", "Network error ya takniki dikkat! Kripya dobara koshish karein.", true);
                });

        } else {
            const doneTallyContainer = document.querySelector('.done-tally-group') || otherStudentFields;
            if (!doneTallyYes.checked && !doneTallyNo.checked) {
                highlightError(doneTallyContainer);
                return;
            }
            if (doneTallyYes.checked) {
                if (!otherInstituteName.value.trim()) { highlightError(otherInstituteName); return; }
                if (!otherInstituteCity.value.trim()) { highlightError(otherInstituteCity); return; }
                if (!courseCompletionPeriod.value) { highlightError(courseCompletionPeriod); return; }
            }
            unlockMainForm();
        }
    });

    function unlockMainForm() {
        mainForm.style.display = 'block';
        mainForm.classList.remove('main-form-locked');
        verifyBtn.innerHTML = `<span>Continue</span> <i class="fas fa-lock-open"></i>`;
        verifyBtn.disabled = true;

        starterStep.querySelectorAll('input, select').forEach(el => el.disabled = true);

        calculateFormProgress();
        mainForm.scrollIntoView({ behavior: 'smooth' });
    }

    // ==========================================
    // 2. EXPERIENCE MODULE LOGIC
    // ==========================================
    function evaluateExperienceState() {
        if (expRadio.checked) {
            expFieldsPanel.classList.add('show-panel');
            expYears.required = true;
            expMonths.required = true;
            workPlace.required = true;
            workProfile.required = true;
        } else {
            expFieldsPanel.classList.remove('show-panel');
            expYears.required = false;
            expMonths.required = false;
            workPlace.required = false;
            workProfile.required = false;

            expYears.value = '';
            expMonths.value = '';
            workPlace.value = '';
            workProfile.value = '';
        }
        calculateFormProgress();
    }

    fresherRadio.addEventListener('change', evaluateExperienceState);
    expRadio.addEventListener('change', evaluateExperienceState);

    declarationCheck.addEventListener('change', () => {
        submitBtn.disabled = !declarationCheck.checked;
    });

    // ==========================================
    // 3. SMART CHECKBOX LOCK SYSTEM ENGINE (STABLE SELECTORS)
    // ==========================================
    function setupCheckboxLockEngine(groupSelectors, noneInputSelector) {
        const checkboxes = mainForm.querySelectorAll(groupSelectors);
        const noneCheckbox = mainForm.querySelector(noneInputSelector);

        if (!noneCheckbox || checkboxes.length === 0) return;

        function updateLockState() {
            if (noneCheckbox.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== noneCheckbox) {
                        cb.checked = false;
                        cb.disabled = true;
                        const parentNode = cb.closest('.pref-item-node') || cb.closest('label');
                        if (parentNode) parentNode.style.opacity = '0.5';
                    }
                });
            } else {
                let anyRegularChecked = Array.from(checkboxes).some(cb => cb !== noneCheckbox && cb.checked);

                checkboxes.forEach(cb => {
                    if (cb !== noneCheckbox) {
                        cb.disabled = false;
                        const parentNode = cb.closest('.pref-item-node') || cb.closest('label');
                        if (parentNode) parentNode.style.opacity = '1';
                    }
                });

                if (anyRegularChecked) {
                    noneCheckbox.checked = false;
                    noneCheckbox.disabled = true;
                    const noneParent = noneCheckbox.closest('.pref-item-node') || noneCheckbox.closest('label');
                    if (noneParent) noneParent.style.opacity = '0.5';
                } else {
                    noneCheckbox.disabled = false;
                    const noneParent = noneCheckbox.closest('.pref-item-node') || noneCheckbox.closest('label');
                    if (noneParent) noneParent.style.opacity = '1';
                }
            }
            calculateFormProgress();
        }

        noneCheckbox.addEventListener('change', updateLockState);
        checkboxes.forEach(cb => {
            if (cb !== noneCheckbox) {
                cb.addEventListener('change', updateLockState);
            }
        });
    }

    setupCheckboxLockEngine('.english-checkbox, input[name="english_knowledge[]"]', 'input[name="english_none"], #englishNone');
    setupCheckboxLockEngine('.computer-checkbox, .comp-checkbox, input[name="computer_knowledge[]"]', 'input[value="None"][name="computer_knowledge[]"], input[name="computer_none"], #compNone');
    setupCheckboxLockEngine('.typing-checkbox, input[name="typing_skills[]"]', 'input[value="None"][name="typing_skills[]"], input[name="typing_none"], #typingNone');
    setupCheckboxLockEngine('.accounting-checkbox, .acc-checkbox, input[name="accounting_knowledge[]"]', 'input[value="None"][name="accounting_knowledge[]"], input[name="accounting_none"], #accNone');


    // ==========================================
    // 4. FILE UPLOAD DISK HANDLER ENGINE
    // ==========================================
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (file.size > 4 * 1024 * 1024) {
                    showCustomPopup("File Size Warning", "File size bahut badi hai! Maximum limit 4MB hai.", true);
                    fileInput.value = '';
                    if (fileNameDisplay) fileNameDisplay.style.display = 'none';
                    if (uploadZone) {
                        uploadZone.style.borderColor = '#b5bfd2';
                        uploadZone.style.background = 'rgba(43, 58, 141, 0.03)';
                    }
                    return;
                }
                if (fileNameText) fileNameText.textContent = file.name;
                if (fileNameDisplay) fileNameDisplay.style.display = 'block';
                if (uploadZone) {
                    uploadZone.classList.remove('validation-error'); // Error outline hatao agar user ne file attach kar di
                    uploadZone.style.borderColor = 'var(--accent, #2e8d47)';
                    uploadZone.style.background = 'rgba(46, 141, 71, 0.02)';
                }
            } else {
                if (fileNameDisplay) fileNameDisplay.style.display = 'none';
                if (uploadZone) {
                    uploadZone.style.borderColor = '#b5bfd2';
                    uploadZone.style.background = 'rgba(43, 58, 141, 0.03)';
                }
            }
            calculateFormProgress();
        });
    }

    // ==========================================
    // 5. PROGRESS CALIBRATION ALGORITHM
    // ==========================================
    function calculateFormProgress() {
        if (window.getComputedStyle(mainForm).display === 'none') return;

        const requiredElements = mainForm.querySelectorAll('input[required], select[required], textarea[required]');
        let validationCounter = 0;
        const checkedRadioGroups = new Set();

        requiredElements.forEach(element => {
            if (element.disabled) return; 

            if (element.type === 'radio') {
                const groupName = element.name;
                if (groupName && !checkedRadioGroups.has(groupName)) {
                    const checkedNode = mainForm.querySelector(`input[name="${groupName}"]:checked`);
                    if (checkedNode) {
                        validationCounter++;
                        checkedRadioGroups.add(groupName);
                    }
                }
            } else if (element.type === 'checkbox') {
                if (element.checked) validationCounter++;
            } else if (element.type === 'file') {
                if (element.files.length > 0) validationCounter++;
            } else if (element.value && element.value.trim() !== '') {
                validationCounter++;
            }
        });

        let uniqueRequiredCount = 0;
        const countedRadioGroups = new Set();

        requiredElements.forEach(element => {
            if (element.disabled) return;

            if (element.type === 'radio') {
                const groupName = element.name;
                if (groupName && !countedRadioGroups.has(groupName)) {
                    uniqueRequiredCount++;
                    countedRadioGroups.add(groupName);
                }
            } else {
                uniqueRequiredCount++;
            }
        });

        const completePercentage = uniqueRequiredCount > 0 ? (validationCounter / uniqueRequiredCount) * 100 : 0;
        if (progressBar) progressBar.style.width = `${Math.min(completePercentage, 100)}%`;
    }

    mainForm.addEventListener('input', calculateFormProgress);
    mainForm.addEventListener('change', calculateFormProgress);

    // ==========================================
    // 6. SERVER SUBMISSION PROCESS & VALIDATIONS
    // ==========================================
    mainForm.addEventListener('submit', e => {
        e.preventDefault();

        // 0. BROAD HTML5 REQUIRED VALIDATION CHECK
        const missingField = mainForm.querySelector('input[required]:invalid, select[required]:invalid, textarea[required]:invalid');
        if (missingField) {
            highlightError(missingField.closest('.form-group') || missingField);
            return;
        }

        // 1. VALIDATION FOR ENGLISH KNOWLEDGE
        const englishBoxes = mainForm.querySelectorAll('.english-checkbox, input[name="english_knowledge[]"], input[name="english_none"]');
        let isEnglishSelected = false;
        englishBoxes.forEach(box => { if (box.checked) isEnglishSelected = true; });

        if (!isEnglishSelected) {
            const section = mainForm.querySelector('input[name="english_none"]')?.closest('.form-group') || mainForm.querySelector('.english-checkbox')?.closest('.form-group') || mainForm;
            highlightError(section);
            return;
        }

        // 2. VALIDATION FOR COMPUTER KNOWLEDGE
        const computerBoxes = mainForm.querySelectorAll('.computer-checkbox, .comp-checkbox, input[name="computer_knowledge[]"]');
        let isComputerSelected = false;
        computerBoxes.forEach(box => { if (box.checked) isComputerSelected = true; });

        if (!isComputerSelected) {
            const section = mainForm.querySelector('#compNone')?.closest('.form-group') || mainForm.querySelector('.comp-checkbox')?.closest('.form-group') || mainForm;
            highlightError(section);
            return;
        }

        // 3. VALIDATION FOR TYPING SKILLS
        const typingBoxes = mainForm.querySelectorAll('.typing-checkbox, input[name="typing_skills[]"]');
        let isTypingSelected = false;
        typingBoxes.forEach(box => { if (box.checked) isTypingSelected = true; });

        if (!isTypingSelected) {
            const section = mainForm.querySelector('#typingNone')?.closest('.form-group') || mainForm.querySelector('.typing-checkbox')?.closest('.form-group') || mainForm;
            highlightError(section);
            return;
        }

        // 4. VALIDATION FOR ACCOUNTING / TAXATION KNOWLEDGE
        const accountingBoxes = mainForm.querySelectorAll('.accounting-checkbox, .acc-checkbox, input[name="accounting_knowledge[]"]');
        let isAccountingSelected = false;
        accountingBoxes.forEach(box => { if (box.checked) isAccountingSelected = true; });

        if (!isAccountingSelected) {
            const section = mainForm.querySelector('#accNone')?.closest('.form-group') || mainForm.querySelector('.acc-checkbox')?.closest('.form-group') || mainForm;
            highlightError(section);
            return;
        }

        // 5. VALIDATION FOR CV UPLOAD
        if (!fileInput || fileInput.files.length === 0) {
            highlightError(uploadZone);
            return;
        }

        // 6. VALIDATION FOR DECLARATION CHECKBOX
        if (!declarationCheck.checked) {
            const container = declarationCheck.closest('.disclaimer-container') || declarationCheck.parentElement;
            highlightError(container);
            return;
        }

        // Yahan se submission aur backend 4-field verification shuru hoga
        showPopupLoader("Verifying details & submitting profile...");

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Processing...</span> <i class="fas fa-spinner fa-spin"></i>`;

        const applicationPayload = {};

        // Capture starter step fields (Kyunki ye disabled ho chuke hain, isliye direct query se data nikalna padega)
        applicationPayload['is_tally_world_student'] = twStudentYes.checked ? "Yes" : (twStudentNo.checked ? "No" : "");
        applicationPayload['student_id'] = studentIdInput.value.trim() || '';
        applicationPayload['has_done_tally'] = doneTallyYes.checked ? "Yes" : (doneTallyNo.checked ? "No" : "");
        applicationPayload['other_institute_name'] = otherInstituteName.value.trim() || '';
        applicationPayload['other_institute_city'] = otherInstituteCity.value.trim() || '';
        applicationPayload['course_completion_period'] = courseCompletionPeriod.value || '';

        // Process remaining active form entries
        const formDataEntries = new FormData(mainForm);
        formDataEntries.forEach((value, key) => {
            if (key !== 'cv_file_input') {
                if (key.endsWith('[]')) {
                    if (!applicationPayload[key]) applicationPayload[key] = [];
                    applicationPayload[key].push(value);
                } else {
                    applicationPayload[key] = value;
                }
            }
        });

        // Convert array checkboxes into string format for Google Sheets compatibility
        for (const key in applicationPayload) {
            if (Array.isArray(applicationPayload[key])) {
                applicationPayload[key] = applicationPayload[key].join(', ');
            }
        }

        // Handle CV attachment processing
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const base64String = event.target.result.split(',')[1];
                applicationPayload['cv_file'] = base64String;
                applicationPayload['cv_name'] = file.name;
                applicationPayload['cv_mime'] = file.type;

                sendDataToServer(applicationPayload);
            };
            reader.readAsDataURL(file);
        } else {
            sendDataToServer(applicationPayload);
        }
    });

    function sendDataToServer(payloadData) {
        const formBodyData = [];
        for (const property in payloadData) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(payloadData[property]);
            formBodyData.push(encodedKey + "=" + encodedValue);
        }
        const parsedBodyString = formBodyData.join("&");

        fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: parsedBodyString
        })
            .then(response => response.json())
            .then(data => {
                hideCustomPopup();

                if (data.result === 'success') {
                    showCustomPopup("Application Submitted!", "Your application has been successfully submitted. The Tally World Morena Placement team will get in touch with you soon.", false);

                    // Complete Clean Reset Process
                    mainForm.reset();
                    mainForm.style.display = 'none';
                    mainForm.classList.add('main-form-locked');

                    starterStep.querySelectorAll('input, select').forEach(el => el.disabled = false);
                    twStudentYes.checked = false;
                    twStudentNo.checked = false;
                    doneTallyYes.checked = false;
                    doneTallyNo.checked = false;
                    studentIdInput.value = '';
                    
                    evaluateStarterState();
                    verifyBtn.disabled = false;
                    verifyBtn.innerHTML = `<span>Continue</span> <i class="fas fa-arrow-right plane-icon"></i>`;

                    // Reset all opacity and checkboxes back to original state on successful submit
                    mainForm.querySelectorAll('.pref-item-node, label').forEach(node => node.style.opacity = '1');
                    mainForm.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.disabled = false);

                    if (fileNameDisplay) fileNameDisplay.style.display = 'none';
                    if (uploadZone) {
                        uploadZone.style.borderColor = '#b5bfd2';
                        uploadZone.style.background = 'rgba(43, 58, 141, 0.03)';
                    }
                    evaluateExperienceState();
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<span>Submit Application</span> <i class="fas fa-paper-plane plane-icon"></i>`;
                } else {
                    // Agar backend se verification failed ya mismatch error aaya
                    showCustomPopup("Verification Failed", data.error || "Details verification fail ho gaya hai.", true);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Submit Application</span> <i class="fas fa-paper-plane plane-icon"></i>`;
                }
            })
            .catch(error => {
                hideCustomPopup();
                console.error('Error!', error.message);
                showCustomPopup("Submission Error", "Something went wrong. Please check your network connection.", true);
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Submit Application</span> <i class="fas fa-paper-plane plane-icon"></i>`;
            })
            .finally(() => {
                calculateFormProgress();
            });
    }
});