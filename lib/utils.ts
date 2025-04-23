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


export const formatDate = (date : string) => {
  const today = moment.utc();
  const messageDate = moment.utc(date);

  const daysDiff = today.diff(messageDate,'days');
  if (daysDiff === 0)
      return 'TODAY';
  if (daysDiff === 1)
    return 'YESTERDAY';
  else if (daysDiff >= 7 )
      return moment.utc(date).local().format('DD/MM/YYYY');
  else return dayMapping[moment.utc(date).local().day()];
};