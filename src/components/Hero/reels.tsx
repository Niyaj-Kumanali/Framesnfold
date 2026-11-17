import type { ReelData } from '../../types'
import { BikeScene, OfferScene, ShopScene } from './scenes'

/** The three kinds of work. Order here is the cycle order. */
export const REELS: ReelData[] = [
  {
    id: 'bike-car',
    label: 'Bike and car pages',
    phrase: 'bike and car pages.',
    Scene: BikeScene,
    video: { src: '/reels/bike.mp4', poster: '/reels/bike.jpg' },
  },
  {
    id: 'shop-opening',
    label: 'Shop openings',
    phrase: 'shop openings.',
    Scene: ShopScene,
    video: { src: '/reels/shop.mp4', poster: '/reels/shop.jpg' },
  },
  {
    id: 'offers',
    label: 'Weekend offers',
    phrase: 'weekend offers.',
    Scene: OfferScene,
    video: { src: '/reels/offer.mp4', poster: '/reels/offer.jpg' },
  },
]
