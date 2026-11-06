import { Button } from "@/components/ui/Button";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-clay-500">404</p>
        <h1 className="mt-3 text-3xl font-bold">{t("This wall hasn't been textured yet")}</h1>
        <p className="mt-2 text-ink-soft">{t("The page you're looking for doesn't exist or has moved.")}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">{t("Back to Home")}</Button>
          <Button href="/textures" variant="secondary" size="lg">{t("Browse Textures")}</Button>
        </div>
      </div>
    </div>
  );
}
