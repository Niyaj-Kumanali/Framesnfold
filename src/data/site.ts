export type Project = {
  id: string
  index: string
  title: string
}

export type Service = {
  id: string
  title: string
  copy: string
}

export const PROJECTS: Project[] = [
  { id: 'frame-01', index: '01', title: 'Frame 01' },
  { id: 'frame-02', index: '02', title: 'Frame 02' },
  { id: 'frame-03', index: '03', title: 'Frame 03' },
  { id: 'frame-04', index: '04', title: 'Frame 04' },
  { id: 'frame-05', index: '05', title: 'Frame 05' },
  { id: 'frame-06', index: '06', title: 'Frame 06' },
]

export const SERVICES: Service[] = [
  { id: 'reels', title: 'Reels', copy: 'Short videos built for feeds, reels and stories.' },
  { id: 'edits', title: 'Edits', copy: 'Cut and polish footage you already have.' },
  { id: 'shoots', title: 'Shoots', copy: 'Capture new footage on location.' },
]

export const LINKS = {
  instagram: 'https://www.instagram.com/framesnfold/',
  dm: 'https://www.instagram.com/framesnfold/',
}

export const HERO_IMAGE = '/hero/nawaz-hero-trimmed.png'
