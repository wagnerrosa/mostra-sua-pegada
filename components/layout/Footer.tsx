import Image from 'next/image'

export default function Footer() {
  return (
    <footer
      className="w-full flex items-center justify-center"
      style={{
        backgroundColor: '#000000',
        padding: '24px 24px',
        marginTop: '0',
      }}
    >
      <Image
        src="/poweredby_plantongenius.svg"
        alt="Powered by PLANTON|genius"
        width={160}
        height={28}
        priority={false}
      />
    </footer>
  )
}
