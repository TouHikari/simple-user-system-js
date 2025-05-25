document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const registerButton = document.getElementById('registerButton');
    const messageArea = document.getElementById('messageArea');
    const passwordInput = document.getElementById('password');
    const avatarRadios = document.querySelectorAll('input[name="avatar"]');
    const userNameInput = document.getElementById('userName');
    const userRoleSelect = document.getElementById('userRole');
    const touchValInput = document.getElementById('touchVal');
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const hobbyCheckboxes = document.querySelectorAll('input[name="hobbies"]');
    const notesTextarea = document.getElementById('notes');
    const touchValLabel = document.getElementById('touchValLabel');

    const LOCAL_STORAGE_KEY = 'all_registration_data';

    if (!registrationForm || !registerButton || !messageArea || !passwordInput || avatarRadios.length === 0 || !userNameInput || !userRoleSelect || !touchValInput || genderRadios.length === 0 || hobbyCheckboxes.length === 0 || !notesTextarea || !touchValLabel) {
        console.error("Registration page essential elements not found. Aborting script execution.");
        if (registerButton) registerButton.disabled = true;
        if (messageArea) {
            messageArea.textContent = "页面加载错误：缺少必需的表单元素。请检查控制台日志。";
            messageArea.className = 'error-message';
        }
        return;
    }

    if (typeof displayMessage !== 'function') {
        console.error("displayMessage function not available. indexLoginState.js may not be loaded correctly.");
        window.displayMessage = function (msg, type) {
            const area = document.getElementById('messageArea');
            if (area) {
                area.textContent = msg;
                area.style.color = type === 'error' ? 'red' : 'green';
                if (area.timeoutId) clearTimeout(area.timeoutId);
                area.timeoutId = setTimeout(() => { area.textContent = ''; area.style.color = ''; }, type === 'success' ? 5000 : 10000);
            } else {
                console.log("Message (" + type + "): " + msg);
            }
        };
    }

    registerButton.addEventListener('click', function () {
        const userData = {};

        userData.userName = userNameInput.value.trim();

        const selectedOption = userRoleSelect.options[userRoleSelect.selectedIndex];
        userData.userRoleValue = selectedOption.value;
        userData.userRoleText = selectedOption.text;

        let selectedAvatar = null;
        for (const radio of avatarRadios) {
            if (radio.checked) {
                selectedAvatar = radio.value;
                break;
            }
        }
        userData.avatar = selectedAvatar;

        userData.touchValue = touchValInput.value.trim();
        userData.password = passwordInput.value;

        let selectedGender = null;
        for (const radio of genderRadios) {
            if (radio.checked) {
                selectedGender = radio.value;
                break;
            }
        }
        userData.gender = selectedGender;

        userData.hobbies = [];
        document.querySelectorAll('input[name="hobbies"]:checked').forEach(checkbox => {
            userData.hobbies.push(checkbox.value);
        });

        userData.notes = notesTextarea.value.trim();

        const currentLabelText = touchValLabel ? touchValLabel.textContent.replace('：', '') : '相关ID';
        if (!userData.userName || !userData.touchValue || !userData.password) {
            displayMessage(`姓名、${currentLabelText}和密码是必填项。`, 'error');
            return;
        }
        if (userData.avatar === null) {
            displayMessage("请选择一个头像。", 'error');
            return;
        }
        if (userData.gender === null) {
            displayMessage("请选择性别。", 'error');
            return;
        }

        let allUsers = [];
        const storedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (storedDataJSON) {
            try {
                allUsers = JSON.parse(storedDataJSON);
                if (!Array.isArray(allUsers)) {
                    console.warn("LocalStorage data format incorrect. Re-initializing as empty array.");
                    allUsers = [];
                }
            } catch (e) {
                console.error("Failed to parse LocalStorage data:", e);
                displayMessage("读取已保存数据失败，将创建新列表。", 'error');
                allUsers = [];
            }
        }

        const isDuplicate = allUsers.some(existingUser => {
            return existingUser.userName === userData.userName &&
                existingUser.userRoleValue === userData.userRoleValue &&
                existingUser.touchValue === userData.touchValue;
        });

        if (isDuplicate) {
            displayMessage("该用户已注册，请勿重复提交！", 'error');
            return;
        }

        userData.registrationTimestamp = Date.now();

        allUsers.push(userData);

        try {
            const updatedDataJSON = JSON.stringify(allUsers);
            localStorage.setItem(LOCAL_STORAGE_KEY, updatedDataJSON);
            displayMessage("注册成功！当前已注册用户数：" + allUsers.length, 'success');
            registrationForm.reset();
        } catch (e) {
            console.error("Failed to save data to LocalStorage:", e);
            if (e.name === 'QuotaExceededError') {
                displayMessage("保存失败：浏览器存储空间不足。", 'error');
            } else {
                displayMessage("保存失败，请检查浏览器或稍后再试。", 'error');
            }
        }
    });

    if (messageArea) {
        messageArea.textContent = '';
        messageArea.className = '';
    }
});
