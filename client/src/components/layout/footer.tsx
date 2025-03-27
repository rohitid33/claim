import { Link } from "wouter";

const menuItems = [
  { title: "About Us", link: "/about-us" },
  { title: "Events", link: "/events" },
  { title: "Products", link: "/products" },
  { title: "News", link: "/news" },
  { title: "Blog", link: "/blog" },
  { title: "Media", link: "/media" },
  { title: "Careers", link: "/careers" },
  { title: "Refer and Earn", link: "/refer" },
  { title: "Partner With Us", link: "/partner" },
  { title: "Talk to an Expert", link: "/consult" }
];

export default function Footer() {
  return (
    <footer className="bg-[#002B4E] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Logo and Legal Text */}
        <div className="mb-8">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <div className="relative">
                <span className="text-xl font-bold">Claimsutra</span>
                <span className="absolute -top-1 -right-3 text-[10px] text-white font-medium">TM</span>
              </div>
            </a>
          </Link>
          <p className="mt-4 text-sm opacity-80">
            Please note that we are a facilitating platform enabling access to reliable professionals. 
            We are not a law firm and do not provide legal services ourselves. 
            The information on this website is for the purpose of knowledge only and should not be relied upon as legal advice or opinion.
          </p>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.link}>
              <a className="text-sm hover:text-primary transition-colors">
                {item.title}
              </a>
            </Link>
          ))}
        </div>

        {/* Company Info */}
        <div className="text-sm opacity-80 mb-8">
          <p>© {new Date().getFullYear()} Claimsutra, A Product of Vakilsutra Pvt Ltd, All rights reserved.</p>
        </div>

        {/* Legal Links and Copyright */}
        <div className="border-t border-white/20 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 text-sm">
            <Link href="/terms">
              <a className="hover:text-primary">Terms of Service</a>
            </Link>
            <Link href="/privacy">
              <a className="hover:text-primary">Privacy Policy</a>
            </Link>
            <Link href="/refund">
              <a className="hover:text-primary">Refund Policy</a>
            </Link>
          </div>
          <div className="flex gap-4">
            <a href="https://facebook.com/claimsutra" target="_blank" rel="noopener" className="hover:text-primary">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com/claimsutra" target="_blank" rel="noopener" className="hover:text-primary">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com/company/claimsutra" target="_blank" rel="noopener" className="hover:text-primary">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
