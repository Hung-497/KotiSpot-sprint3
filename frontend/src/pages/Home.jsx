import DiscoverProperty from "../components/DiscoverProperty";
import PropertySearch from "../components/PropertySearch";
import realestate from "../assets/realestate.png";
import realestateDark from "../assets/realestate_dark.png";
import { useState } from "react";
import { House, ShieldCheck, Users, Leaf } from "lucide-react";

const Home = ({ properties, favorites, onToggleFavorite, isLoading = false }) => {
  const [filteredProperties, setFilteredProperties] = useState(null);

  const visibleProperties = filteredProperties ?? properties;

  return (
    <main className="bg-canvas dark:bg-[#081520]">
      <section className="relative h-104 overflow-visible bg-cover bg-center sm:h-110">
      <div
      className="absolute inset-0 bg-cover bg-center dark:hidden"
        style={{
          backgroundImage: `url(${realestate})`,
          backgroundPosition: "center 10%",
          borderBottomLeftRadius: "50% 12%",
          borderBottomRightRadius: "50% 12%",
        }}
      /> 
   
      <div
      className="absolute inset-0 hidden bg-cover bg-center dark:block dark:brightness-110"
        style={{
          backgroundImage: `url(${realestateDark})`,
    }}
      />  

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/85 via-white/30 to-transparent sm:hidden dark:from-[#081520]/85 dark:via-[#081520]/30" />

        <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-24 lg:px-10">
          <div className="ks-hero-copy relative w-fit">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-5 -inset-y-8 z-0 bg-white/70 backdrop-blur-xl mask-[radial-gradient(ellipse_closest-side_at_center,black_40%,transparent_100%)] sm:-inset-x-12 sm:-inset-y-10 dark:bg-[#081520]/50 dark:backdrop-blur-sm dark:mask-[radial-gradient(ellipse_at_center,black_45%,transparent_75%)]"
            />
            <p className="relative z-10 text-xs font-semibold tracking-[3px] text-[#173451] dark:text-[#55d4aa]">
              FIND YOUR SPOT
            </p>

            <h1 className="relative z-10 mt-3 text-3xl font-bold sm:text-4xl leading-[1.05] text-[#08243f] dark:text-white">
              Search for a house
              <br />
              to <span className=" text-[#12a77d] dark:text-[#55d4aa]"> buy or rent </span>
            </h1>

            <p className="relative z-10 mt-3 text-sm text-[#294158] dark:text-white/85">
              Discover your next home in Finland.
            </p>

            <p className="relative z-10 text-sm text-[#294158] dark:text-white/75">
              Simple. Trusted. For a better tomorrow.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 w-190 max-w-[90%] -translate-x-1/2">
          <PropertySearch
            onResults={setFilteredProperties}
            placeholder="Search by city, area, or property type..."
            compact
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 hidden h-32 bg-linear-to-b from-transparent via-[#081520]/70 to-[#081520] dark:block" />
      </section>

      <section className="bg-[#fefffe] py-5 dark:border-y dark:relative
    dark:z-10
    dark:mx-auto
    dark:-mt-3
    dark:max-w-6xl
    dark:rounded-2xl
    dark:border
    dark:border-white/10
    dark:bg-[#0b1f2b]/45
    dark:py-5
    dark:backdrop-blur-2xl
    dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">

  <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-y-6 px-4 sm:px-6 lg:grid-cols-4 lg:gap-y-0 lg:px-10">

    <div className="flex min-w-0 items-center gap-2 border-r border-gray-200 pr-3 sm:gap-4 lg:pr-8 dark:border-white/10">
      <div className="flex h-10 w-10 shrink-0 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#e8f6f1] text-[#10a77d] dark:bg-[#123b38] dark:text-[#55e0b4] dark:shadow-[0_0_18px_rgba(85,224,180,0.08)]">
        <House size={25} strokeWidth={1.8} />
      </div>

      <div>
          <p className="text-sm font-bold text-[#08243f] dark:text-white">
            1000+
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-[#9eabb5]">
            Verified properties
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 border-gray-200 pl-3 sm:gap-4 lg:border-r lg:px-8 dark:border-white/10">
        <div className="flex h-10 w-10 shrink-0 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#e8f6f1] text-[#10a77d] dark:bg-[#123b38] dark:text-[#55e0b4] dark:shadow-[0_0_18px_rgba(85,224,180,0.08)]">
          <ShieldCheck size={25} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-sm font-bold text-[#08243f] dark:text-white">
            Trusted platform
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-[#9eabb5]">
            Safe and secure
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 border-r border-gray-200 pr-3 sm:gap-4 lg:px-8 dark:border-white/10">
        <div className="flex h-10 w-10 shrink-0 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#e8f6f1] text-[#10a77d] dark:bg-[#123b38] dark:text-[#55e0b4] dark:shadow-[0_0_18px_rgba(85,224,180,0.08)]">
          <Users size={25} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-sm font-bold text-[#08243f] dark:text-white">
            Local expertise
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-[#9eabb5]">
            Across Finland
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 pl-3 sm:gap-4 lg:pl-8">
        <div className="flex h-10 w-10 shrink-0 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#e8f6f1] text-[#10a77d] dark:bg-[#123b38] dark:text-[#55e0b4] dark:shadow-[0_0_18px_rgba(85,224,180,0.08)]">
          <Leaf size={25} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-sm font-bold text-[#08243f] dark:text-white">
            A better tomorrow
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-[#9eabb5]">
            Sustainable living
          </p>
        </div>
      </div>

    </div>
  </section>

      <section className="bg-white py-8 dark:bg-[linear-gradient(to_bottom,#081520_0%,#0a1d2b_45%,#103044_100%)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#08243f] sm:text-3xl dark:text-white">
              Discover properties
            </h2>
          </div>

          <div className="mt-4">
            <DiscoverProperty
              isLoading={isLoading}
              properties={visibleProperties}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
