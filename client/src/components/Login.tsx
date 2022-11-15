import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        localStorage.setItem("userId", username);
        setUsername("");
        navigate("/tasks");
    };
    return (
        <div className='login__container'>
            <form className='login__form' onSubmit={handleLogin}>
                <label htmlFor='username'>Provide a username</label>
                <input
                    type='text'
                    name='username'
                    id='username'
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
                <button>SIGN IN</button>
            </form>
        </div>
    );
};

export default Login;