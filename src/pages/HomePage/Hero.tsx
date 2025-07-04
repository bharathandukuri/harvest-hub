import { Link } from "react-router-dom";

const HeroButton = ({ children, href }: { children: any; href: any }) => (
    <Link
        to={href}
        className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-colors duration-300 shadow-md"
    >
        {children}
    </Link>
);

function Hero({
    title = "Welcome to Harvest Hub",
    subtitle = "Discover fresh, local produce and connect with your community. Eat healthy, live sustainably, and support local farmers with Harvest Hub.",
    imageUrl = "https://media.istockphoto.com/id/1409236261/photo/healthy-food-healthy-eating-background-fruit-vegetable-berry-vegetarian-eating-superfood.jpg?s=612x612&w=0&k=20&c=kYZKgwsQbH_Hscl3mPRKkus0h1OPuL0TcXxZcO2Zdj0=",
    imageAlt = "A vibrant assortment of fresh vegetables and fruits",
    ctaText = "Explore Products",
    ctaHref = "/products",
}) {
    return (
        <section className="w-full bg-green-50 py-12 md:py-16 px-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 mb-4 drop-shadow-lg">
                            {title}
                        </h1>
                        <p className="text-lg md:text-xl text-green-700 mb-8">
                            {subtitle}
                        </p>
                        {ctaText && ctaHref && (
                            <HeroButton href={ctaHref}>{ctaText}</HeroButton>
                        )}
                    </div>
                    <div className="relative w-full h-[350px] md:h-[450px]">
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="rounded-2xl shadow-xl w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-50/60 to-transparent pointer-events-none"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
