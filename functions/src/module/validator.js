module.exports = {
    emailValidator: (str) => {
        const email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        console.log('🐯',email.test(str));
        if (!email.test(str)) return false;
        else return true;
    },

    passwordValidator: (pwd) => {
        const password = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,64}$/;
        if (!password.test(pwd)) return false;
        else return true;
    },
};