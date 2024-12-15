const urlRegex =
  /^https?:\/\/(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?:\/\/(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,}$/;

const phoneRegex = /^05[0-9]{8}$/;

const passwordRegex = /^[a-zA-Z0-9_-]{6,16}$/;

export { urlRegex, phoneRegex, passwordRegex };
