import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { showApiError, toast } from '@/utils/toast';

export default function VerificationPage() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      if (file) formData.append('document', file);
      return api.updateProfile(formData);
    },
    onSuccess: () => toast.success('Document submitted for verification'),
    onError: (err) => showApiError(err),
  });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      <h1 className="text-lg font-bold text-gray-800">Identity verification</h1>
      <p className="text-sm text-gray-500">
        Upload a government ID (Carte Nationale d'Identité, passport) to verify your account.
      </p>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
      />
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={!file || mutation.isPending}
        className="rounded-lg bg-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {t('apply')}
      </button>
    </div>
  );
}
