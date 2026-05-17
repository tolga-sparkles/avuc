export const validators = {
  phone: (v) => /^05[0-9]{9}$/.test(v.replace(/\s/g, '')),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  minLength: (n) => (v) => v.length >= n,
  required: (v) => v && v.toString().trim().length > 0,
}
