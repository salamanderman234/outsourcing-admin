export default {
    checkAuth: () => {
        const user = localStorage.getItem("user");
        return user && true;
    }
}