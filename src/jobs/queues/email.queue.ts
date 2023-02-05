import { bull } from '../bull';
import { sendEmail } from '../../services/utils/mailer';

const addEmailToQueue = (email: string, subject: string, message: string) => {
    bull.add('sendEmail', {
        email,
        subject,
        message,
    });
};

bull.process('sendEmail', async (job) => {
    const { email, subject, message } = job.data;
    await sendEmail(email, subject, message);
});

export { addEmailToQueue };
