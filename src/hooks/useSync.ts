'use client';

import { useEffect } from 'react';
import { syncOfflineTasks } from '@/lib/sync';

export function useSync() {
  useEffect(() => {
    // Sincronizar assim que a aplicação iniciar
    syncOfflineTasks();

    // Listener para quando a conexão voltar (online)
    const handleOnline = () => {
      console.log('Conexão restabelecida. Sincronizando...');
      syncOfflineTasks();
    };

    // Ouvir eventos do navegador de online/offline
    window.addEventListener('online', handleOnline);

    // Opcional: configurar um intervalo para sincronizar a cada 5 minutos
    // Isso é útil se o app ficar muito tempo aberto sem a tela recarregar
    const interval = setInterval(() => {
      if (navigator.onLine) {
        syncOfflineTasks();
      }
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, []);
}
