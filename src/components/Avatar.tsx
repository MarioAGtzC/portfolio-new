export default function Avatar() {
  return (
    <div className='rounded-full bg-gradient-to-tr from-green-500 to-zinc-500 p-1 flex'>
      <img
        src='/public/a.png'
        alt='Avatar'
        className='rounded-full lg:max-w-[250px] sm:max-w-[200px] max-w-[150px]'
      />
    </div>
  );
}