import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  MailWarning,
  Sparkles,
  Upload,
} from 'lucide-react'
import { useVinka } from '../context/VinkaContext'
import { PhotoUploader } from './PhotoUploader'

export function ProviderOnboarding() {
  const {
    currentUser,
    openAuthModal,
    categories,
    applications,
    submitProviderApplication,
    setRoute,
  } = useVinka()

  const existingApp = currentUser
    ? applications.find((a) => a.userId === currentUser.id)
    : undefined

  const [step, setStep] = useState(1)
  const [editingRejected, setEditingRejected] = useState(false)

  // Step 1 & 2
  const [offeringType, setOfferingType] = useState<'espacio' | 'servicio'>(
    existingApp?.offeringType || 'espacio',
  )
  const [subType, setSubType] = useState(existingApp?.subType || 'Finca / Quinta campestre')
  const [specificDetails, setSpecificDetails] = useState(existingApp?.specificDetails || '')
  const [capacity, setCapacity] = useState<number>(existingApp?.capacity || 150)

  // Step 3: Requisitos Usuario
  const [fullName, setFullName] = useState(existingApp?.fullName || currentUser?.name || '')
  const [address, setAddress] = useState(existingApp?.address || '')
  const [curp, setCurp] = useState(existingApp?.curp || '')
  const [rfc, setRfc] = useState(existingApp?.rfc || '')
  const [socialOrWeb, setSocialOrWeb] = useState(existingApp?.socialOrWeb || '')

  // Step 4: Requisitos Servicio/Espacio (11 puntos)
  const [location, setLocation] = useState(existingApp?.location || 'Monterrey, Nuevo León')
  const [businessName, setBusinessName] = useState(existingApp?.businessName || '')
  const [businessPermitDoc, setBusinessPermitDoc] = useState(existingApp?.businessPermitDoc || '')
  const [photos, setPhotos] = useState<string[]>(
    existingApp?.photos?.length ? existingApp.photos : [],
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    existingApp?.categories || [],
  )
  const [cost, setCost] = useState<number>(existingApp?.cost || 0)
  const [costUnit, setCostUnit] = useState(existingApp?.costUnit || 'por evento')
  const [descriptionAndIncluded, setDescriptionAndIncluded] = useState(
    existingApp?.descriptionAndIncluded || '',
  )
  const [invoicingService, setInvoicingService] = useState(existingApp?.invoicingService ?? false)
  const [rules, setRules] = useState(existingApp?.rules || '')
  const [signedContractFile, setSignedContractFile] = useState(
    existingApp?.signedContractFile || '',
  )
  const [scheduleAndAvailability, setScheduleAndAvailability] = useState(
    existingApp?.scheduleAndAvailability || '',
  )

  const toggleCat = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    )
  }

  // Require a Provider account before filling out the registration
  if (!currentUser || currentUser.role !== 'provider') {
    return (
      <div className="min-h-[calc(100vh-78px)] bg-[#f7f3ee] py-14 px-4">
        <div className="vinka-modal-card max-w-xl mx-auto rounded-3xl bg-white border border-[#decfc2] p-8 md:p-10 text-center space-y-5 shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3ece4] text-[#a36b42]">
            <Building2 size={32} />
          </div>
          <span className="inline-block rounded-full bg-[#f3ece4] px-3.5 py-1 text-xs font-extrabold text-[#a36b42]">
            Alta de Proveedor requerida
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e140f]">
            Date de alta como proveedor para publicar tu espacio o servicio
          </h1>
          <p className="text-sm text-[#7d6558] leading-relaxed">
            {currentUser
              ? `Actualmente estás conectado como "${currentUser.name}" (${currentUser.role === 'admin' ? 'Administrador' : 'Cliente'}). Para publicar un espacio o servicio necesitas crear o iniciar sesión con una cuenta de Proveedor.`
              : 'Crea tu cuenta de Proveedor o inicia sesión para completar tus requisitos de verificación y publicar en Vinka.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => openAuthModal('provider')}
              className="btn-vinka px-6 py-3 text-sm font-bold cursor-pointer"
            >
              Crear cuenta / Iniciar sesión como Proveedor
            </button>
            <button
              type="button"
              onClick={() => setRoute('landing')}
              className="rounded-full border border-[#decfc2] bg-white hover:bg-[#f7f3ee] px-5 py-3 text-sm font-bold text-[#221610] cursor-pointer"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If approved -> jump straight to Portal de Negocio
  if (currentUser?.providerStatus === 'approved' || existingApp?.status === 'approved') {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#f7f3ee] py-14 px-4">
        <div className="max-w-xl mx-auto rounded-3xl bg-white border border-[#decfc2] p-8 text-center space-y-5 shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={34} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#221610]">¡Tu negocio está autorizado!</h1>
          <p className="text-sm text-[#7d6558]">
            Ya tienes acceso completo a tu <strong>Portal de Negocio</strong> con sistema de
            agendas, CRUD de servicios, facturación y analytics.
          </p>
          <button
            type="button"
            onClick={() => setRoute('provider-portal')}
            className="rounded-xl bg-[#2d1d16] hover:bg-[#422d22] text-white px-6 py-3 text-sm font-bold cursor-pointer"
          >
            Entrar a mi Portal de Negocio
          </button>
        </div>
      </div>
    )
  }

  // If pending approval
  if (existingApp?.status === 'pending' && !editingRejected) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#f7f3ee] py-14 px-4">
        <div className="max-w-xl mx-auto rounded-3xl bg-white border border-[#decfc2] p-8 text-center space-y-5 shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Clock size={34} />
          </div>
          <span className="inline-block rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-extrabold">
            Validación en proceso · ¿Autorizado?
          </span>
          <h1 className="text-2xl font-extrabold text-[#221610]">
            Solicitud recibida para {existingApp.businessName}
          </h1>
          <p className="text-sm text-[#7d6558]">
            Nuestro equipo está revisando tus requisitos de usuario, permisos de negocio y contrato
            firmado. Te notificaremos por correo en cuanto sea autorizada.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setRoute('landing')}
              className="btn-vinka px-6 py-2.5 text-xs font-bold cursor-pointer"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If rejected -> Correo con razón del rechazo (Página 2)
  if (existingApp?.status === 'rejected' && !editingRejected) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#f7f3ee] py-14 px-4">
        <div className="max-w-xl mx-auto rounded-3xl bg-white border border-rose-200 p-8 space-y-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-700 shrink-0">
              <MailWarning size={24} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-rose-700">
                Correo de notificación · Solicitud no autorizada
              </span>
              <h1 className="text-xl font-extrabold text-[#221610]">
                Tu solicitud requiere ajustes
              </h1>
            </div>
          </div>

          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-900 space-y-1.5">
            <p className="font-extrabold flex items-center gap-1.5">
              <AlertTriangle size={15} /> Razón del rechazo enviada a {existingApp.email}:
            </p>
            <p className="leading-relaxed">
              “{existingApp.rejectionReason || 'Falta documentación legible del permiso municipal.'}”
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setEditingRejected(true)}
              className="rounded-xl bg-[#a36b42] hover:bg-[#2d1d16] text-white px-5 py-2.5 text-xs font-bold cursor-pointer"
            >
              Corregir y reenviar solicitud
            </button>
            <button
              type="button"
              onClick={() => setRoute('landing')}
              className="rounded-xl border border-[#decfc2] px-5 py-2.5 text-xs font-bold text-[#221610] cursor-pointer"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      openAuthModal('provider')
      return
    }
    submitProviderApplication({
      userId: currentUser.id,
      email: currentUser.email,
      offeringType,
      subType,
      specificDetails,
      fullName: fullName || currentUser.name,
      address,
      curp,
      rfc,
      socialOrWeb,
      location,
      businessName: businessName || 'Mi Espacio Vinka',
      businessPermitDoc,
      photos:
        photos.length > 0
          ? photos
          : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85'],
      categories: selectedCategories.length ? selectedCategories : ['Fincas y Terrazas'],
      cost,
      costUnit,
      descriptionAndIncluded,
      invoicingService,
      rules,
      signedContractFile,
      scheduleAndAvailability,
      capacity: offeringType === 'espacio' ? capacity : undefined,
    })
    setEditingRejected(false)
  }

  const stepLabels = [
    '1. Cuéntanos tu servicio',
    '2. Detalles según elección',
    '3. Requisitos Usuario',
    '4. Requisitos Servicio/Espacio',
  ]

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f7f3ee]/70 py-10 px-[5vw]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow dark">
              <span /> Página de Proveedores
            </p>
            <h1 className="text-3xl font-extrabold text-[#221610] mt-1">
              Registra tu espacio o servicio en Vinka
            </h1>
          </div>
        </div>

        {/* Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-7">
          {stepLabels.map((label, idx) => {
            const num = idx + 1
            const active = step === num
            const done = step > num
            return (
              <button
                key={label}
                type="button"
                onClick={() => setStep(num)}
                className={`rounded-xl px-3 py-2.5 text-left text-xs font-bold border transition cursor-pointer ${active
                    ? 'bg-[#2d1d16] text-white border-[#2d1d16]'
                    : done
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-[#7d6558] border-[#decfc2]'
                  }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-[#decfc2] p-6 md:p-8 shadow-sm space-y-6"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-[#221610]">
                  Cuéntanos acerca de tu servicio
                </h2>
                <p className="text-xs text-[#7d6558] mt-1">
                  Elige si ofreces un espacio físico (finca, jardín, salón) o un servicio para
                  eventos.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setOfferingType('espacio')
                    setSubType('Finca / Quinta campestre')
                  }}
                  className={`p-5 rounded-2xl border text-left transition cursor-pointer ${offeringType === 'espacio'
                      ? 'border-[#2d1d16] bg-[#f3ece4]/60 ring-2 ring-[#2d1d16]/20'
                      : 'border-[#decfc2] hover:bg-[#f7f3ee]'
                    }`}
                >
                  <Building2 size={24} className="text-[#2d1d16] mb-2" />
                  <h3 className="font-extrabold text-base text-[#221610]">Espacio / Finca</h3>
                  <p className="text-xs text-[#7d6558] mt-1">
                    Fincas, terrazas, jardines, haciendas o salones de eventos.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOfferingType('servicio')
                    setSubType('Fotografía y Video')
                  }}
                  className={`p-5 rounded-2xl border text-left transition cursor-pointer ${offeringType === 'servicio'
                      ? 'border-[#a36b42] bg-[#f7f3ee] ring-2 ring-[#a36b42]/20'
                      : 'border-[#decfc2] hover:bg-[#f7f3ee]'
                    }`}
                >
                  <Sparkles size={24} className="text-[#a36b42] mb-2" />
                  <h3 className="font-extrabold text-base text-[#221610]">
                    Servicio Profesional
                  </h3>
                  <p className="text-xs text-[#7d6558] mt-1">
                    Banquetes, fotografía, flores, música/DJ, decoración y producción.
                  </p>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1.5">
                  Tipo específico
                </label>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm font-semibold"
                >
                  {offeringType === 'espacio' ? (
                    <>
                      <option>Finca / Quinta campestre</option>
                      <option>Jardín de eventos</option>
                      <option>Terraza urbana</option>
                      <option>Hacienda</option>
                      <option>Salón cerrado</option>
                    </>
                  ) : (
                    <>
                      <option>Fotografía y Video</option>
                      <option>Banquetes y Catering</option>
                      <option>Música, DJ y Audio</option>
                      <option>Diseño Floral</option>
                      <option>Decoración y Mobiliario</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-[#221610]">
                  Detalles según tu elección ({subType})
                </h2>
                <p className="text-xs text-[#7d6558] mt-1">
                  Información técnica específica para que los clientes encuentren exactamente lo que
                  buscan.
                </p>
              </div>
              {offeringType === 'espacio' && (
                <div>
                  <label className="block text-xs font-bold text-[#221610] mb-1.5">
                    Capacidad máxima de invitados
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#221610] mb-1.5">
                  {offeringType === 'espacio'
                    ? 'Amenidades, metros cuadrados, estacionamiento y áreas techadas'
                    : 'Cobertura geográfica, duración de paquetes y equipo incluido'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={specificDetails}
                  onChange={(e) => setSpecificDetails(e.target.value)}
                  placeholder={
                    offeringType === 'espacio'
                      ? 'Ej. 1,800 m² de jardín, alberca, estacionamiento privado para 40 autos, cocina industrial...'
                      : 'Ej. Cobertura en toda el área metropolitana, equipo de 3 personas, 8 horas de servicio...'
                  }
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Requisitos Usuario */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#221610]">Requisitos de Usuario</h2>
                <p className="text-xs text-[#7d6558] mt-1">
                  Datos de verificación de identidad del titular del negocio.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">1. Nombre completo *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nombre y apellidos"
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">2. Domicilio *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, colonia, ciudad"
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">3a. CURP *</label>
                  <input
                    type="text"
                    required
                    value={curp}
                    onChange={(e) => setCurp(e.target.value.toUpperCase())}
                    placeholder="18 caracteres"
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">3b. RFC *</label>
                  <input
                    type="text"
                    required
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                    placeholder="RFC con homoclave"
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  4. Redes Sociales o Sitio Web (opcional)
                </label>
                <input
                  type="text"
                  value={socialOrWeb}
                  onChange={(e) => setSocialOrWeb(e.target.value)}
                  placeholder="https://instagram.com/tunegocio"
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 4: 11 Requisitos Servicio / Espacio */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#221610]">
                  Requisitos del Servicio / Espacio (11 puntos)
                </h2>
                <p className="text-xs text-[#7d6558] mt-1">
                  Completa la ficha oficial para que el administrador de Vinka autorice tu negocio.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">1. Lugar (Ciudad / Zona) *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    2. Nombre del Lugar / Servicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Finca Los Encinos"
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">
                    3. Documento que avale permiso de negocio *
                  </label>
                  <label className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-[#2d1d16]/40 bg-[#f3ece4]/60 hover:bg-[#efe7de] px-3.5 py-2.5 text-xs cursor-pointer transition">
                    <span className="inline-flex items-center gap-2 font-semibold text-[#221610] truncate">
                      <Upload size={15} className="text-[#a36b42] shrink-0" />
                      {businessPermitDoc || 'Adjuntar permiso municipal / licencia (PDF o imagen)'}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#2d1d16] border border-[#decfc2] shrink-0">
                      Elegir archivo
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) setBusinessPermitDoc(f.name)
                      }}
                    />
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1.5">
                    4. Fotos del lugar / servicio a prestar *
                  </label>
                  <PhotoUploader
                    photos={photos}
                    onChange={setPhotos}
                    label="Adjuntar fotos del lugar o servicio (puedes subir varias)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">5. Categoría(s) *</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const active = selectedCategories.includes(cat.name)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCat(cat.name)}
                        className={`rounded-full px-3 py-1 text-xs font-bold border cursor-pointer ${active
                            ? 'bg-[#2d1d16] text-white border-[#2d1d16]'
                            : 'bg-[#f7f3ee] text-[#221610] border-[#decfc2]'
                          }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">6. Costo base ($ MXN) *</label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Unidad de cobro</label>
                  <input
                    type="text"
                    value={costUnit}
                    onChange={(e) => setCostUnit(e.target.value)}
                    placeholder="por evento / por hora / paquete"
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  7. Descripción y/o Servicios Incluidos *
                </label>
                <textarea
                  rows={2}
                  required
                  value={descriptionAndIncluded}
                  onChange={(e) => setDescriptionAndIncluded(e.target.value)}
                  placeholder="Detalla qué incluye el precio base..."
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2 text-sm"
                />
              </div>

              <label className="flex items-center gap-2.5 rounded-xl bg-[#f7f3ee] border border-[#decfc2] p-3 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={invoicingService}
                  onChange={(e) => setInvoicingService(e.target.checked)}
                />
                <span>8. Ofrezco Servicio de Facturación fiscal (opcional)</span>
              </label>

              <div>
                <label className="block text-xs font-bold mb-1">9. Reglas *</label>
                <input
                  type="text"
                  required
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Ej. Horario límite de música, políticas de cancelación..."
                  className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2 text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    10. Contrato adjunto firmado *
                  </label>
                  <label className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-50/50 hover:bg-emerald-50 px-3 py-2 text-xs cursor-pointer transition">
                    <span className="inline-flex items-center gap-2 font-semibold text-emerald-950 truncate">
                      <FileCheck2 size={15} className="text-emerald-700 shrink-0" />
                      {signedContractFile || 'Adjuntar contrato firmado (PDF)'}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-800 border border-emerald-200 shrink-0">
                      Subir
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) setSignedContractFile(f.name)
                      }}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    11. Horario y Disponibilidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleAndAvailability}
                    onChange={(e) => setScheduleAndAvailability(e.target.value)}
                    className="w-full rounded-xl border border-[#decfc2] px-3.5 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#decfc2]">
            <button
              type="button"
              onClick={() => (step === 1 ? setRoute('landing') : setStep((s) => s - 1))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#decfc2] px-4 py-2.5 text-xs font-bold text-[#221610] cursor-pointer"
            >
              <ArrowLeft size={14} /> {step === 1 ? 'Cancelar' : 'Anterior'}
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2d1d16] hover:bg-[#422d22] text-white px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                Siguiente <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#a36b42] hover:bg-[#2d1d16] text-white px-6 py-2.5 text-xs font-extrabold cursor-pointer"
              >
                {currentUser ? 'Enviar solicitud a autorización' : 'Crear cuenta y enviar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
