import { createTransport } from "nodemailer";

export const sendEmail = async (
  email: string,
  subject: string,
  text: string,
  html: string
) => {
  try {
    const transporter = createTransport({
      // host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
      html,
    });

    transporter.close();


  } catch (error) {
    console.log(error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const subject = "Réinitialisez votre mot de passe";

  // Version texte brut (fallback pour les clients email sans HTML support)
  const text = `Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe : ${url}`;

  // Version HTML pour les clients qui supportent le HTML
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50;">Réinitialisation de votre mot de passe</h2>
      <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
      <p>
        <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Réinitialiser le mot de passe
        </a>
      </p>
      <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
      <p><a href="${url}" style="color: #4CAF50;">${url}</a></p>
      <hr style="border:none;border-top:1px solid #ccc;"/>
      <p style="font-size: 0.9em;">Si vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez ignorer cet e-mail. Votre mot de passe restera inchangé.</p>
      <p style="font-size: 0.9em;">Cordialement,<br />L'équipe</p>
    </div>
  `;

  // Appel à ta fonction d'envoi d'email avec texte et HTML
  await sendEmail(email, subject, text, html);
};
