import { clsx, type ClassValue } from "clsx"
import moment from "moment";
import { twMerge } from "tailwind-merge"

const dayMapping : {[key : number] : string } = {
  0 : 'Sunday',
  1 : 'Monday',
  2 : 'Tuesday',
  3 : 'Wednesday',
  4 : 'Thursday',
  5 : 'Friday',
  6 : 'Saturday'
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date : string, groupMessagesByDate = false) => {
  const today = moment.utc().startOf('day');
  const messageDate = moment.utc(date).startOf('day');;

  const daysDiff = today.diff(messageDate,'days');
  if (daysDiff === 0)
      return groupMessagesByDate ? 'TODAY' : moment.utc(date).local().format('LT');
  if (daysDiff === 1)
    return groupMessagesByDate ? 'YESTERDAY' : 'Yesterday';
  else if (daysDiff >= 7 )
      return messageDate.format('DD/MM/YYYY');
  else return dayMapping[messageDate.day()];
};

export const formatDateToLocal = (date:string) => {
  return moment.utc(date).local().format('LT');
};


export const REDIS_QUEUED_MESSAGE_PREFIX = 'messages_queue_';