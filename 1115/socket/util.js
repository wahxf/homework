module.exports = {
    isName(str) {
        return /^\w{3,8}$/ig.test(str)
    },
    isPassword(str) {
        return /^\d{2,8}$/ig.test(str)
    }
}