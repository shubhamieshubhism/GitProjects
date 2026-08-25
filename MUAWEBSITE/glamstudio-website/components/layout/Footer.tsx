import Link from "next/link";
import { Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold text-primary">
              GlamStudio
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional makeup artistry for weddings, parties, and special
              events.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-muted-foreground hover:text-primary">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:hello@glamstudio.com" className="text-muted-foreground hover:text-primary">
                  hello@glamstudio.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Follow Us</h4>
            <div className="mt-2 flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GlamStudio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}