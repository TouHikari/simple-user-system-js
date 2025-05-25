document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const messageArea = document.getElementById('messageArea');
    const userInfoArea = document.getElementById('userInfoArea');
    const logoutButton = document.getElementById('logoutButton');
    const touchValLabel = document.getElementById('touchValLabel');
    const userRoleSelect = document.getElementById('userRole');
    const touchValInput = document.getElementById('touchVal');
    const passwordInput = document.getElementById('password');
    const ALL_USERS_STORAGE_KEY = 'all_registration_data';
    const CURRENT_USER_STORAGE_KEY = 'current_user';
    const avatarImagesMap = {
        '1': '../imgs/pixel_cactus.jpg',
        '2': '../imgs/pixel_orange.jpg',
        '3': '../imgs/pixel_travelfrog.jpg'
    };

    if (!loginForm || !loginButton || !messageArea || !userInfoArea || !logoutButton || !touchValLabel || !userRoleSelect || !touchValInput || !passwordInput) {
        console.error("Login page essential elements not found. Aborting script execution.");
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

    function updateTouchField() {
        const selectedValue = userRoleSelect.value;
        let labelText = '';
        let placeholderText = '';
        switch (selectedValue) {
            case '1': // Administrator
                labelText = 'ID：';
                placeholderText = '输入ID';
                break;
            case '2': // Teacher
                labelText = '工号：';
                placeholderText = '输入工号';
                break;
            case '3': // Student
                labelText = '学号：';
                placeholderText = '输入学号';
                break;
            case '4': // Staff
                labelText = '工号：';
                placeholderText = '输入工号';
                break;
            default:  // Fallback
                labelText = '学号：';
                placeholderText = '输入学号';
                break;
        }
        touchValLabel.textContent = labelText;
        touchValInput.placeholder = placeholderText;
    }

    userRoleSelect.addEventListener('change', updateTouchField);

    loginButton.addEventListener('click', function () {
        const inputUserName = document.getElementById('userName').value.trim();
        const inputUserRoleValue = userRoleSelect.value;
        const inputTouchValue = touchValInput.value.trim();
        const inputPassword = passwordInput.value;

        const currentLabelText = touchValLabel.textContent.replace('：', '');

        if (!inputUserName || !inputTouchValue || !inputPassword) {
            displayMessage(`请输入姓名、${currentLabelText}和密码。`, 'error');
            return;
        }

        const storedDataJSON = localStorage.getItem(ALL_USERS_STORAGE_KEY);
        let allUsers = [];

        if (storedDataJSON) {
            try {
                allUsers = JSON.parse(storedDataJSON);
                if (!Array.isArray(allUsers)) {
                    console.warn("LocalStorage data format incorrect. Initializing as empty array.");
                    allUsers = [];
                }
            } catch (e) {
                console.error("Failed to parse LocalStorage data:", e);
                displayMessage("读取注册数据失败，无法登录。", 'error');
                return;
            }
        }

        if (allUsers.length === 0) {
            displayMessage("数据库中没有注册用户，请先注册。", 'error');
            return;
        }

        const foundUser = allUsers.find(user => {
            return user.userName === inputUserName &&
                user.userRoleValue === inputUserRoleValue &&
                user.touchValue === inputTouchValue &&
                user.password === inputPassword;
        });

        if (foundUser) {
            displayMessage("登录成功！即将跳转至首页...", 'success');

            try {
                sessionStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(foundUser));
                loginForm.reset();
                setTimeout(() => { window.location.href = '../index.html'; }, 2000);
            } catch (e) {
                console.error("Failed to save current user to SessionStorage:", e);
                displayMessage("登录状态保存失败，请稍后再试。", 'error');
            }

        } else {
            displayMessage(`登录失败：用户名、身份、${currentLabelText}或密码不匹配。`, 'error');
        }
    });

    updateTouchField();

    if (messageArea) {
        messageArea.textContent = '';
        messageArea.className = '';
    }
});