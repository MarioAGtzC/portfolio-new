import Avatar from './components/Avatar';
import NameTitle from './components/NameTitle';

export default function App() {
  return (
    <div className='bg-zinc-900'>
      <main className='min-h-screen text-white flex flex-col justify-center items-center'>
        <Avatar/>
        <NameTitle/>
      </main>
      <section className='min-h-screen 2xl:mx-96 xl:mx-80 lg:mx-64 md:mx-48 sm:mx-32 mx-8 text-white flex flex-col justify-center items-center'>
        <h1 className='text-5xl sm:text-7xl mb-7 sm:mb-15 text-center'>Work Experience</h1>
        <ol className='relative border-s border-green-900'>
          <li className='mb-10 ms-8'>
            <span className='absolute w-6 h-6 bg-green-900 rounded-full -start-3.5'></span>
            <h3>text</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae corporis ipsum dolore sit nulla beatae, tempore soluta, blanditiis officia similique neque iure deserunt nesciunt, odit laborum eveniet? Provident, quas officiis.</p>
          </li>
          <li className='mb-10 ms-8'>
            <span className='absolute w-6 h-6 bg-green-900 rounded-full -start-3.5'></span>
            <h3>text</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae corporis ipsum dolore sit nulla beatae, tempore soluta, blanditiis officia similique neque iure deserunt nesciunt, odit laborum eveniet? Provident, quas officiis.</p>
          </li>
          <li className='ms-8'>
            <span className='absolute w-6 h-6 bg-green-900 rounded-full -start-3.5'></span>
            <h3>text</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae corporis ipsum dolore sit nulla beatae, tempore soluta, blanditiis officia similique neque iure deserunt nesciunt, odit laborum eveniet? Provident, quas officiis.</p>
          </li>
        </ol>
      </section>
    </div>
  )
}