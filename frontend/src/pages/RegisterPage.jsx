import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Field }   from '../components/Field'
import { Button }  from '../components/Button'
import { PawIcon } from '../components/PawIcon'
import { register } from '../services/authService'
import { isValidEmail, isValidPhone, passwordStrength, strengthLabel } from '../utils/validators'

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre:'', email:'', telefono:'', direccion:'', password:'', confirm:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.nombre.trim())           e.nombre   = 'Campo requerido'
    if (!isValidEmail(form.email))     e.email    = 'Email inválido'
    if (!isValidPhone(form.telefono))  e.telefono = 'Teléfono inválido'
    if (form.password.length < 6)      e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setApiError('')
    try {
      await register({ nombre: form.nombre, email: form.email, telefono: form.telefono,
        direccion: form.direccion, password: form.password })
      navigate('/login?registered=1')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  const strength = passwordStrength(form.password)
  const strengthColors = ['#E05252','#F59E0B','#4CAF7D','#1B4D3E']

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, var(--light) 0%, var(--warm) 100%)', padding:'32px 16px' }}>
      <div style={{ maxWidth:520, margin:'0 auto 24px', display:'flex', alignItems:'center', gap:12 }} className="fade-up">
        <Link to="/login" style={{ display:'flex', alignItems:'center', justifyContent:'center',
          width:40, height:40, background:'white', borderRadius:12, textDecoration:'none',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)', color:'var(--primary)', fontSize:18 }}>←</Link>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <PawIcon size={20} />
          <span style={{ fontFamily:"'Playfair Display', serif", fontWeight:700, color:'var(--primary)', fontSize:18 }}>VetCare</span>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:16 }}>
          {[{n:'1',l:'Usuario',a:true},{n:'2',l:'Mascota',a:false}].map(s => (
            <div key={s.n} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center',
                justifyContent:'center', background: s.a ? 'var(--accent)' : 'var(--light)',
                color: s.a ? 'white' : 'var(--muted)', fontSize:13, fontWeight:700 }}>{s.n}</div>
              <span style={{ fontSize:12, color: s.a ? 'var(--primary)' : 'var(--muted)', fontWeight: s.a ? 600 : 400 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fade-up-2" style={{ maxWidth:520, margin:'0 auto', background:'white',
        borderRadius:24, padding:'36px 32px', boxShadow:'0 12px 48px rgba(27,77,62,0.12)' }}>

        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color:'var(--text)', marginBottom:6 }}>Crear cuenta</h2>
        <p style={{ color:'var(--muted)', fontSize:13, marginBottom:28 }}>Información del dueño de la mascota</p>

        {apiError && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:10,
            padding:'10px 14px', color:'var(--error)', fontSize:13, marginBottom:16 }}>{apiError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Nombre completo *" error={errors.nombre}>
                <input placeholder="Juan Pérez" value={form.nombre} onChange={e => set('nombre', e.target.value)} className={errors.nombre ? 'error' : ''} />
              </Field>
            </div>
            <div style={{ gridColumn:'1 / -1' }}>
              <Field label="Correo electrónico *" error={errors.email}>
                <input type="email" placeholder="juan@correo.com" value={form.email} onChange={e => set('email', e.target.value)} className={errors.email ? 'error' : ''} />
              </Field>
            </div>
            <Field label="Teléfono" error={errors.telefono}>
              <input placeholder="+57 300 000 0000" value={form.telefono} onChange={e => set('telefono', e.target.value)} className={errors.telefono ? 'error' : ''} />
            </Field>
            <Field label="Ciudad / Dirección">
              <input placeholder="Barranquilla, Colombia" value={form.direccion} onChange={e => set('direccion', e.target.value)} />
            </Field>
            <Field label="Contraseña *" error={errors.password}>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} className={errors.password ? 'error' : ''} />
            </Field>
            <Field label="Confirmar contraseña *" error={errors.confirm}>
              <input type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} className={errors.confirm ? 'error' : ''} />
            </Field>

            {form.password && (
              <div style={{ gridColumn:'1 / -1' }}>
                <div style={{ display:'flex', gap:6, marginBottom:4 }}>
                  {[...Array(4)].map((_,i) => (
                    <div key={i} style={{ flex:1, height:4, borderRadius:99, transition:'background 0.3s',
                      background: i < strength ? strengthColors[strength-1] : 'var(--border)' }} />
                  ))}
                </div>
                <span style={{ fontSize:12, color:'var(--muted)' }}>{strengthLabel(strength)}</span>
              </div>
            )}

            <div style={{ gridColumn:'1 / -1' }}>
              <Button type="submit" fullWidth loading={loading} variant="primary">Crear cuenta</Button>
            </div>
          </div>
        </form>

        <div style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color:'var(--accent)', fontWeight:600, textDecoration:'none' }}>Inicia sesión</Link>
        </div>
      </div>
    </div>
  )
}
