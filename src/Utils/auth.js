
export const Auth = {
    getUser() {
        return JSON.parse(localStorage.getItem("user"));

    },

    logout() {
        localStorage.removeItem("user");
    },

};
