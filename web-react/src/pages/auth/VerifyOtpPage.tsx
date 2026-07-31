import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { showApiError } from '@/utils/toast';

export default function VerifyOtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const emailOrPhone = (location.state as { emailOrPhone?: string })?.emailOrPhone || '';
  const [otp, setOtp] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.verifyOtpToken({ email_or_phone: emailOrPhone, otp }),
    onSuccess: (data) => {
      navigate('/auth/reset-password', { state: { resetToken: data.reset_token ?? data.token } });
    },
    onError: (err) => showApiError(err, 'Invalid code'),
  });

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">Enter the code sent to {emailOrPhone || 'your contact'}.</p>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="------"
        maxLength={6}
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-lg tracking-[0.5em]"
      />
      <button
        type="button"
        disabled={mutation.isPending || otp.length < 4}
        onClick={() => mutation.mutate()}
        className="rounded-lg bg-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {t('verify_otp')}
      </button>
    </div>
  );
}
