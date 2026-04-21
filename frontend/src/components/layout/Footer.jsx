import { Link } from 'react-router-dom';

const LINKS = {
  Platform:  [{ l: 'Browse Gigs', t: '/gigs' }, { l: 'Become a Seller', t: '/register' }, { l: 'How it Works', t: '/#how' }],
  Company:   [{ l: 'About SCARR', t: '#' }, { l: 'Careers', t: '#' }, { l: 'Press', t: '#' }],
  Support:   [{ l: 'Help Center', t: '#' }, { l: 'Trust & Safety', t: '#' }, { l: 'Contact', t: '#' }],
};

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-auto">
      <div className="page-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-2xl font-display font-700 text-white">SCARR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-scarr-red" />
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Elite freelancing. Where the best work happens.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <p className="text-xs font-700 uppercase tracking-widest text-white/30 mb-4">{heading}</p>
              <ul className="space-y-2.5">
                {items.map(({ l, t }) => (
                  <li key={l}>
                    <Link to={t} className="text-sm text-white/60 hover:text-white transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} SCARR. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
