import { motion, useScroll, useTransform } from "framer-motion";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

function LandingNavbar() {
    const { scrollY } = useScroll();
    const navbarHeight = useTransform(scrollY, [0, 100], [90, 70]);
    const navbarShadow = useTransform(scrollY, [0, 100], ['none', '0 4px 20px rgba(139, 92, 246, 0.1)']);
    const navbarOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
            style={{
                height: navbarHeight,
                boxShadow: navbarShadow,
                opacity: navbarOpacity,
            }}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* LOGO */}
                <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-2xl font-bold font-poppins">
                            ProdX
                        </span>
                        <div className="w-2 h-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full ml-1"></div>
                    </div>
                </motion.div>

                {/* CENTER NAVIGATION */}
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-8">
                        {['Features', 'Study Tools', 'Pricing', 'Resources', 'About'].map((item) => (
                            <NavigationMenuItem key={item}>
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <NavigationMenuLink
                                        className="text-slate-700 hover:text-slate-900 font-inter font-medium text-sm relative group cursor-pointer transition-colors duration-200"
                                    >
                                        {item}
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                                            initial={false}
                                        />
                                    </NavigationMenuLink>
                                </motion.div>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* RIGHT BUTTONS */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-blue-600 font-inter font-medium hover:bg-blue-50">
                        Sign In
                    </Button>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button className="bg-linear-to-r from-blue-600 to-purple-600 text-white font-inter font-medium px-6 rounded-xl hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300">
                            Start Free Trial
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    )
}

export default LandingNavbar;