import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './style.css';

function LoginRegisterTabs() {
    const [isActive, setIsActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [rememberMe, setRememberMe] = useState(false); 
    const [termsAccepted, setTermsAccepted] = useState(false); 
    const [error, setError] = useState('');
    const [registerError, setRegisterError] = useState(''); 
    const navigate = useNavigate(); 

    const handleRegisterClick = () => {
        setIsActive(true); 
    };

    const handleLoginClick = () => {
        setIsActive(false); 
    };

    const handleSignIn = () => {
        
        if (email === '' || password === '') {
            setError('Please enter both email and password');
        } else {
            setError('');
            if (rememberMe) {
                console.log('Remember Me checked: Store session logic here');
            }
            navigate('/home'); 
        }
    };

    const handleCreateAccount = () => {
        let hasError = false; 


        if (name === '') {
            hasError = true;
        }
        if (email === '') {
            hasError = true;
        }
        if (password === '') {
            hasError = true;
        }
        if (!termsAccepted) {
            hasError = true;
        }

        if (hasError) {
            setRegisterError('Please fill in all fields and accept the terms and conditions');
        } else {
            setRegisterError(''); 
            console.log('Account created successfully');
        }
    };

    return (
        <div className="page-container">
            <div className={`container ${isActive ? "active" : ""}`} id="container">
                {/* Register Form */}
                <div className="form-container sign-up">
                    <form>
                        <h1>Create Account</h1>
                        <div className="social-icons">
                            <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                            className={name === '' && registerError ? 'input-error' : ''}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            className={email === '' && registerError ? 'input-error' : ''}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            className={password === '' && registerError ? 'input-error' : ''}
                        />
                        <div className="terms-container">
                            <input
                                type="checkbox"
                                id="termsAccepted"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <label htmlFor="termsAccepted">
                                I certify that I am at least 18 years old and that I agree to the <a href="/terms">Terms and Policies</a> and <a href="/privacy">Privacy Policy</a>.
                            </label>
                        </div>

                        {registerError && <p className="error-message">{registerError}</p>} {/* Display registration error */}
                        <button type="button" onClick={handleCreateAccount}>Sign Up</button>
                    </form>
                </div>

                {/* Login Form */}
                <div className="form-container sign-in">
                    <form>
                        <h1>Sign In</h1>
                        <div className="social-icons">
                            <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your email password</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        {error && <p className="error-message">{error}</p>} {/* Display error if present */}
                        
                        {/* Remember Me and Forgot Password in one row */}
                        <div className="form-actions">
                            <div className="remember-me-container">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="rememberMe">Remember Me</label>
                            </div>
                            <a href="#">Forgot Your Password?</a>
                        </div>

                        <button type="button" onClick={handleSignIn}>Sign In</button> {/* Handle sign in */}
                    </form>
                </div>

                {/* Toggle Panel */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <img src={require('./logo_wide_white.png')} alt="Logo" className="logo" />
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of our features</p>
                            <button className="hidden" id="login" onClick={handleLoginClick}>Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <img src={require('./logo_wide_white.png')} alt="Logo" className="logo" />
                            <h1>Hello, Doer!</h1>
                            <p>Register with your personal details to use all of our features</p>
                            <button className="hidden" id="register" onClick={handleRegisterClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginRegisterTabs;
