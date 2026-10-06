import PageLoader from "../components/PageLoader";
import useMinimumDuration, { PAGE_LOADING_MS } from "../hooks/useMinimumDuration";
import Properties from "../components/Properties";

const Favorites = ({ properties: visibleProperties, favorites, onToggleFavorite, isLoading = false }) => {
  const hasMinimumLoadingElapsed = useMinimumDuration(PAGE_LOADING_MS);
  const favoriteProperties = visibleProperties.filter(property => favorites.includes(property.id));
  if (isLoading || !hasMinimumLoadingElapsed) {
    return <PageLoader label="Loading your favourites…" fullPage />;
  }
  return (
    <main className="ks-container py-8 md:py-12">
      <header className="mb-7">
        <h1 className="ks-page-title">Favorites</h1>
        <p className="mt-2 text-ink-muted">Your saved properties, all in one place.</p>
      </header>
      {favoriteProperties.length === 0 ? (
        <p className="ks-notice">No favorite properties yet.</p>
      ) : (
        <Properties properties={favoriteProperties} favorites={favorites} onToggleFavorite={onToggleFavorite} />
      )}
    </main>
  );
};
export default Favorites;
