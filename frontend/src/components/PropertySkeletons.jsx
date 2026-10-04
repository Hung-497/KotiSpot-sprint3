const PropertySkeletons = ({ home = false }) => (
  <div role="status" aria-label="Loading properties" aria-busy="true">
    <span className="sr-only">Loading properties…</span>
    <ul className={home ? "properties" : "grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
      {Array.from({ length: 8 }, (_, index) => (
        <li key={index} aria-hidden="true" className={home ? "w-60" : ""}>
          <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
            <div className={home ? "ks-skeleton h-28.75" : "ks-skeleton aspect-4/3"} />
            <div className="space-y-2.5 px-4 pb-4 pt-3.5">
              <div className="ks-skeleton h-5 w-2/5 rounded" />
              <div className="ks-skeleton h-4 w-3/4 rounded" />
              <div className="ks-skeleton h-3 w-1/3 rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
export default PropertySkeletons;
