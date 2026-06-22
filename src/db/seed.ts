import { eq } from 'drizzle-orm';
import { db } from './index';
import { users, trainees, settings, siteContent } from './schema';

export async function seedDatabase() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    await db.insert(users).values({
      id: "1",
      username: "admin",
      password: "admin123",
      name: "Administrator"
    });
  }

  const existingTrainees = await db.select().from(trainees);
  if (existingTrainees.length === 0) {
    await db.insert(trainees).values({
      id: "2345678901",
      name: "MUHAMMAD IRSHAD ZARIN",
      iqama: "2345678901",
      company: "HOPEWAY COMPANY",
      project: "OXAGON (NEOM)",
      course: "MANLIFT/SCISSOR LIFT OPERATOR",
      photoUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=256&h=256",
      issueDate: "2024-07-02",
      expiryDate: "2025-07-01",
      trainedBy: "REEZAM HUSSAIN",
      approvedBy: "SAYED RAFIK ABDULLAH",
      levelCategory: "NA",
      status: "Valid"
    });
  }

  const existingSettings = await db.select().from(settings);
  if (existingSettings.length === 0) {
    await db.insert(settings).values({
      id: "default",
      courses: [
        "MANLIFT/SCISSOR LIFT OPERATOR",
        "ISO 9001 Lead Auditor",
        "Occupational Health & Safety (NEBOSH)",
        "ISO 27001 Information Security",
        "Environmental Management ISO 14001"
      ],
      branches: [
        "OXAGON (NEOM)",
        "Riyadh HQ",
        "Jeddah Branch"
      ]
    });
  }

  const existingContent = await db.select().from(siteContent);
  if (existingContent.length === 0) {
    await db.insert(siteContent).values({
      id: "default",
      data: {
        hero: {
          subtitle: "Certiva TÜV Training & Certification",
          title1: "Empower your career with",
          titleHighlight: "Certified Quality",
          description: "World-class training programs in Saudi Arabia. Graduates receive internationally recognized certificates and professional ID cards with QR code verification.",
          buttonText: "View Courses",
          imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000"
        },
        stats: [
          { label: "Years of Training", value: "25+" },
          { label: "Expert Instructors", value: "50+" },
          { label: "Courses Offered", value: "120+" },
          { label: "Graduates Certified", value: "10k+" }
        ],
        contact: {
          phone: "+966 11 412 8734",
          email: "info@certiva-tuv.com",
          address: "Olayya Street, King Fahd District, Riyadh 11543, Saudi Arabia",
          fax: "+966 11 412 8735"
        },
        coursesSection: {
          title: "Professional Training Courses",
          subtitle: "Our Programs",
          description: "Enroll in our globally recognized training programs. Upon completion, receive your official certificate and professional ID card.",
          items: [
            {
              title: 'Quality Management (ISO 9001)',
              description: 'Learn to implement and audit Quality Management Systems. Become a certified Lead Auditor.',
              icon: 'UserCheck',
            },
            {
              title: 'Occupational Health & Safety',
              description: 'NEBOSH & IOSH certified training for occupational health, safety, and risk management.',
              icon: 'Flame',
            },
            {
              title: 'Information Security (ISO 27001)',
              description: 'Comprehensive training on cyber security, data protection, and IT infrastructure security.',
              icon: 'ShieldCheck',
            },
            {
              title: 'Environmental Management',
              description: 'ISO 14001 certification training covering environmental policies, impact, and sustainability.',
              icon: 'Building2',
            },
            {
              title: 'IT & Digital Transformation',
              description: 'Practical training on modern IT frameworks, cloud computing, and digital service management.',
              icon: 'Code',
            },
            {
              title: 'Corporate Leadership',
              description: 'Advanced management programs tailored for executives focusing on compliance and strategy.',
              icon: 'GraduationCap',
            }
          ]
        },
        featuresSection: {
          title: "Official Certificates & ID Cards",
          description: "Upon successful completion of your training program, you will be awarded an internationally recognized certificate alongside a professional ID card. Both items are securely verifiable.",
          items: [
            {
              title: "Globally Recognized Certificates",
              description: "Our certificates carry the official Certiva TÜV seal, providing undeniable proof of your qualifications to employers worldwide.",
              icon: "BadgeCheck"
            },
            {
              title: "Professional ID Cards",
              description: "Carry your credentials wherever you go. The high-quality printed ID card showcases your name, photo, and certified roles.",
              icon: "IdCard"
            },
            {
              title: "QR Code Verification",
              description: "Every certificate and ID card features a unique QR code. Employers can instantly scan it to verify authenticity and current validity status via our portal.",
              icon: "QrCode"
            }
          ]
        }
      }
    });
  }
}
