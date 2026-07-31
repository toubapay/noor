import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export function ModuleSwitcher() {
  const navigate = useNavigate();
  const current = useAppSelector((s) => s.module.current);

  return (
    <button
      type="button"
      onClick={() => navigate('/select-module')}
      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
    >
      {current?.thumbnail && <img src={current.thumbnail} alt="" className="h-4 w-4" />}
      <span className="capitalize">{current?.module_type ?? 'Select module'}</span>
    </button>
  );
}
