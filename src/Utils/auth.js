export const Auth = {
    login(userData) {
        localStorage.setItem("user", JSON.stringify(userData));
    },

    getUser() {
        return JSON.parse(localStorage.getItem("user"));
        
    },

    logout() {
        localStorage.removeItem("user");
    },

    isLoggedIn() {
        return !!localStorage.getItem("user");
    }
};
