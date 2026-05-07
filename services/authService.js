export default function authService(){
    const isAuthenticated = () =>{
        return localStorage.getItem('token') !== null;
    }
}