import Image from 'next/image'

export default function Footer() {
  return (
    <footer
      className="w-full flex items-center justify-center"
      style={{
        backgroundColor: '#000000',
        padding: '32px 24px',
        marginTop: '0',
      }}
    >
      <a
        href="https://www.planton.eco.br/"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Abrir site da Planton em nova aba"
      >
        <Image
          src="/poweredby_plantongenius.svg"
          alt="Powered by PLANTON|genius"
          width={220}
          height={30}
          priority={false}
        />
      </a>
    </footer>
  )
}
