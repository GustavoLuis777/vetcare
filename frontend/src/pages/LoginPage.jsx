import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Field }   from '../components/Field'
import { Button }  from '../components/Button'
import { PawIcon } from '../components/PawIcon'
import { useAuth } from '../context/AuthContext'
import { login }   from '../services/authService'
import { isValidEmail } from '../utils/validators'

export default function LoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const { login: setAuth }  = useAuth()
  const navigate            = useNavigate()

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!isValidEmail(form.email))    e.email    = 'Email inválido'
    if (form.password.length < 6)     e.password = 'Mínimo 6 caracteres'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      const { data } = await login(form.email, form.password)
      setAuth(data.token, data.user)
      navigate('/mascotas')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:20, background:'linear-gradient(135deg, var(--light) 0%, var(--warm) 100%)' }}>

      <div style={{ width:'100%', maxWidth:420 }}>
        <div className="fade-up" style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:64, height:64, background:'var(--primary)', borderRadius:20, marginBottom:16,
            boxShadow:'0 8px 24px rgba(27,77,62,0.25)' }}>
            <PawIcon size={32} color="white" />
          </div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:28, color:'var(--primary)', fontWeight:700 }}>VetCare</h1>
          <p style={{ color:'var(--muted)', fontSize:14, marginTop:4 }}>Cuidamos a quienes más amas</p>
        </div>

        <div className="fade-up-2" style={{ background:'white', borderRadius:24, padding:'36px 32px',
          boxShadow:'0 12px 48px rgba(27,77,62,0.12)' }}>

          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color:'var(--text)', marginBottom:6 }}>Iniciar sesión</h2>
          <p style={{ color:'var(--muted)', fontSize:13, marginBottom:28 }}>Ingresa tus datos para continuar</p>

          {apiError && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:10,
              padding:'10px 14px', color:'var(--error)', fontSize:13, marginBottom:16 }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <Field label="Correo electrónico" error={errors.email}>
              <input type="email" className={errors.email ? 'error' : ''} placeholder="ejemplo@correo.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </Field>
            <Field label="Contraseña" error={errors.password}>
              <input type="password" className={errors.password ? 'error' : ''} placeholder="••••••••"
                value={form.password} onChange={e => set('password', e.target.value)} />
            </Field>
            <div style={{ textAlign:'right', marginTop:-8 }}>
              <span style={{ fontSize:13, color:'var(--accent)', cursor:'pointer', fontWeight:500 }}>
                ¿Olvidaste tu contraseña?
              </span>
            </div>
            <Button type="submit" fullWidth loading={loading} variant="primary">Ingresar</Button>
          </form>

          <div style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ color:'var(--accent)', fontWeight:600, textDecoration:'none' }}>
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
