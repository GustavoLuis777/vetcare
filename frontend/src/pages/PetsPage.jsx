import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field }   from '../components/Field'
import { Button }  from '../components/Button'
import { PawIcon } from '../components/PawIcon'
import { useAuth } from '../context/AuthContext'
import { getPets, createPet, deletePet } from '../services/petService'

const SPECIES_EMOJI = { perro:'🐕', gato:'🐈', conejo:'🐇', ave:'🦜', otro:'🐾' }

const emptyForm = { nombre:'', especie:'', raza:'', fechaNacimiento:'', peso:'', notas:'' }

export default function PetsPage() {
  const [pets, setPets]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState(emptyForm)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { user, logout }      = useAuth()
  const navigate              = useNavigate()

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    setFetching(true)
    try {
      const { data } = await getPets()
      setPets(data.data || [])
    } catch {
      // Si no hay backend aún, muestra vacío
      setPets([])
    } finally {
      setFetching(false)
    }
  }

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre  = 'Campo requerido'
    if (!form.especie)       e.especie = 'Selecciona una especie'
    return e
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const { data } = await createPet(form)
      setPets(p => [...p, data.data])
      setShowForm(false)
      setForm(emptyForm)
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar mascota')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta mascota?')) return
    try {
      await deletePet(id)
      setPets(p => p.filter(pet => pet.id !== id))
    } catch {
      alert('Error al eliminar')
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, var(--light) 0%, var(--warm) 100%)', padding:'32px 16px' }}>
      {/* Header */}
      <div className="fade-up" style={{ maxWidth:640, margin:'0 auto 28px',
        display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <PawIcon size={28} />
          <div>
            <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color:'var(--primary)', margin:0 }}>Mis Mascotas</h1>
            <p style={{ color:'var(--muted)', fontSize:13, margin:0 }}>
              {fetching ? 'Cargando...' : `${pets.length} registrada${pets.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span onClick={handleLogout} style={{ fontSize:13, color:'var(--muted)', cursor:'pointer' }}>Cerrar sesión</span>
          <Button onClick={() => setShowForm(true)} variant="accent">+ Nueva mascota</Button>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:'0 auto' }}>
        {/* Pet cards grid */}
        <div className="fade-up-2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:16, marginBottom:24 }}>
          {pets.map((pet, i) => (
            <div key={pet.id} style={{ background:'white', borderRadius:20, padding:'24px 20px',
              boxShadow:'0 4px 16px rgba(27,77,62,0.08)', borderTop:'4px solid var(--accent)',
              animation:`fadeUp 0.4s ${i * 0.08}s ease forwards`, opacity:0, position:'relative' }}>
              <button onClick={() => handleDelete(pet.id)} style={{ position:'absolute', top:12, right:12,
                background:'none', border:'none', cursor:'pointer', color:'#CBD5E1', fontSize:16 }}>✕</button>
              <div style={{ fontSize:40, marginBottom:12 }}>{SPECIES_EMOJI[pet.especie] || '🐾'}</div>
              <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:20, color:'var(--primary)', margin:'0 0 4px' }}>{pet.nombre}</h3>
              <p style={{ color:'var(--muted)', fontSize:13, margin:'0 0 12px', textTransform:'capitalize' }}>
                {pet.especie}{pet.raza ? ` · ${pet.raza}` : ''}
              </p>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {pet.fechaNacimiento && (
                  <span style={{ background:'var(--light)', color:'var(--primary)', fontSize:12, padding:'4px 10px', borderRadius:99, fontWeight:500 }}>
                    🎂 {new Date(pet.fechaNacimiento).getFullYear()}
                  </span>
                )}
                {pet.peso && (
                  <span style={{ background:'#FFF3E0', color:'#E65100', fontSize:12, padding:'4px 10px', borderRadius:99, fontWeight:500 }}>
                    {pet.peso} kg
                  </span>
                )}
              </div>
            </div>
          ))}

          {!fetching && pets.length === 0 && !showForm && (
            <div style={{ gridColumn:'1 / -1', textAlign:'center', padding:'48px 20px', color:'var(--muted)' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🐾</div>
              <p style={{ fontSize:15, marginBottom:20 }}>Aún no tienes mascotas registradas</p>
              <Button onClick={() => setShowForm(true)} variant="accent">Registrar primera mascota</Button>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="fade-up" style={{ background:'white', borderRadius:24, padding:'32px 28px',
            boxShadow:'0 12px 48px rgba(27,77,62,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:20, color:'var(--text)', margin:0 }}>Registrar mascota</h2>
              <span onClick={() => { setShowForm(false); setForm(emptyForm); setErrors({}) }}
                style={{ cursor:'pointer', color:'var(--muted)', fontSize:20 }}>✕</span>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div style={{ gridColumn:'1 / -1' }}>
                  <Field label="Nombre de la mascota *" error={errors.nombre}>
                    <input placeholder="Ej: Max, Luna..." value={form.nombre} onChange={e => set('nombre', e.target.value)} className={errors.nombre ? 'error' : ''} />
                  </Field>
                </div>
                <Field label="Especie *" error={errors.especie}>
                  <select value={form.especie} onChange={e => set('especie', e.target.value)} className={errors.especie ? 'error' : ''}>
                    <option value="">Seleccionar...</option>
                    <option value="perro">🐕 Perro</option>
                    <option value="gato">🐈 Gato</option>
                    <option value="conejo">🐇 Conejo</option>
                    <option value="ave">🦜 Ave</option>
                    <option value="otro">🐾 Otro</option>
                  </select>
                </Field>
                <Field label="Raza">
                  <input placeholder="Ej: Labrador, Siamés..." value={form.raza} onChange={e => set('raza', e.target.value)} />
                </Field>
                <Field label="Fecha de nacimiento">
                  <input type="date" value={form.fechaNacimiento} onChange={e => set('fechaNacimiento', e.target.value)} />
                </Field>
                <Field label="Peso (kg)">
                  <input type="number" placeholder="Ej: 8.5" min="0" step="0.1" value={form.peso} onChange={e => set('peso', e.target.value)} />
                </Field>
                <Field label="Notas médicas">
                  <input placeholder="Alergias, condiciones..." value={form.notas} onChange={e => set('notas', e.target.value)} />
                </Field>
                <div style={{ gridColumn:'1 / -1', display:'flex', gap:12 }}>
                  <Button fullWidth variant="ghost" onClick={() => { setShowForm(false); setForm(emptyForm) }}>Cancelar</Button>
                  <Button type="submit" fullWidth loading={loading} variant="accent">Guardar mascota</Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
