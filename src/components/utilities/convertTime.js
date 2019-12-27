import moment from 'moment';

export default function convertTime(time) {
  const minutes = time.split(':')[1];
  if (minutes === '00') {
    return moment(time, 'HH:mm:ss').format('h A');
  } else {
    return moment(time, 'HH:mm:ss').format('h:mm A');
  }
};