import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { showApiError } from '@/utils/toast';

export default function ChatPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const conversationId = Number(id);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => api.getMessages(conversationId, 1),
    refetchInterval: 10_000,
  });

  const sendMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('conversation_id', String(conversationId));
      formData.append('message', message);
      return api.sendMessage(formData);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
    onError: (err) => showApiError(err),
  });

  if (isLoading) return <Loader label={t('loading')} />;

  return (
    <div className="mx-auto flex h-[70vh] max-w-lg flex-col gap-3">
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-100 bg-white p-3">
        {data?.messages?.length ? (
          <div className="flex flex-col gap-2">
            {data.messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  msg.sent_by === 'customer' ? 'ml-auto bg-primary text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message={t('no_data_found')} />
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (message.trim()) sendMutation.mutate();
        }}
        className="flex gap-2"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm"
        />
        <button type="submit" className="rounded-full bg-primary p-2.5 text-white">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
