import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createLocalDemoSession, login, register } from '../api/auth';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Button, buttonStyles } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { cn } from '../utils/cn';

type AuthMode = 'login' | 'register';

type LoginPageProps = {
  initialMode?: AuthMode;
};

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const initialForm = {
  username: '',
  password: '',
};

export default function LoginPage({ initialMode = 'login' }: LoginPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/admin';

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (form.username.trim().length < 3) {
      setError('账号至少需要 3 个字符。');
      return;
    }

    if (form.password.length < 6) {
      setError('密码至少需要 6 个字符。');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        username: form.username.trim(),
        password: form.password,
      };

      if (mode === 'login') {
        await login(payload);
      } else {
        await register(payload);
      }

      navigate(redirectTo, { replace: true });
    } catch {
      setError(mode === 'login' ? '登录失败，请检查账号、密码或后端服务。' : '注册失败，请更换账号或检查后端服务。');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLocalDemoLogin() {
    createLocalDemoSession();
    navigate(redirectTo, { replace: true });
  }

  const modeOptions: Array<{ label: string; value: AuthMode }> = [
    { label: '登录', value: 'login' },
    { label: '注册', value: 'register' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#F6FBF9_0%,#E8F8F5_100%)] text-carbon">
      <header className="relative overflow-hidden border-b border-carbon/10 bg-carbon px-5 py-7 text-white sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-industrial-grid bg-[length:56px_56px] opacity-10" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">
              Admin Access
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
              后台演示登录
            </h1>
          </div>
          <Link
            to="/"
            className={buttonStyles({
              variant: 'secondary',
              className: 'border-white/20 bg-white/10 text-white hover:bg-white hover:text-carbon',
            })}
          >
            返回首页
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-17rem)] max-w-6xl items-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-aqua">V1.1 Backend Demo</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-carbon sm:text-5xl">
              使用 JWT 进入本地后台
            </h2>
            <p className="mt-5 text-base leading-8 text-steel">
              登录后可从 Express + SQLite 后端读取预约、询价、模拟设备状态和操作日志。后端不可用时，
              后台会回退到 localStorage 本地演示模式。
            </p>
          </div>

          <Card elevated className="bg-white p-5 sm:p-6">
            <div className="mb-6 grid rounded-2xl border border-carbon/10 bg-mist/70 p-1 sm:grid-cols-2">
              {modeOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setMode(item.value);
                    setError('');
                  }}
                  className={cn(
                    'rounded-xl px-4 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua',
                    mode === item.value
                      ? 'bg-carbon text-white shadow-panel-soft'
                      : 'text-steel hover:bg-white hover:text-carbon',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="账号"
                name="admin-username"
                autoComplete="username"
                value={form.username}
                placeholder="例如：admin_demo"
                onChange={(event) => updateField('username', event.target.value)}
              />
              <Input
                label="密码"
                name="admin-password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={form.password}
                placeholder="至少 6 位"
                onChange={(event) => updateField('password', event.target.value)}
              />

              {error ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '处理中…' : mode === 'login' ? '登录后台' : '注册并进入后台'}
              </Button>
            </form>

            <div className="mt-5 border-t border-carbon/10 pt-5">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleLocalDemoLogin}
              >
                后端不可用时进入本地演示模式
              </Button>
              <p className="mt-3 text-xs leading-5 text-steel">
                本地演示模式只读取浏览器 localStorage，不代表真实后端登录或真实设备控制。
              </p>
            </div>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
