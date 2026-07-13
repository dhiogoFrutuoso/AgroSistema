import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Tractor,
  Wheat,
  MapPinned,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService.js";

export default function LoginPage({ onUserLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cpf: "",
    senha: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(form.cpf, form.senha);

    if (result.success) {
      if (onUserLogin) {
        onUserLogin(result.user);
      }
      navigate("/", { replace: true });
    } else {
      setError(result.error || "CPF ou senha incorretos. Verifique seus dados e tente novamente.");
    }
    
    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030807] text-white">
      <style>{`
        @keyframes bgFloat {
          0%,100% { transform: scale(1.02) translateY(0); }
          50% { transform: scale(1.07) translateY(-12px); }
        }
        @keyframes gridMove {
          from { transform: translateY(0); }
          to { transform: translateY(90px); }
        }
        @keyframes drive {
          0% { transform: translateX(-30vw); opacity: 0; }
          15% { opacity: .16; }
          50% { opacity: .22; }
          85% { opacity: .16; }
          100% { transform: translateX(115vw); opacity: 0; }
        }
        @keyframes logoBreath {
          0%,100% {
            transform: scale(1);
            filter: drop-shadow(0 22px 35px rgba(0,0,0,.85)) drop-shadow(0 0 18px rgba(245,158,11,.25));
          }
          50% {
            transform: scale(1.025);
            filter: drop-shadow(0 26px 42px rgba(0,0,0,.9)) drop-shadow(0 0 42px rgba(34,197,94,.30));
          }
        }
        @keyframes cardGlow {
          0%,100% {
            box-shadow: 0 45px 130px rgba(0,0,0,.78), 0 0 55px rgba(234,179,8,.10);
          }
          50% {
            box-shadow: 0 45px 150px rgba(0,0,0,.86), 0 0 85px rgba(34,197,94,.16);
          }
        }
        .animated-grid {
          background-image:
            linear-gradient(rgba(234,179,8,.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,.08) 1px, transparent 1px);
          background-size: 90px 90px;
          animation: gridMove 16s linear infinite;
        }
        .drive-tractor { animation: drive 30s linear infinite; }
        .logo-premium { animation: logoBreath 4.5s ease-in-out infinite; }
        .login-card { animation: cardGlow 5s ease-in-out infinite; }
        .bg-machine { animation: bgFloat 14s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(234,179,8,.32),transparent_28%),radial-gradient(circle_at_80%_82%,rgba(34,197,94,.28),transparent_34%),linear-gradient(135deg,#030807_0%,#082114_46%,#241903_100%)]" />

      <div className="animated-grid absolute inset-0 opacity-50" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Tractor className="drive-tractor absolute top-[16%] h-40 w-40 text-yellow-300/30" strokeWidth={1.2} />
        <Wheat className="absolute bottom-[-30px] left-[4%] h-48 w-48 rotate-[-12deg] text-yellow-200/20" />
        <MapPinned className="absolute right-[7%] top-[8%] h-32 w-32 text-emerald-200/15" />
      </div>

      <section className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="hidden flex-col justify-center px-12 py-10 lg:flex">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-yellow-300/25 bg-black/35 px-5 py-3 shadow-2xl backdrop-blur-xl">
              <ShieldCheck className="text-yellow-300" size={22} />
              <span className="text-sm font-black uppercase tracking-[0.28em] text-yellow-100">
                Gestão agrícola premium
              </span>
            </div>
            <h1 className="mt-10 text-7xl font-black leading-[0.95] tracking-tight">
              <span className="block text-white drop-shadow-2xl">ARROZ DOS</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-amber-400 to-emerald-300 bg-clip-text text-transparent">
                FERREIRAS
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-xl font-semibold leading-9 text-green-50/85">
              Sistema empresarial para fazendas, talhões, GPS, máquinas,
              produção, financeiro e relatórios.
            </p>
          </div>
        </aside>

        <div className="flex items-center justify-center p-5 md:p-10">
          <form
            onSubmit={handleSubmit}
            className="login-card relative w-full max-w-[520px] overflow-hidden rounded-[2.8rem] border border-yellow-300/25 bg-black/50 p-7 md:p-9 backdrop-blur-2xl"
          >
            <div className="relative z-10">
              <div className="mb-8 flex justify-center">
                <img
                  src="/images/logos/logo.png"
                  alt="ARROZ DOS FERREIRAS"
                  className="logo-premium h-72 w-72 object-contain"
                />
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-600" size={23} />
                  <input
                    name="cpf"
                    type="text"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder="CPF"
                    disabled={loading}
                    required
                    className="w-full rounded-[1.35rem] border border-yellow-300/25 bg-white/95 px-5 py-5 pl-14 text-lg font-black text-slate-900 outline-none shadow-[0_18px_45px_rgba(0,0,0,.38)] placeholder:text-slate-500 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/30 disabled:opacity-50"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-600" size={23} />
                  <input
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    value={form.senha}
                    onChange={handleChange}
                    placeholder="Senha"
                    disabled={loading}
                    required
                    className="w-full rounded-[1.35rem] border border-yellow-300/25 bg-white/95 px-5 py-5 pl-14 pr-14 text-lg font-black text-slate-900 outline-none shadow-[0_18px_45px_rgba(0,0,0,.38)] placeholder:text-slate-500 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/30 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-300/40 bg-red-500/20 px-4 py-3 text-center text-sm font-bold text-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-[1.35rem] bg-gradient-to-r from-yellow-800 via-amber-500 to-yellow-400 px-6 py-5 text-lg font-black tracking-[0.14em] text-white shadow-[0_10px_0_rgba(120,74,15,.95),0_22px_40px_rgba(0,0,0,.55)] transition-all hover:brightness-110 active:translate-y-1 active:shadow-[0_5px_0_rgba(120,74,15,.95),0_12px_25px_rgba(0,0,0,.45)] disabled:opacity-50"
                >
                  {loading ? "AUTENTICANDO..." : "ACESSAR PLATAFORMA"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}