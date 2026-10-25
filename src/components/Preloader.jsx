
import { Sprout, Leaf, Heart, Recycle } from "lucide-react";
import "./Preloader.css";

export default function Preloader() {
  return (
    <div className="sharecycle-preloader">
      <div className="preloader-glow glow-one" />
      <div className="preloader-glow glow-two" />

      <div className="preloader-leaf leaf-one">
        <Leaf size={25} />
      </div>
      <div className="preloader-leaf leaf-two">
        <Recycle size={24} />
      </div>
      <div className="preloader-leaf leaf-three">
        <Leaf size={20} />
      </div>

      <div className="preloader-content">
        <div className="preloader-logo-wrap">
          <div className="preloader-logo-ring" />
          <div className="preloader-logo">
            <Sprout size={46} strokeWidth={1.7} />
          </div>
          <span className="preloader-heart">
            <Heart size={14} fill="currentColor" />
          </span>
        </div>

        <h1 className="preloader-title">
          Share<span>Cycle</span>
        </h1>

        <div className="preloader-tagline">
          <span />
          GOOD THINGS GO AROUND
          <span />
        </div>

        <p className="preloader-message">
          Every little act of kindness makes a difference.
        </p>

        <div className="preloader-progress">
          <div className="preloader-progress-track">
            <div className="preloader-progress-fill" />
          </div>
          <span className="preloader-loading-label">
            Growing a better tomorrow...
          </span>
        </div>

        <div className="preloader-bottom">
          <span>Share more</span>
          <i />
          <span>Waste less</span>
          <i />
          <span>Care together</span>
        </div>
      </div>
    </div>
  );
}
