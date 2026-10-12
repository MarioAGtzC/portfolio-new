function AboutSection() {
  return (
    <section className='flex flex-col gap-[18px]'>
      <h2 className='text-[30px] font-semibold'>About myself</h2>
      <p className='max-w-3xl text-xl text-ink-2'>
        Backend-focused full-stack engineer with a serverless-first mindset
      </p>

      <div className='mt-2 grid grid-cols-1 gap-6 text-[15px] leading-relaxed text-ink-2 lg:grid-cols-3'>
        <p>
          I'm a full-stack software engineer with professional experience across backend APIs, serverless architectures, and full-stack web development. I started out in 2020 as a full-stack web developer working with PHP, Node.js, and Flutter, then moved into enterprise work, and since 2022 I've been focused on backend engineering, building AWS-based microservices, conversational AI bots on Amazon Lex, and AI-powered tools for managing conversation context.
        </p>
        <p>
          My core stack is JavaScript/TypeScript and Node.js (Express, NestJS) on the backend, paired with React and Next.js on the frontend. I work a lot with AWS serverless services like Lambda, API Gateway, Lex, Connect, DynamoDB, S3, and CloudWatch, plus both SQL and NoSQL databases (PostgreSQL, MySQL, MongoDB, Redis). I also have experience with Python/Django, Terraform for infrastructure as code, and Docker, and I keep learning new things like AI-assisted development and semantic search.
        </p>
        <p>
          When I start a new project, I try to model the domain before writing any backend code. The goal is a system that can actually grow (new features, more scale, more complexity) without needing a rewrite down the line. I care about reliability just as much as functionality. Things like automatic payment reconciliation, audited flows, and CI-gated deployments aren't extras to me, they're part of building something people can actually rely on.
        </p>
      </div>
    </section>
  );
}

export default AboutSection;
