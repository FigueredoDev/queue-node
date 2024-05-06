import Mail from "../lib/Mail.js";

const registrationMailJob = async (job) => {
  const { name, email } = job.data;

  try {
    await Mail.sendMail({
      from: "Queue test <queue@example.com>",
      to: `${name} <${email}>`,
      subject: "Welcome",
      html: `Welcome, ${name}!`,
    });
  } catch (error) {
    throw new Error(
      `Failed to send email to ${name} <${email}>: ${error.message}`,
    );
  }
};

export default registrationMailJob;
