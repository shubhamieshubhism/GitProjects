import { PrismaClient, Role, ServiceType, AppointmentStatus, EnquiryStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = "admin@glamstudio.com";
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      phone: "+1234567890",
    },
  });
  console.log(`✅ Admin user created: ${adminEmail}`);

  const services = [
    { title: "Bridal Makeup", description: "Complete bridal look with trial session and touch-up kit. Includes skin prep, foundation, eyes, lips, and setting spray.", price: 350, duration: 120, imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400", isActive: true },
    { title: "Party Makeup", description: "Glamorous makeup for weddings, proms, and special events. Customized to your outfit and style.", price: 200, duration: 60, imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400", isActive: true },
    { title: "Airbrush Makeup", description: "Flawless, lightweight coverage for photo-perfect skin. Lasts all day and feels like second skin.", price: 250, duration: 90, imageUrl: "https://images.unsplash.com/photo-1519368358672-25b03afee3bf?w=400", isActive: true },
    { title: "Trial Session", description: "Preview your bridal or party look before the big day. Test different styles and find what suits you.", price: 150, duration: 60, imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400", isActive: true },
    { title: "Editorial Makeup", description: "High-fashion, editorial looks for photoshoots, campaigns, and fashion shows. Creative and bold.", price: 300, duration: 120, imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", isActive: true },
    { title: "Custom Package", description: "Create a personalized makeup package for your unique needs. Contact us for a custom quote.", price: 0, duration: 0, imageUrl: null, isActive: true },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: `temp_${service.title}` },
      update: service,
      create: service,
    });
  }
  console.log(`✅ ${services.length} services seeded`);

  const userEmail = "user@example.com";
  const userPassword = await bcrypt.hash("User123!", 10);
  const sampleUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: "Sample User",
      passwordHash: userPassword,
      role: Role.USER,
      phone: "+1234567890",
    },
  });
  console.log(`✅ Sample user created: ${sampleUser.email}`);

  await prisma.enquiry.upsert({
    where: { id: "sample-enquiry" },
    update: {},
    create: {
      id: "sample-enquiry",
      name: "Sample Client",
      email: "client@example.com",
      phone: "+1234567890",
      eventDate: new Date("2026-01-15"),
      message: "Hello, I'm interested in bridal makeup for my wedding in January. Can you share availability?",
      status: EnquiryStatus.NEW,
    },
  });
  console.log("✅ Sample enquiry created");

  await prisma.appointment.upsert({
    where: { id: "sample-appointment" },
    update: {},
    create: {
      id: "sample-appointment",
      userId: sampleUser.id,
      serviceType: ServiceType.BRIDAL,
      date: new Date("2026-02-14"),
      timeSlot: "10:00-11:00",
      status: AppointmentStatus.PENDING,
      notes: "Bring trial photos for reference",
    },
  });
  console.log("✅ Sample appointment created");

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });