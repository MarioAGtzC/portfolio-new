import ResponsePanel from '../../../components/ui/ResponsePanel';
import TechChips from '../../../components/ui/TechChips';
import { ABOUT_CATEGORIES } from '../data/about';

/** Order and labels for the skills table. "Tools and Workflow" is intentionally left out. */
const GROUPS = [
  { source: 'APIs & Integrations', label: 'APIs & Integrations', key: 'apis_integrations' },
  { source: 'Cloud & Serverless (AWS)', label: 'Cloud (AWS)', key: 'cloud_aws' },
  { source: 'DevOps & Delivery', label: 'DevOps & Delivery', key: 'devops_delivery' },
  { source: 'Back-end Developer', label: 'Back-end', key: 'backend' },
  { source: 'Databases', label: 'Databases', key: 'databases' },
  { source: 'Front-end Developer', label: 'Front-end', key: 'frontend' },
];

const rows = GROUPS.map((group) => ({
  ...group,
  skills: ABOUT_CATEGORIES.find((category) => category.title === group.source)?.skills ?? [],
}));

function SkillsTable() {
  const json = Object.fromEntries(rows.map((row) => [row.key, row.skills]));

  return (
    <section className='flex flex-col gap-[18px]'>
      <h2 className='text-[30px] font-semibold'>Skills</h2>
      <ResponsePanel path='/skills' status='200 OK' json={json} padded={false}>
        <dl>
          {rows.map((row, index) => (
            <div
              key={row.key}
              className={[
                'grid grid-cols-1 sm:grid-cols-[220px_minmax(0,1fr)]',
                index < rows.length - 1 ? 'border-b border-line' : '',
              ].join(' ')}
            >
              <dt className='px-[18px] pt-3.5 text-sm font-semibold sm:pb-3.5'>{row.label}</dt>
              <dd className='px-[18px] py-3'>
                <TechChips items={row.skills} />
              </dd>
            </div>
          ))}
        </dl>
      </ResponsePanel>
    </section>
  );
}

export default SkillsTable;
