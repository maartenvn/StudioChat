import dayjs from 'dayjs';

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const formatRelativeTime = (date: dayjs.Dayjs) => {
  const ms = dayjs().diff(date, 'second');
  const mins = Math.floor(ms / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (ms < 10) {
    return 'net';
  } else if (ms < 60) {
    return `${ms} seconden geleden`;
  } else if (mins <= 60) {
    return `${mins} minute${mins === 1 ? '' : 'n'} geleden`;
  } else if (hrs <= 24) {
    return `${hrs} ${hrs === 1 ? 'uur' : 'uren'} geleden`;
  } else {
    return `${days} ${days === 1 ? 'dag' : 'dagen'} geleden`;
  }
};
