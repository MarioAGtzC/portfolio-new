function AboutSection() {
  return (
    <section className='relative mx-auto max-w-7xl overflow-hidden px-5 pt-16 pb-10 md:px-16'>
      <h2
        aria-hidden='true'
        className='pointer-events-none absolute -top-6 left-0 hidden w-full translate-y-0 leading-none font-black whitespace-nowrap text-neutral-100 select-none sm:block sm:text-[140px] lg:text-[200px] dark:text-neutral-900/60 text-center'
      >
        About Me
      </h2>

      <div className='relative'>
        <h2 className='font-recoleta text-4xl font-black text-primary sm:text-5xl'>
          About myself
        </h2>
        <p className='mt-4 w-full text-2xl font-light text-neutral-700 md:w-3/4 lg:w-2/3 xl:w-1/2 dark:text-neutral-300'>
          Backend-focused full-stack engineer with a serverless-first mindset
        </p>

        <div className='mt-10 flex flex-col gap-6 lg:flex-row'>
          <p className='w-full text-neutral-500 lg:w-1/3 dark:text-neutral-400'>
            I'm a full-stack software engineer with professional experience across backend APIs, serverless architectures, and full-stack web development. I started out in 2020 as a full-stack web developer working with PHP, Node.js, and Flutter, then moved into enterprise work, and since 2022 I've been focused on backend engineering, building AWS-based microservices, conversational AI bots on Amazon Lex, and AI-powered tools for managing conversation context.
          </p>
          <p className='w-full text-neutral-500 lg:w-1/3 dark:text-neutral-400'>
            My core stack is JavaScript/TypeScript and Node.js (Express, NestJS) on the backend, paired with React and Next.js on the frontend. I work a lot with AWS serverless services like Lambda, API Gateway, Lex, Connect, DynamoDB, S3, and CloudWatch, plus both SQL and NoSQL databases (PostgreSQL, MySQL, MongoDB, Redis). I also have experience with Python/Django, Terraform for infrastructure as code, and Docker, and I keep learning new things like AI-assisted development and semantic search.
          </p>
          <p className='w-full text-neutral-500 lg:w-1/3 dark:text-neutral-400'>
            When I start a new project, I try to model the domain before writing any backend code. The goal is a system that can actually grow (new features, more scale, more complexity) without needing a rewrite down the line. I care about reliability just as much as functionality. Things like automatic payment reconciliation, audited flows, and CI-gated deployments aren't extras to me, they're part of building something people can actually rely on.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
