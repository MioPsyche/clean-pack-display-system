import { Link } from 'react-router-dom';
import { buttonStyles } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-carbon px-5 text-center text-white">
      <div>
        <p className="font-display text-7xl font-semibold text-mint">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">页面不存在</h1>
        <p className="mt-3 text-sm text-white/62">请返回项目展示首页或本地模拟后台。</p>
        <div className="mt-8 flex justify-center">
          <Link to="/" className={buttonStyles({ variant: 'secondary' })}>
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
