import { useState, type FC, type FormEvent } from "react";

interface RegisterFormProps {
  onRegister: (email: string, password: string, fullName: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onRegister(email, password, fullName);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-lg border max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="******"
            />
          </div>
          <button
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            type="submit"
          >
            Create Account
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-blue-600 hover:text-blue-700 text-sm"
            onClick={onSwitchToLogin}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
