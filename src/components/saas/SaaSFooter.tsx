import { Link } from 'react-router-dom';

const footerLinks = {
    Product: ['Features', 'Pricing', 'Dashboard', 'Integrations', 'API'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Resources: ['Documentation', 'Help Center', 'Changelog', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Security'],
};

export default function SaaSFooter() {
    return (
        <footer className="bg-foreground text-background py-16 lg:py-20">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                {/* Top */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs">H</span>
                            </div>
                            <span className="text-base font-bold text-background tracking-tight">
                                Hospitality<span className="text-accent">OS</span>
                            </span>
                        </Link>
                        <p className="text-xs text-background/25 leading-relaxed max-w-[200px]">
                            All-in-one hotel and restaurant management platform.
                        </p>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <p className="text-[10px] uppercase tracking-widest font-semibold text-background/30 mb-4">{category}</p>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-xs text-background/40 hover:text-background/70 transition-colors duration-200"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-background/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-background/20 tracking-wider">
                        &copy; {new Date().getFullYear()} HospitalityOS. All rights reserved.
                    </p>
                    <Link
                        to="/admin/login"
                        className="text-[10px] text-background/20 hover:text-accent tracking-wider transition-colors duration-200"
                    >
                        Staff Portal
                    </Link>
                </div>
            </div>
        </footer>
    );
}
