import Cookies from 'js-cookie';

export default {
    checkAuth: () => {
        const session = Cookies.get("session");
        if(session){
            return true;
        }
        return false;
    }
}