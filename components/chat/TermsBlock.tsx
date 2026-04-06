interface TermsBlockProps {
  showAvatar?: boolean
}

const TERMS_TEXT = `Vivamus aliquam lacus eget iaculis placerat. Nam sed nisl arcu. Praesent sed risus leo. Fusce sit amet vestibulum mi. Proin mattis fermentum neque, vitae vestibulum mauris sollicitudin non. In ullamcorper, lorem semper aliquam eleifend, lectus nulla mollis mauris, vitae posuere enim leo sit amet felis. Curabitur dignissim, lorem id fermentum aliquam, libero augue feugiat ligula, at condimentum erat lorem accumsan tellus. In ac massa ipsum. Phasellus ut fringilla lorem, sed semper diam. Donec convallis dignissim viverra. Donec sed feugiat mi. Vivamus eget posuere nunc.

Pellentesque non diam rhoncus, finibus justo ut, aliquet est. Vivamus aliquam lacus eget iaculis placerat. Nam sed nisl arcu. Praesent sed risus leo. Fusce sit amet vestibulum mi. Proin mattis fermentum neque, vitae vestibulum mauris sollicitudin non. In ullamcorper, lorem semper aliquam eleifend, lectus nulla mollis mauris, vitae posuere enim leo sit amet felis. Curabitur dignissim, lorem id fermentum aliquam, libero augue feugiat ligula, at condimentum erat lorem accumsan tellus. In ac massa ipsum. Phasellus ut fringilla lorem, sed semper diam. Donec convallis dignissim viverra. Donec sed feugiat mi. Vivamus eget posuere nunc.

Pellentesque non diam rhoncus, finibus justo ut, aliquet est. Vivamus aliquam lacus eget iaculis placerat. Nam sed nisl arcu. Praesent sed risus leo. Fusce sit amet vestibulum mi. Proin mattis fermentum neque, vitae vestibulum mauris sollicitudin non. In ullamcorper, lorem semper aliquam eleifend, lectus nulla mollis mauris, vitae posuere enim leo sit amet felis. Curabitur dignissim, lorem id fermentum aliquam, libero augue feugiat ligula, at condimentum erat lorem accumsan tellus. In ac massa ipsum. Phasellus ut fringilla lorem, sed semper diam. Donec convallis dignissim viverra. Donec sed feugiat mi.`

export default function TermsBlock({ showAvatar = true }: TermsBlockProps) {
  return (
    <div className="flex items-end" style={{ gap: '12px', maxWidth: '90%' }}>
      {/* Avatar slot — aligned to bottom like in the Figma prototype */}
      <div
        className="shrink-0"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '28px',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: 'var(--color-black)',
          minWidth: '34px',
          visibility: showAvatar ? 'visible' : 'hidden',
        }}
        aria-hidden="true"
      >
        N.
      </div>

      {/* Scrollable terms text */}
      <div
        style={{
          fontFamily: 'var(--font-text)',
          fontSize: '13px',
          lineHeight: '1.6',
          color: 'var(--color-black)',
          maxHeight: '280px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          paddingRight: '8px',
        }}
      >
        {TERMS_TEXT}
      </div>
    </div>
  )
}
