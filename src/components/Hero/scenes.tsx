import type { CSSVars } from '../../types'

/*
 * Placeholder scenes for the three reel panels. Each scene is drawn at the
 * full width of a reel. Reel.tsx renders it three times: once as the single
 * continuous scene that stays on screen, and once per half for the fold
 * intro (two halves alone leave a hairline at the join).
 */

function Timecode() {
  return <span className="tc">00:00:00:00</span>
}

function Streak(props: { y: string; l: string; d: string; delay: string }) {
  const style: CSSVars = {
    '--y': props.y,
    '--l': props.l,
    '--d': props.d,
    '--delay': props.delay,
  }
  return <span className="streak" style={style} />
}

function Hud(props: { title: string }) {
  return (
    <>
      <div className="ui top">
        <span className="rec">
          <i />
          REC
        </span>
        <Timecode />
      </div>
      <div className="ui bottom">
        <b>{props.title}</b>
        <span>Sample frame</span>
        <div className="track">
          <em />
        </div>
      </div>
    </>
  )
}

export function BikeScene() {
  return (
    <div className="s s1" aria-hidden="true">
      <div className="sun" />
      <Streak y="18%" l="26cqw" d="1.5s" delay="-0.2s" />
      <Streak y="31%" l="38cqw" d="1.1s" delay="-0.7s" />
      <Streak y="47%" l="20cqw" d="1.8s" delay="-1.1s" />
      <Streak y="58%" l="44cqw" d="1.3s" delay="-0.4s" />
      <Streak y="66%" l="28cqw" d="1.6s" delay="-0.9s" />
      <div className="road" />
      <Hud title="Bike and car edit" />
    </div>
  )
}

export function ShopScene() {
  return (
    <div className="s s2" aria-hidden="true">
      <div className="big">
        NOW
        <br />
        OPEN
      </div>
      <Hud title="Shop opening" />
    </div>
  )
}

export function OfferScene() {
  return (
    <div className="s s3" aria-hidden="true">
      <div className="big">
        FLAT
        <br />
        30%
        <br />
        OFF
      </div>
      <div className="tag">This weekend only</div>
      <Hud title="Offer reel" />
    </div>
  )
}
