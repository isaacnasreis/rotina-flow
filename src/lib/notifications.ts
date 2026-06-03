import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export async function requestNotificationPermission() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  } catch (e) {
    console.error('Erro ao pedir permissão de notificação:', e);
    return false;
  }
}

function getNumericId(taskId: string): number {
  return parseInt(taskId.substring(0, 8), 16);
}

export async function scheduleTaskNotification(taskId: string, title: string, timeString: string) {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Se o horário programado for menor que a hora atual, agendar para o próximo dia (isso pode ajudar nas rotinas noturnas virando o dia)
    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    const numericId = getNumericId(taskId);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: numericId,
          title: 'Rotina Flow: Hora da tarefa!',
          body: title,
          schedule: { at: date },
          actionTypeId: '',
          extra: { taskId },
        },
      ],
    });
  } catch (e) {
    console.error('Erro ao agendar notificação:', e);
  }
}

export async function cancelTaskNotification(taskId: string) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const numericId = getNumericId(taskId);
    await LocalNotifications.cancel({ notifications: [{ id: numericId }] });
  } catch (e) {
    console.error('Erro ao cancelar notificação:', e);
  }
}
