import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-clay-500">404</p>
        <h1 className="mt-3 text-3xl font-bold">This wall hasn&apos;t been textured yet</h1>
        <p className="mt-2 text-ink-soft">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">Back to Home</Button>
          <Button href="/textures" variant="secondary" size="lg">Browse Textures</Button>
        </div>
      </div>
    </div>
  );
}
