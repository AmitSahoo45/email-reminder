import { parseISO, addMinutes, subMinutes } from 'date-fns';

export const convertISTToUTC = (datetime: string): Date => subMinutes(parseISO(datetime), 330);

export const convertUTCToIST = (datetime: string): Date => addMinutes(parseISO(datetime), 330);
