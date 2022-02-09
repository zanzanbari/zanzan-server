module.exports = class UserService {
    constructor(User) {
        this.User = User;
    }

    createUser(email, idFirebase, nickname) {
        const user = this.User.create({
            email,
            idFirebase,
            nickname,
        });
        return user;
    }
    findOneUser(idFirebase) {
        const user = this.User.findOne({ where: { idFirebase } });
        return user;
    }
    updateToken(token, idFirebase) {
        const user = this.User.update({
            refreshtoken: token,
        }, {
            where: { idFirebase },
        });
        return user;
    }
}