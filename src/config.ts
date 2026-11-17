/**
 * The few things that change outside the design: where the accounts point and
 * where "Book a reel" sends people. Edit this file, no component needs to know.
 */

export const LINKS = {
  instagram: 'https://www.instagram.com/framesnfold',
  instagramPersonal: 'https://www.instagram.com/nawaz_frames',
  youtube: 'https://www.youtube.com/@framesnfold',

  /**
   * WhatsApp number in international format, digits only, no plus or spaces:
   * Niyaj's number 91 98765 43210 would be '919876543210'. Leave it empty and
   * the booking button asks for a DM on Instagram instead.
   */
  whatsappNumber: '',
  /** Pre-filled WhatsApp message. */
  whatsappMessage: "Hi Nawaz, I'd like a reel for my shop.",
}

export type BookLink = { href: string; label: string }

/**
 * Where the booking button goes: WhatsApp when a number is configured,
 * otherwise an Instagram DM. Both leave the site.
 */
export function bookLink(): BookLink {
  const number = LINKS.whatsappNumber.replace(/\D/g, '')
  if (number) {
    return {
      href: `https://wa.me/${number}?text=${encodeURIComponent(LINKS.whatsappMessage)}`,
      label: 'Book a reel on WhatsApp',
    }
  }
  return { href: 'https://ig.me/m/framesnfold', label: 'Book a reel on Instagram' }
}
