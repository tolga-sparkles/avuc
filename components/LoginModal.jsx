import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { X, Eye, EyeOff, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react'

export default function LoginModal({ open, onClose }) {
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const { login, register } = useAuth()

  // Reset everything when modal closes or opens
  useEffect(() => {
    if (!open) {
      setTab('login')
      setError('')
      setLoading(false)
      setShowPassword(false)
      setPhone('')
      setPassword('')
      setName('')
      setEmail('')
    }
  }, [open])

  if (!open) return null

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    let formatted = digits
    if (digits.length > 4) formatted = `${digits.slice(0, 4)} ${digits.slice(4)}`
    if (digits.length > 7) formatted = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
    if (digits.length > 9) formatted = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`
    return formatted
  }

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value))
  }

  const getPasswordStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strength = getPasswordStrength(password)
  const strengthLabel = strength <= 2 ? 'Zayıf' : strength <= 4 ? 'Orta' : 'Güçlü'
  const strengthColor = strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-amber-500' : 'bg-green-500'

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const cleanPhone = phone.replace(/\s/g, '')
    if (!cleanPhone.match(/^05[0-9]{9}$/)) {
      setError('Geçerli bir telefon numarası girin (05xx xxx xx xx).')
      setLoading(false)
      return
    }
    try {
      await login(cleanPhone, password)
      onClose()
    } catch (err) {
      const msg = err.response?.data?.message
      if (msg?.includes('Geçersiz')) {
        setError('Telefon numarası veya şifre hatalı.')
      } else if (msg?.includes('Çok fazla')) {
        setError('Çok fazla deneme yaptınız. Lütfen 15 dakika bekleyin.')
      } else {
        setError(msg || 'Giriş yapılamadı. Lütfen tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const cleanPhone = phone.replace(/\s/g, '')
    if (!cleanPhone.match(/^05[0-9]{9}$/)) {
      setError('Geçerli bir telefon numarası girin (05xx xxx xx xx).')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      setLoading(false)
      return
    }
    try {
      await register(name, cleanPhone, email || null, password)
      // Auto-login after successful registration
      await login(cleanPhone, password)
      onClose()
    } catch (err) {
      const msg = err.response?.data?.message
      if (msg?.includes('zaten kayıtlı')) {
        setError('Bu telefon veya e-posta zaten kayıtlı.')
      } else if (msg?.includes('Şifre')) {
        setError('Şifre yetersiz güçte. Büyük/küçük harf ve rakam kullanın.')
      } else {
        setError(msg || 'Kayıt olunamadı. Lütfen tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-md animate-slide-up rounded-[2rem] bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => { setTab('login'); setError('') }}
              className={`rounded-2xl px-4 py-2 text-sm font-heading transition ${tab === 'login' ? 'bg-main text-mtext' : 'bg-bw text-text'}`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setTab('register'); setError('') }}
              className={`rounded-2xl px-4 py-2 text-sm font-heading transition ${tab === 'register' ? 'bg-main text-mtext' : 'bg-bw text-text'}`}
            >
              Kayıt Ol
            </button>
          </div>
          <Button onClick={onClose} variant="neutral" size="sm" className="rounded-2xl font-heading">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-avuc-lightRed px-4 py-3 text-sm font-bold text-avuc-red">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-avuc-text">Telefon</span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="05xx xxx xx xx"
                required
                maxLength={14}
                className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
              />
              <p className="mt-1 text-[11px] text-avuc-muted">05 ile başlayan 11 haneli numara</p>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-avuc-text">Şifre</span>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-border bg-bw px-4 py-3 pr-12 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-avuc-muted transition hover:bg-slate-100 hover:text-avuc-text"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 rounded-2xl bg-main px-5 py-3 text-sm font-heading text-mtext disabled:opacity-50"
            >
              {loading ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : null}
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
            <p className="text-center text-xs text-avuc-muted">
              Şifrenizi mi unuttunuz? <button type="button" onClick={() => setTab('register')} className="font-bold text-avuc-blue underline">Yeni hesap oluşturun</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-avuc-text">Ad Soyad</span>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız"
                required
                minLength={2}
                maxLength={100}
                className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-avuc-text">Telefon</span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="05xx xxx xx xx"
                required
                maxLength={14}
                className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
              />
              <p className="mt-1 text-[11px] text-avuc-muted">05 ile başlayan 11 haneli numara</p>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-avuc-text">E-posta <span className="text-avuc-muted">(opsiyonel)</span></span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-avuc-text">Şifre</span>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-border bg-bw px-4 py-3 pr-12 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-avuc-muted transition hover:bg-slate-100 hover:text-avuc-text"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-slate-100">
                      <div className={`h-full rounded-full transition-all ${strengthColor}`} style={{ width: `${Math.min(100, (strength / 6) * 100)}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-avuc-muted">{strengthLabel}</span>
                  </div>
                  <ul className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-avuc-muted">
                    <li className={password.length >= 6 ? 'text-green-600' : ''}>• En az 6 karakter</li>
                    <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>• Küçük harf</li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>• Büyük harf</li>
                    <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>• Rakam</li>
                  </ul>
                </div>
              )}
            </label>
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 rounded-2xl bg-main px-5 py-3 text-sm font-heading text-mtext disabled:opacity-50"
            >
              {loading ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : null}
              {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
            </button>
            <p className="text-center text-xs text-avuc-muted">
              Zaten hesabınız var mı? <button type="button" onClick={() => setTab('login')} className="font-bold text-avuc-blue underline">Giriş yapın</button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
