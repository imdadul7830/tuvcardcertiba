import * as Icons from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

const defaultCourses = [
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
  },
];

export default function Services() {
  const { content } = useSiteContent();
  const coursesSection = content?.coursesSection || {
    title: 'Professional Training Courses',
    subtitle: 'Our Programs',
    description: 'Enroll in our globally recognized training programs. Upon completion, receive your official certificate and professional ID card.',
    items: defaultCourses
  };

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-blue-700 font-semibold tracking-wide uppercase">{coursesSection.subtitle}</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {coursesSection.title}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            {coursesSection.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesSection.items.map((course, index) => {
            // @ts-ignore
            const Icon = Icons[course.icon] || Icons.Book;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 border border-gray-100 group">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 mb-6 group-hover:bg-blue-700 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {course.description}
                </p>
                <a href="#contact" className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800">
                  Enroll Now
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
