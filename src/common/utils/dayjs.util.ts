import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const dayJs = dayjs;
// Extend plugin
dayJs.extend(utc);
dayJs.extend(timezone);

// Set default timezone
dayJs.tz.setDefault('Asia/Jakarta');

export default dayJs;
