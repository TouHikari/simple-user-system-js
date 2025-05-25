document.addEventListener('DOMContentLoaded', function () {
    const infoUserName = document.getElementById('infoUserName');
    const infoUserAvatar = document.getElementById('infoUserAvatar');
    const infoTouchValue = document.getElementById('infoTouchValue');
    const infoGender = document.getElementById('infoGender');
    const infoUserRole = document.getElementById('infoUserRole');
    const infoHobbies = document.getElementById('infoHobbies');
    const infoNotes = document.getElementById('infoNotes');
    const messageArea = document.getElementById('messageArea');
    const infoTable = document.querySelector('#info-table');
    const CURRENT_USER_STORAGE_KEY = 'current_user';
    const avatarImagesMap = {
        '1': '../imgs/pixel_cactus.jpg',
        '2': '../imgs/pixel_orange.jpg',
        '3': '../imgs/pixel_travelfrog.jpg'
    };

    const currentUserJSON = sessionStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (currentUserJSON) {
        try {
            const currentUser = JSON.parse(currentUserJSON);

            if (currentUser && typeof currentUser === 'object' && currentUser.userName && currentUser.userRoleValue && currentUser.touchValue) {
                if (infoUserName && infoTouchValue && infoGender && infoUserRole && infoHobbies && infoNotes && infoUserAvatar && infoTable) {
                    infoUserName.textContent = currentUser.userName || 'N/A';
                    infoTouchValue.textContent = currentUser.touchValue || 'N/A';

                    let genderText = 'N/A';
                    if (currentUser.gender === '1') genderText = '男';
                    else if (currentUser.gender === '0') genderText = '女';
                    infoGender.textContent = genderText;

                    infoUserRole.textContent = currentUser.userRoleText || `Role ${currentUser.userRoleValue}`;

                    const hobbiesText = (Array.isArray(currentUser.hobbies) && currentUser.hobbies.length > 0) ? currentUser.hobbies.join(', ') : '无';
                    infoHobbies.textContent = hobbiesText;

                    infoNotes.textContent = currentUser.notes || '无';

                    const avatarValue = currentUser.avatar;
                    const avatarSrc = avatarImagesMap[avatarValue];
                    if (avatarSrc) {
                        infoUserAvatar.src = avatarSrc;
                        infoUserAvatar.style.display = 'inline-block';
                    } else {
                        infoUserAvatar.style.display = 'none';
                        infoUserAvatar.src = '';
                    }

                    infoTable.style.display = '';

                } else {
                    console.error("INFO: Some required elements for displaying user info table were not found in the HTML.");
                    if (infoTable) infoTable.style.display = '';
                }

            } else {
                console.error("Invalid or incomplete user data format in sessionStorage.");
                sessionStorage.removeItem(CURRENT_USER_STORAGE_KEY);
                handleNotLoggedIn();
            }

        } catch (e) {
            console.error("Error parsing user data from sessionStorage:", e);
            sessionStorage.removeItem(CURRENT_USER_STORAGE_KEY);
            handleNotLoggedIn();
        }

    } else {
        handleNotLoggedIn();
    }

    function handleNotLoggedIn() {
        if (typeof displayMessage !== 'function') {
            console.error("displayMessage function not available. indexLoginState.js may not be loaded correctly.");
            alert("您尚未登录，请先登录！3秒后跳转至登录页...");
        } else {
            displayMessage("您尚未登录，请先登录！3秒后跳转至登录页...", 'error');
        }

        if (infoTable) {
            infoTable.style.display = 'none';
        }

        setTimeout(() => {
            window.location.href = '../htmls/login.html';
        }, 3000);
    }

    if (messageArea) {
        messageArea.textContent = '';
        messageArea.className = '';
    }
});