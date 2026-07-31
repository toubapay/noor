import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { useAppDispatch } from '@/store/hooks';
import { setModule } from '@/store/slices/moduleSlice';

export default function ModuleSelectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: modules, isLoading } = useQuery({ queryKey: ['modules'], queryFn: api.getModules });

  const choose = (mod: NonNullable<typeof modules>[number]) => {
    dispatch(setModule(mod));
    navigate('/');
  };

  if (isLoading) return <Loader label={t('loading')} />;
  if (!modules?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 py-10">
      <h1 className="text-center text-xl font-bold text-gray-800">{t('select_module')}</h1>
      <div className="grid grid-cols-2 gap-4">
        {modules.map((mod) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => choose(mod)}
            className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            {mod.icon || mod.thumbnail ? (
              <img src={mod.icon || mod.thumbnail} alt={mod.module_name} className="h-14 w-14 object-contain" />
            ) : (
              <div className="h-14 w-14 rounded-full bg-primary-50" />
            )}
            <span className="text-sm font-medium capitalize text-gray-700">
              {t(mod.module_type, { defaultValue: mod.module_name })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
