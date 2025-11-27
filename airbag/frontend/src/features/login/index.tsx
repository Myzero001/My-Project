import { useEffect, useRef, useState } from "react";
import { postLogin, getAuthStatus } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

export default function LoginFeature() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const redirect = (roleName: string) => {
    if(roleName == 'Admin' || roleName == "Owner" || roleName == "Manager" || roleName == "Technician"){
      navigate("/dashboardQuotationCustomer");
    } else if(roleName == "Sale"){
      navigate("/quotation");
    } else if(roleName == "Account") {
      navigate("/ms-customer");
    } else if(roleName == "User-ซ่อม" || roleName == "User-ถอด/ประกอบ" || roleName == "User-Box"){
      navigate("/ms-repair-receipt");
    } else {
      navigate("/");
    }
    // 
  }
  useEffect(() => {
    getAuthStatus()
      .then((response) => {
        if (response.statusCode === 200) {
          if(response.message == "User authenticated successfully"){
            const roleName = response.responseObject.role_name;
            redirect(roleName);
          }
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error.message);
      });
  }, []);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!username) {
      alert("Please enter a username.");
      return;
    }
    if (!password) {
      alert("Please enter a password.");
      return;
    }
    try {
      postLogin({ username: username, password: password })
      .then((response) => {
        if (response.statusCode === 200) {
          const roleName = response.responseObject.role_name;
          redirect(roleName);
        } else if (response.statusCode === 400) {
          alert(response.message);
        } else {
          alert(`Unexpected error: ${response.message}`);
        }
      })
    } catch(error) {
        console.error(
          "Error creating category:",
          error.response?.data || error.message
        );
        alert("Failed to log in. Please try again.");
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/images/bg-login2.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl  " >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text drop-shadow-lg">
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-6">
          {/* Username Field */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600">
              Username
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600">
              Password
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 transition duration-150 shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
