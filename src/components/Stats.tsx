import { useSiteContent } from '../context/ContentContext';

export default function Stats() {
  const { content } = useSiteContent();
  const stats = content?.stats || [
    { label: "Years of Training", value: "25+" },
    { label: "Expert Instructors", value: "50+" },
    { label: "Courses Offered", value: "120+" },
    { label: "Graduates Certified", value: "10k+" }
  ];

  return (
    <section className="bg-blue-900 py-16 relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-800/10 rounded-r-full transform -translate-x-1/3"></div>
      <div className="absolute inset-y-0 right-0 w-1/2 bg-blue-800/10 rounded-l-full transform translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.value}</span>
              <span className="text-blue-200 font-medium tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
