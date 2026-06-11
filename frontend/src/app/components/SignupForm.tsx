import { useState } from "react";
import { X } from "lucide-react";
import { signup } from "../../api";

interface SignupFormProps {
  onClose: () => void;
  onSignup: () => void;
}

export function SignupForm({ onClose, onSignup }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await signup(email, password, confirmPassword);
      onSignup();
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl mb-6">회원가입</h2>

        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? "처리 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
