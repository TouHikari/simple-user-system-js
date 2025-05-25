document.addEventListener('DOMContentLoaded', function () {
    const userRoleSelect = document.getElementById('userRole');
    const touchValInput = document.getElementById('touchVal');
    const touchValLabel = document.getElementById('touchValLabel');

    if (!userRoleSelect || !touchValInput || !touchValLabel) {
        console.error("Required elements for setting touch field label (userRoleSelect, touchValInput, or touchValLabel) not found. Aborting script execution.");
        return;
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
    updateTouchField();
});
