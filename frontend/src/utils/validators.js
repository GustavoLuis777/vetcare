export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isValidPhone = (phone) =>
  !phone || /^\+?[\d\s\-]{7,15}$/.test(phone)

export const passwordStrength = (password) => {
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ]
  return checks.filter(Boolean).length
}

export const strengthLabel = (score) =>
  ['', 'Débil', 'Regular', 'Buena', 'Excelente'][score] || ''
