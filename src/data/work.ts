/** The three kinds of reel in the grid, matching the filter row. */
export type WorkKind = 'bike-car' | 'shop' | 'offer'

export type WorkReel = {
  id: string
  title: string
  kind: WorkKind
  src: string
  poster: string
}

/**
 * Grid order is the order Niyaj sees on the page. Titles are placeholders he
 * can rename; the file names are the agreed drop-in slots in public/reels/.
 */
export const WORK_REELS: WorkReel[] = [
  { id: 'work-1', title: 'Bike edit', kind: 'bike-car', src: '/reels/work-1.mp4', poster: '/reels/work-1.jpg' },
  { id: 'work-2', title: 'Shop opening', kind: 'shop', src: '/reels/work-2.mp4', poster: '/reels/work-2.jpg' },
  { id: 'work-3', title: 'Weekend offer', kind: 'offer', src: '/reels/work-3.mp4', poster: '/reels/work-3.jpg' },
  { id: 'work-4', title: 'Car edit', kind: 'bike-car', src: '/reels/work-4.mp4', poster: '/reels/work-4.jpg' },
  { id: 'work-5', title: 'New stock', kind: 'shop', src: '/reels/work-5.mp4', poster: '/reels/work-5.jpg' },
  { id: 'work-6', title: 'Festival sale', kind: 'offer', src: '/reels/work-6.mp4', poster: '/reels/work-6.jpg' },
]

export const WORK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'bike-car', label: 'Bike and car' },
  { id: 'shop', label: 'Shops' },
  { id: 'offer', label: 'Offers' },
] as const

export type WorkFilter = (typeof WORK_FILTERS)[number]['id']
