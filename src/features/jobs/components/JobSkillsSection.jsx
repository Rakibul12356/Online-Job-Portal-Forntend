export function JobSkillsSection({ skills }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Required Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default JobSkillsSection;
