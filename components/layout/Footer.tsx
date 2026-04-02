import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="flex items-center justify-center py-2">
      <Image
        src="/poweredby_plantongenius.svg"
        alt="Powered by PLANTON|genius"
        width={160}
        height={32}
        priority={false}
      />
    </footer>
  )
}
