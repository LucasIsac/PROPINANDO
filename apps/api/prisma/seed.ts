import { PrismaClient, UserRole, SplitMode, VerificationStatus } from '../src/generated/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de Propinando...')

  await prisma.auditLog.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.tipSplit.deleteMany()
  await prisma.tip.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.sector.deleteMany()
  await prisma.venueAdmin.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.user.deleteMany()
  await prisma.propinanduConfig.deleteMany()

  console.log('   limpieza completada')

  await prisma.propinanduConfig.create({
    data: { commissionRate: 0.0800 },
  })
  console.log('   config global creada (comisión 8%)')

  const passwordHash = await bcrypt.hash('Propinando123!', 12)

  const superAdmin = await prisma.user.create({
    data: {
      email: 'super@propinando.com',
      passwordHash,
      firstName: 'Carlos',
      lastName: 'Gomez',
      role: UserRole.SUPER_ADMIN,
      twoFactorEnabled: false,
    },
  })

  const storeAdmin = await prisma.user.create({
    data: {
      email: 'admin@lasresidencias.com',
      passwordHash,
      firstName: 'María',
      lastName: 'López',
      role: UserRole.STORE_ADMIN,
      twoFactorEnabled: false,
    },
  })

  const employeeUser1 = await prisma.user.create({
    data: {
      email: 'juan@lasresidencias.com',
      passwordHash,
      firstName: 'Juan',
      lastName: 'Pérez',
      role: UserRole.EMPLOYEE,
    },
  })

  const employeeUser2 = await prisma.user.create({
    data: {
      email: 'ana@lasresidencias.com',
      passwordHash,
      firstName: 'Ana',
      lastName: 'Rodríguez',
      role: UserRole.EMPLOYEE,
    },
  })

  const employeeUser3 = await prisma.user.create({
    data: {
      email: 'martin@lasresidencias.com',
      passwordHash,
      firstName: 'Martín',
      lastName: 'Fernández',
      role: UserRole.EMPLOYEE,
    },
  })

  console.log('   usuarios creados (password: Propinando123!)')

  const venue = await prisma.venue.create({
    data: {
      name: 'Las Residencias',
      cuit: '30-71234567-8',
      address: 'Av. Corrientes 1234, CABA',
      type: 'restaurant',
      isActive: true,
      isSandbox: true,
      commissionRate: 0.0800,
    },
  })

  await prisma.venueAdmin.create({
    data: {
      userId: storeAdmin.id,
      venueId: venue.id,
      isOwner: true,
    },
  })

  console.log('   local "Las Residencias" creado (modo sandbox)')

  const sectorMozo = await prisma.sector.create({
    data: {
      venueId: venue.id,
      name: 'Mozo',
      splitMode: SplitMode.EQUAL,
      displayOrder: 1,
    },
  })

  const sectorCocina = await prisma.sector.create({
    data: {
      venueId: venue.id,
      name: 'Cocina',
      splitMode: SplitMode.EQUAL,
      displayOrder: 2,
    },
  })

  const sectorBarra = await prisma.sector.create({
    data: {
      venueId: venue.id,
      name: 'Barra',
      splitMode: SplitMode.EQUAL,
      displayOrder: 3,
    },
  })

  console.log('   sectores creados: Mozo, Cocina, Barra')

  const employee1 = await prisma.employee.create({
    data: {
      userId: employeeUser1.id,
      venueId: venue.id,
      sectorId: sectorMozo.id,
      displayName: 'Juan',
      verificationStatus: VerificationStatus.APROBADO,
      isActive: true,
    },
  })

  const employee2 = await prisma.employee.create({
    data: {
      userId: employeeUser2.id,
      venueId: venue.id,
      sectorId: sectorMozo.id,
      displayName: 'Ana',
      verificationStatus: VerificationStatus.APROBADO,
      isActive: true,
    },
  })

  const employee3 = await prisma.employee.create({
    data: {
      userId: employeeUser3.id,
      venueId: venue.id,
      sectorId: sectorBarra.id,
      displayName: 'Martín',
      verificationStatus: VerificationStatus.APROBADO,
      isActive: true,
    },
  })

  console.log('   empleados creados y aprobados')

  const now = new Date()

  for (let i = 0; i < 5; i++) {
    const grossAmount = [500, 1000, 1500, 2000, 800][i]
    const commissionRate = 0.08
    const commissionAmount = grossAmount * commissionRate
    const netAmount = grossAmount - commissionAmount
    const rating = [5, 4, 5, 3, 5][i]

    await prisma.tip.create({
      data: {
        venueId: venue.id,
        sectorId: sectorMozo.id,
        employeeId: i % 2 === 0 ? employee1.id : employee2.id,
        grossAmount,
        commissionRate,
        commissionAmount,
        netAmount,
        rating,
        comment: ['Excelente atención!', 'Muy amable', null, 'Buena comida', 'Rápido y eficiente'][i] as string | null,
        status: 'PAGADO',
        mpPreferenceId: `sandbox_pref_${i + 1}`,
        mpPaymentId: `sandbox_pay_${i + 1}`,
        mpStatus: 'approved',
        paidAt: new Date(now.getTime() - i * 3600000),
      },
    })
  }

  console.log('   5 propinas de ejemplo creadas (estado PAGADO)')

  console.log('\n✅ Seed completado exitosamente')
  console.log('\n📋 Credenciales de acceso:')
  console.log('   Super Admin : super@propinando.com / Propinando123!')
  console.log('   Store Admin : admin@lasresidencias.com / Propinando123!')
  console.log('   Empleado 1  : juan@lasresidencias.com / Propinando123!')
  console.log('   Empleado 2  : ana@lasresidencias.com / Propinando123!')
  console.log('   Empleado 3  : martin@lasresidencias.com / Propinando123!')
  console.log('\n⚠️  Todos los locales inician en modo sandbox.')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
