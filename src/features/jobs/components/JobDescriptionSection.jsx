export function JobDescriptionSection({ job }) {
  const { fullDescription } = job;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
      <div className="max-w-none space-y-4 text-gray-900">
        {fullDescription.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-gray-700">
            {paragraph}
          </p>
        ))}

        <h3 className="mb-3 mt-6 text-lg font-semibold">
          Required Qualifications
        </h3>
        <ul className="list-inside list-disc space-y-2 text-sm text-gray-500">
          {fullDescription.qualifications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="mb-3 mt-6 text-lg font-semibold">What We Offer</h3>
        <ul className="list-inside list-disc space-y-2 text-sm text-gray-500">
          {fullDescription.benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default JobDescriptionSection;
