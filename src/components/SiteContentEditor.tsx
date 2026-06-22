import { useState, useEffect } from 'react';
import { useSiteContent } from '../context/ContentContext';

export default function SiteContentEditor() {
  const { content, refreshContent } = useSiteContent();
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleChange = (section: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData({ ...formData, stats: newStats });
  };

  const handleCourseChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.coursesSection.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({
      ...formData,
      coursesSection: {
        ...formData.coursesSection,
        items: newItems
      }
    });
  };

  const addCourse = () => {
    setFormData({
      ...formData,
      coursesSection: {
        ...formData.coursesSection,
        items: [...formData.coursesSection.items, { title: 'New Course', description: '', icon: 'Book' }]
      }
    });
  };

  const removeCourse = (index: number) => {
    const newItems = formData.coursesSection.items.filter((_: any, i: number) => i !== index);
    setFormData({
      ...formData,
      coursesSection: {
        ...formData.coursesSection,
        items: newItems
      }
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.featuresSection.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({
      ...formData,
      featuresSection: {
        ...formData.featuresSection,
        items: newItems
      }
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      featuresSection: {
        ...formData.featuresSection,
        items: [...formData.featuresSection.items, { title: 'New Feature', description: '', icon: 'Star' }]
      }
    });
  };

  const removeFeature = (index: number) => {
    const newItems = formData.featuresSection.items.filter((_: any, i: number) => i !== index);
    setFormData({
      ...formData,
      featuresSection: {
        ...formData.featuresSection,
        items: newItems
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Site content updated successfully!');
        refreshContent();
      }
    } catch (e) {
      alert('Failed to update site content');
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) return <div>Loading content...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <input type="text" value={formData.hero.subtitle} onChange={e => handleChange('hero', 'subtitle', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" value={formData.hero.imageUrl} onChange={e => handleChange('hero', 'imageUrl', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title Part 1</label>
            <input type="text" value={formData.hero.title1} onChange={e => handleChange('hero', 'title1', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title Highlight</label>
            <input type="text" value={formData.hero.titleHighlight} onChange={e => handleChange('hero', 'titleHighlight', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea rows={3} value={formData.hero.description} onChange={e => handleChange('hero', 'description', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Button Text</label>
            <input type="text" value={formData.hero.buttonText} onChange={e => handleChange('hero', 'buttonText', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Stats Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.stats.map((stat: any, index: number) => (
            <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded border border-gray-100">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500">Value</label>
                <input type="text" value={stat.value} onChange={e => handleStatChange(index, 'value', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1.5 border bg-white" />
              </div>
              <div className="flex-[2]">
                <label className="block text-xs font-medium text-gray-500">Label</label>
                <input type="text" value={stat.label} onChange={e => handleStatChange(index, 'label', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1.5 border bg-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {formData.coursesSection && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Courses Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input type="text" value={formData.coursesSection.subtitle} onChange={e => handleChange('coursesSection', 'subtitle', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" value={formData.coursesSection.title} onChange={e => handleChange('coursesSection', 'title', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea rows={2} value={formData.coursesSection.description} onChange={e => handleChange('coursesSection', 'description', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Course List</h3>
              <button type="button" onClick={addCourse} className="text-blue-700 text-sm font-medium hover:underline">+ Add Course</button>
            </div>
            {formData.coursesSection.items.map((course: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded border border-gray-100 relative pr-10">
                <button type="button" onClick={() => removeCourse(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">×</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Title</label>
                    <input type="text" value={course.title} onChange={e => handleCourseChange(index, 'title', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1.5 border bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Icon (lucide-react name)</label>
                    <input type="text" value={course.icon} onChange={e => handleCourseChange(index, 'icon', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1.5 border bg-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500">Description</label>
                    <textarea rows={2} value={course.description} onChange={e => handleCourseChange(index, 'description', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1.5 border bg-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {formData.featuresSection && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Features Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" value={formData.featuresSection.title} onChange={e => handleChange('featuresSection', 'title', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea rows={2} value={formData.featuresSection.description} onChange={e => handleChange('featuresSection', 'description', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Features List</h3>
              <button type="button" onClick={addFeature} className="text-blue-700 text-sm font-medium hover:underline">+ Add Feature</button>
            </div>
            {formData.featuresSection.items.map((feature: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded border border-gray-100 relative pr-10">
                <button type="button" onClick={() => removeFeature(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">×</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Title</label>
                    <input type="text" value={feature.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1.5 border bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Icon (lucide-react name)</label>
                    <input type="text" value={feature.icon} onChange={e => handleFeatureChange(index, 'icon', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1.5 border bg-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500">Description</label>
                    <textarea rows={2} value={feature.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1.5 border bg-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Contact & Footer Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" value={formData.contact.phone} onChange={e => handleChange('contact', 'phone', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fax</label>
            <input type="text" value={formData.contact.fax} onChange={e => handleChange('contact', 'fax', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="text" value={formData.contact.email} onChange={e => handleChange('contact', 'email', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea rows={2} value={formData.contact.address} onChange={e => handleChange('contact', 'address', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
          </div>
        </div>
      </div>

      <div className="flex justify-end sticky bottom-4">
        <button disabled={isSaving} type="submit" className="bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-800 font-bold disabled:opacity-50 transition-colors">
          {isSaving ? 'Saving...' : 'Save Site Content'}
        </button>
      </div>
    </form>
  );
}
