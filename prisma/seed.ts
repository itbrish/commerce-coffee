import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("ðŸŒ± Populating AURA Atelier Coffee database with realistic machines...");

  try {
    await prisma.auditLog.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.wishlist.deleteMany({});
    await prisma.whatsAppLead.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.inventoryMovement.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.productSpecification.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.brand.deleteMany({});
    await prisma.promotion.deleteMany({});
    await prisma.cMSSection.deleteMany({});
    await prisma.cMSPage.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (e) {
    console.log("Cleaned tables or fresh DB");
  }

  // Admin Users
  const passwordHash = await bcrypt.hash("admin12345", 10);
  await prisma.user.create({
    data: {
      email: "admin@ateliercoffee.com",
      passwordHash,
      name: "Marcus Vance",
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      email: "sales@ateliercoffee.com",
      passwordHash,
      name: "Elena Rossi",
      role: "SALES",
    },
  });

  // Brands
  const brandsData = [
    { name: "La Marzocco", slug: "la-marzocco", countryOfOrigin: "Italy (Florence)", foundedYear: 1927, featured: true, description: "Iconic hand-crafted espresso machines engineered for unrivaled thermal stability and timeless Florentine design.", logoUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=300&q=80" },
    { name: "Rocket Espresso", slug: "rocket-espresso", countryOfOrigin: "Italy (Milan)", foundedYear: 2007, featured: true, description: "Fatto a Mano in Milano. Premium domestic and commercial espresso machines crafted with pure passion.", logoUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80" },
    { name: "Victoria Arduino", slug: "victoria-arduino", countryOfOrigin: "Italy (Belforte del Chienti)", foundedYear: 1905, featured: true, description: "Pioneering technological breakthroughs, sustainable efficiency, and haute-couture coffee aesthetics.", logoUrl: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=300&q=80" },
    { name: "Nuova Simonelli", slug: "nuova-simonelli", countryOfOrigin: "Italy", foundedYear: 1936, featured: true, description: "World Barista Championship certified engineering, high-volume consistency, and ergonomic precision.", logoUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80" },
    { name: "Eureka", slug: "eureka", countryOfOrigin: "Italy (Florence)", foundedYear: 1920, featured: true, description: "Silent Technology leader in specialty coffee grinding and stepless micrometric grind regulation.", logoUrl: "https://images.unsplash.com/photo-1587080413959-06b859fb107d?auto=format&fit=crop&w=300&q=80" },
    { name: "Mazzer", slug: "mazzer", countryOfOrigin: "Italy (Venice)", foundedYear: 1948, featured: true, description: "The gold standard in commercial flat and conical burr grinders worldwide.", logoUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=300&q=80" },
    { name: "ECM", slug: "ecm", countryOfOrigin: "Germany", foundedYear: 1996, featured: false, description: "German engineering meets Italian espresso culture with polished stainless steel perfection.", logoUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=300&q=80" },
    { name: "Rancilio", slug: "rancilio", countryOfOrigin: "Italy (Parabiago)", foundedYear: 1927, featured: false, description: "Legendary extraction reliability trusted by generations of roasters and specialty baristas.", logoUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80" }
  ];

  const brandMap = new Map();
  for (const b of brandsData) {
    const created = await prisma.brand.create({ data: b });
    brandMap.set(b.slug, created.id);
  }

  // Categories
  const categoriesData = [
    { name: "Home Espresso Machines", slug: "home-espresso-machines", featured: true, description: "Exceptional compact multi-boiler and heat exchanger machines designed for the sophisticated home barista.", imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80" },
    { name: "Commercial Espresso Machines", slug: "commercial-espresso-machines", featured: true, description: "High-capacity multi-group espresso powerhouses crafted for high-volume cafes, luxury hotels, and roasteries.", imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80" },
    { name: "Coffee Grinders", slug: "coffee-grinders", featured: true, description: "Stepless, low-retention precision grinders delivering uniform particle distribution for optimal extraction.", imageUrl: "https://images.unsplash.com/photo-1587080413959-06b859fb107d?auto=format&fit=crop&w=800&q=80" },
    { name: "Coffee Accessories", slug: "coffee-accessories", featured: true, description: "Precision tamper stations, bottomless portafilters, distribution tools, and milk pitchers.", imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80" },
    { name: "Water Filtration", slug: "water-filtration", featured: false, description: "Professional reverse osmosis and multi-stage mineral balancing systems safeguarding your boilers.", imageUrl: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80" },
    { name: "Spare Parts", slug: "spare-parts", featured: false, description: "OEM shower screens, silicone gaskets, group head diffusers, and pressure gauges.", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80" }
  ];

  const categoryMap = new Map();
  for (const c of categoriesData) {
    const created = await prisma.category.create({ data: c });
    categoryMap.set(c.slug, created.id);
  }

  // Realistic Products list
  const products = [
    { name: "La Marzocco Linea Mini", slug: "la-marzocco-linea-mini", sku: "LM-LM-001", brandSlug: "la-marzocco", categorySlug: "home-espresso-machines", shortDescription: "The benchmark for luxury home espresso with dual stainless steel boilers and saturated brew group.", description: "Re-imagined by La Marzocco for the espresso connoisseur, the Linea Mini brings commercial heritage directly to the kitchen counter. Features dual stainless steel boilers, PID thermal regulation, integrated group head, and seamless La Marzocco Home app connectivity.", price: 95000000, compareAtPrice: 102000000, stock: 8, weight: 30000, featured: true, bestseller: true, newArrival: false, requiresConsultation: false, whatsappEnabled: true, boilerType: "Dual Boiler (Stainless Steel)", pumpType: "Rotary Vane", powerWatts: 1820, voltage: "220-240V", waterTankLitres: 2.5, groupHeads: 1, dimensions: "35.7 x 37.7 x 45.3 cm", usageType: "HOME", images: ["https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Coffee Boiler", value: "0.17 L", group: "Thermal System", order: 1 }, { name: "Steam Boiler", value: "3.0 L", group: "Thermal System", order: 2 }, { name: "Warranty", value: "2 Years Official Warranty", group: "General", order: 3 }] },
    { name: "La Marzocco Linea Micra", slug: "la-marzocco-linea-micra", sku: "LM-MC-002", brandSlug: "la-marzocco", categorySlug: "home-espresso-machines", shortDescription: "Ultra-compact dual boiler masterpiece with lightning 5-minute warm up time.", description: "The Linea Micra is a clean, compact espresso machine that elevates the home coffee routine without compromise. Engineered with easy-to-use dimensions and uncompromising dual boiler performance.", price: 72000000, compareAtPrice: 78000000, stock: 5, weight: 19000, featured: true, bestseller: true, newArrival: true, requiresConsultation: false, whatsappEnabled: true, boilerType: "Dual Boiler", pumpType: "Rotary Vane", powerWatts: 1600, voltage: "220-240V", waterTankLitres: 2.0, groupHeads: 1, dimensions: "34 x 29 x 39 cm", usageType: "HOME", images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Warm-up Time", value: "5 Minutes", group: "Performance", order: 1 }, { name: "Warranty", value: "2 Years Official Warranty", group: "General", order: 2 }] },
    { name: "Rocket Appartamento TCA", slug: "rocket-appartamento-tca", sku: "RCK-APP-003", brandSlug: "rocket-espresso", categorySlug: "home-espresso-machines", shortDescription: "Iconic Italian styling with heat exchanger boiler, electronic temperature control, and circular cutouts.", description: "The Appartamento TCA is the next evolution of Rocket's most celebrated domestic espresso machine. Refined aesthetics and modernized temperature stability bring Italian cafe culture to design-forward homes.", price: 36500000, compareAtPrice: 39000000, stock: 12, weight: 23000, featured: true, bestseller: false, newArrival: true, requiresConsultation: false, whatsappEnabled: true, boilerType: "Heat Exchanger (Copper)", pumpType: "Vibratory", powerWatts: 1350, voltage: "220V", waterTankLitres: 2.5, groupHeads: 1, dimensions: "27.4 x 36 x 42.5 cm", usageType: "HOME", images: ["https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Boiler Capacity", value: "1.8 L Copper", group: "Thermal System", order: 1 }, { name: "Group Head", value: "Famous E61 Thermosyphon", group: "Performance", order: 2 }] },
    { name: "Victoria Arduino Eagle One Prima", slug: "victoria-arduino-eagle-one-prima", sku: "VA-PRIMA-005", brandSlug: "victoria-arduino", categorySlug: "home-espresso-machines", shortDescription: "Sustainable NEO engine with instant brew heating and architectural Italian luxury styling.", description: "PRIMA is a versatile coffee machine equipped with NEO (New Engine Optimization) for ultra-efficient, immediate temperature delivery.", price: 110000000, compareAtPrice: 118000000, stock: 4, weight: 37000, featured: true, bestseller: false, newArrival: true, requiresConsultation: true, whatsappEnabled: true, boilerType: "NEO Multi-Boiler Instant", pumpType: "Rotary Vane", powerWatts: 2600, voltage: "220-240V", waterTankLitres: 1.5, groupHeads: 1, dimensions: "41.1 x 37.9 x 51 cm", usageType: "DUAL", images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Heating System", value: "NEO Instantaneous", group: "Thermal System", order: 1 }] },
    { name: "Victoria Arduino Black Eagle Maverick 2-Group", slug: "victoria-arduino-black-eagle-maverick-2gr", sku: "VA-BEM-006", brandSlug: "victoria-arduino", categorySlug: "commercial-espresso-machines", shortDescription: "Competition-grade commercial espresso machine with Gravimetric extraction and PureBrew technology.", description: "Designed for world champions and avant-garde coffee establishments. Features T3 Genius multi-boiler architecture and Gravimetric extraction.", price: 340000000, compareAtPrice: 365000000, stock: 2, weight: 90000, featured: true, bestseller: true, newArrival: true, requiresConsultation: true, whatsappEnabled: true, boilerType: "T3 Genius Multi-Boiler", pumpType: "Rotary Commercial", powerWatts: 6900, voltage: "380-415V 3-Phase", waterTankLitres: null, groupHeads: 2, dimensions: "80.6 x 43.4 x 67.4 cm", usageType: "COMMERCIAL", images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Extraction Tech", value: "Gravitech Real-Time Weight", group: "Performance", order: 1 }] },
    { name: "Nuova Simonelli Appia Life Compact 2-Group", slug: "nuova-simonelli-appia-life-compact-2gr", sku: "NS-APP-008", brandSlug: "nuova-simonelli", categorySlug: "commercial-espresso-machines", shortDescription: "Compact commercial workhorse designed for high productivity in space-conscious cafes.", description: "Appia Life Compact condenses proven durability into a 55cm width with Soft Infusion System (SIS).", price: 68000000, compareAtPrice: 74000000, stock: 7, weight: 45000, featured: false, bestseller: true, newArrival: false, requiresConsultation: false, whatsappEnabled: true, boilerType: "Single Boiler Heat Exchanger (7.5L)", pumpType: "Rotary Vane", powerWatts: 2900, voltage: "220-240V", waterTankLitres: null, groupHeads: 2, dimensions: "55.4 x 53 x 54.5 cm", usageType: "COMMERCIAL", images: ["https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "SIS Infusion", value: "Soft Infusion System", group: "Performance", order: 1 }] },
    { name: "Eureka Mignon Specialita Grinder", slug: "eureka-mignon-specialita", sku: "EUR-SP-010", brandSlug: "eureka", categorySlug: "coffee-grinders", shortDescription: "55mm flat hardened steel burrs with silent grinding technology and responsive touchscreen.", description: "The gold standard home grinder from Florence. Features Eureka's patented micrometric stepless regulation, 55mm burrs, anti-clump ACE system, and whisper-quiet motor dampening.", price: 11500000, compareAtPrice: 12500000, stock: 20, weight: 5600, featured: true, bestseller: true, newArrival: false, requiresConsultation: false, whatsappEnabled: true, boilerType: null, pumpType: null, powerWatts: 310, voltage: "220V", waterTankLitres: null, groupHeads: null, dimensions: "12 x 35 x 18 cm", usageType: "HOME", images: ["https://images.unsplash.com/photo-1587080413959-06b859fb107d?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Burr Size", value: "55mm Flat Steel", group: "Grinding", order: 1 }, { name: "Noise Level", value: "60 dB Silent Technology", group: "Performance", order: 2 }] },
    { name: "Eureka Mignon Single Dose Oro", slug: "eureka-mignon-single-dose-oro", sku: "EUR-SD-011", brandSlug: "eureka", categorySlug: "coffee-grinders", shortDescription: "Near-zero retention 65mm Diamond Inside burrs for single-dose specialty coffee purists.", description: "Inclined 15-degree chassis paired with 65mm Diamond Inside cryogenically treated burrs and ELR blow-up system.", price: 16800000, compareAtPrice: 18500000, stock: 14, weight: 7200, featured: true, bestseller: false, newArrival: true, requiresConsultation: false, whatsappEnabled: true, boilerType: null, pumpType: null, powerWatts: 320, voltage: "220V", waterTankLitres: null, groupHeads: null, dimensions: "12.8 x 32.1 x 26 cm", usageType: "HOME", images: ["https://images.unsplash.com/photo-1587080413959-06b859fb107d?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Burrs", value: "65mm Diamond Inside", group: "Grinding", order: 1 }] },
    { name: "Mazzer Super Jolly V Pro Electronic", slug: "mazzer-super-jolly-v-pro", sku: "MAZ-SJ-012", brandSlug: "mazzer", categorySlug: "coffee-grinders", shortDescription: "Commercial grinder legend reimagined with GFC clumping control and digital dosage memory.", description: "The latest evolution of the iconic Super Jolly for medium-volume cafes demanding effortless consistency.", price: 24500000, compareAtPrice: 26000000, stock: 9, weight: 15000, featured: false, bestseller: true, newArrival: false, requiresConsultation: false, whatsappEnabled: true, boilerType: null, pumpType: null, powerWatts: 350, voltage: "220-240V", waterTankLitres: null, groupHeads: null, dimensions: "24 x 60 x 42 cm", usageType: "COMMERCIAL", images: ["https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Burr Diameter", value: "64mm Flat Steel", group: "Grinding", order: 1 }] },
    { name: "ECM Synchronika Dual Boiler", slug: "ecm-synchronika-dual-boiler", sku: "ECM-SYN-014", brandSlug: "ecm", categorySlug: "home-espresso-machines", shortDescription: "Dual stainless steel boiler craftsmanship with discreet PID display and anthracite powder chassis.", description: "German engineering meeting Milanese design with independent stainless steel boilers and whisper rotary pump.", price: 54000000, compareAtPrice: 58000000, stock: 5, weight: 35000, featured: false, bestseller: false, newArrival: true, requiresConsultation: false, whatsappEnabled: true, boilerType: "Dual Stainless Steel Boilers", pumpType: "Rotary Vane", powerWatts: 1600, voltage: "230V", waterTankLitres: 2.8, groupHeads: 1, dimensions: "33.5 x 41 x 49 cm", usageType: "HOME", images: ["https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Steam Boiler", value: "2.0 L Stainless Steel", group: "Thermal System", order: 1 }] },
    { name: "Rancilio Silvia Pro X", slug: "rancilio-silvia-pro-x", sku: "RAN-SPX-015", brandSlug: "rancilio", categorySlug: "home-espresso-machines", shortDescription: "Dual PID boilers with variable soft infusion in a rugged compact footprint.", description: "The beloved Silvia platform upgraded with dual boilers, dual PID regulation, and pressure gauge.", price: 29500000, compareAtPrice: 32000000, stock: 11, weight: 20000, featured: false, bestseller: true, newArrival: false, requiresConsultation: false, whatsappEnabled: true, boilerType: "Dual Brass & Stainless Boilers", pumpType: "Vibratory with Variable Soft Infusion", powerWatts: 1300, voltage: "220-240V", waterTankLitres: 2.0, groupHeads: 1, dimensions: "25 x 39 x 42 cm", usageType: "HOME", images: ["https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Steam Boiler", value: "1.0 L Stainless", group: "Thermal System", order: 1 }] },
    { name: "Atelier Precision 58.5mm Calibrated Tamper", slug: "atelier-calibrated-tamper-585", sku: "ACC-TMP-017", brandSlug: "la-marzocco", categorySlug: "coffee-accessories", shortDescription: "Flat precision 58.5mm stainless steel base with constant 15kg dynamic force levelling.", description: "Eliminates human channeling errors with perfectly perpendicular puck compression at exact 15kg pressure.", price: 1850000, compareAtPrice: 2200000, stock: 40, weight: 650, featured: false, bestseller: true, newArrival: false, requiresConsultation: false, whatsappEnabled: true, boilerType: null, pumpType: null, powerWatts: null, voltage: null, waterTankLitres: null, groupHeads: null, dimensions: "6 x 9 cm", usageType: "DUAL", images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Base Size", value: "58.55mm Precision", group: "Build", order: 1 }] },
    { name: "Acaia Lunar Precision Espresso Scale", slug: "acaia-lunar-scale", sku: "ACC-ACA-019", brandSlug: "rocket-espresso", categorySlug: "coffee-accessories", shortDescription: "Water-resistant 0.1g ultra-fast response digital scale built for espresso drip trays.", description: "The gold standard laboratory instrument for espresso measurement with real-time flow rate indicator.", price: 4950000, compareAtPrice: 5300000, stock: 16, weight: 320, featured: true, bestseller: true, newArrival: false, requiresConsultation: false, whatsappEnabled: true, boilerType: null, pumpType: null, powerWatts: null, voltage: null, waterTankLitres: null, groupHeads: null, dimensions: "10.5 x 10.5 x 1.5 cm", usageType: "DUAL", images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85"], specs: [{ name: "Resolution", value: "0.1 g Micro Precision", group: "Performance", order: 1 }] }
  ];

  for (const p of products) {
    const brandId = brandMap.get(p.brandSlug);
    const categoryId = categoryMap.get(p.categorySlug);
    if (!brandId || !categoryId) continue;

    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brandId,
        categoryId,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        weight: p.weight,
        featured: p.featured,
        bestseller: p.bestseller,
        newArrival: p.newArrival,
        requiresConsultation: p.requiresConsultation,
        whatsappEnabled: p.whatsappEnabled,
        boilerType: p.boilerType,
        pumpType: p.pumpType,
        powerWatts: p.powerWatts,
        voltage: p.voltage,
        waterTankLitres: p.waterTankLitres,
        groupHeads: p.groupHeads,
        dimensions: p.dimensions,
        usageType: p.usageType,
        seoTitle: p.name + " | Official Atelier Coffee Indonesia",
        seoDescription: p.shortDescription,
        images: {
          create: p.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            order: idx,
            altText: p.name + " - View " + (idx + 1)
          }))
        },
        specifications: {
          create: p.specs.map(s => ({
            name: s.name,
            value: s.value,
            group: s.group,
            order: s.order
          }))
        },
        inventoryMovements: {
          create: {
            type: "PURCHASE",
            quantity: p.stock,
            balanceAfter: p.stock,
            notes: "Initial inventory allocation"
          }
        }
      }
    });
    console.log("Seeded:", createdProduct.name);
  }

  // CMS Page & Sections
  await prisma.cMSPage.create({
    data: {
      slug: "home",
      title: "Home - Atelier Du Cafe",
      sections: {
        create: [
          {
            key: "hero",
            title: "The Art of Exceptional Coffee",
            subtitle: "Curated collection of the world's most revered espresso machines and precision grinding instruments.",
            ctaText: "Explore Collection",
            ctaUrl: "/shop",
            imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1920&q=90",
            order: 1,
            isActive: true
          },
          {
            key: "curated_machines",
            title: "Masterpieces of Extraction",
            subtitle: "Engineering precision meeting timeless artisanal aesthetics for the connoisseur's countertop.",
            order: 2,
            isActive: true
          },
          {
            key: "craft_story",
            title: "Thermal Stability & Uncompromising Craft",
            subtitle: "Every degree matters. Experience commercial saturated groups, PID stability, and rotary performance designed to elevate single-origin terroir.",
            imageUrl: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1600&q=85",
            ctaText: "Read Our Philosophy",
            ctaUrl: "/about",
            order: 3,
            isActive: true
          },
          {
            key: "commercial_solutions",
            title: "Commercial & Hospitality Solutions",
            subtitle: "Tailored equipment consultation, white-glove installation, water treatment engineering, and 24/7 barista technician support for premium hospitality establishments.",
            ctaText: "Consult Our Coffee Specialist",
            ctaUrl: "/consultation",
            order: 4,
            isActive: true
          },
          {
            key: "why_atelier",
            title: "The Atelier Standard",
            subtitle: "Official Factory Warranty - Certified Barista Calibration - White-Glove Nationwide Setup - Genuine Italian Heritage",
            order: 5,
            isActive: true
          }
        ]
      }
    }
  });

  console.log("Seed completed successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
