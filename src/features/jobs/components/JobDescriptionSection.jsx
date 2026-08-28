export function JobDescriptionSection({ job }) {
  const desc = job.description || '';
  const reqs = job.requirements || '';
  const benefits = job.benefits || '';

  const paragraphs = job.fullDescription?.paragraphs || 
    desc.split('\n\n').map(p => p.trim()).filter(Boolean);

  const qualifications = job.fullDescription?.qualifications || 
    reqs.split('\n').map(item => item.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean);

  const benefitsList = job.fullDescription?.benefits || 
    benefits.split('\n').map(item => item.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean);

  return (
    <div className="job-desc-card rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
      <div className="max-w-none space-y-4 text-gray-900">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-500">No description provided.</p>
        )}

        {qualifications.length > 0 && (
          <>
            <h3 className="mb-3 mt-6 text-lg font-semibold">
              Required Qualifications
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
              {qualifications.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {benefitsList.length > 0 && (
          <>
            <h3 className="mb-3 mt-6 text-lg font-semibold">What We Offer</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
              {benefitsList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default JobDescriptionSection;
