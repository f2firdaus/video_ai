"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password,setPassword]=useState("")
    const [confirmPassword, setconfirmPassword] = useState("");
    const router = useRouter();

    
    const handleSubmit =async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim().length !== 0 || password.trim().length !== 0
        || confirmPassword.trim().length!==0
        ) {
            
       
        if (password !== confirmPassword) {
            alert("Passsword Not matched");
            return;
        }
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
             
              
            })
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Registration Failed");
                
            }
            router.push("/login")

        } catch (error) {
            console.log(error)
        }
 }
    }
  return (
      <div>
          <form onSubmit={handleSubmit} >
              <input type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" name='password' value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />
              <input type="password" name='confirmpassword' value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} />
              <button type='submit'>Register</button>
              <div>
                  <p>Already Have an Account</p>
                  <a href="/login">Login</a>
              </div>
          </form>
    </div>
  )
}

export default RegisterPage