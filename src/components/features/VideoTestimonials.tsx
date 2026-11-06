"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useT } from "@/i18n/client";
import type { Testimonial } from "@/types";

function VideoCard({ item }: { item: Testimonial & { video: NonNullable<Testimonial["video"]> } }) {
  const t = useT();
  const [playing, setPlaying] = useState(false);
  const { youtubeId, file, poster } = item.video;
  const thumb = poster ?? (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined);

  return (
    <article className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div className="relative aspect-video bg-ink">
        {playing ? (
          youtubeId ? (
            <iframe
              title={item.name}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <video src={file} poster={thumb} controls autoPlay playsInline className="absolute inset-0 size-full" />
          )
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`${t("Play video testimonial")}: ${item.name}`} className="group absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {thumb && <img src={thumb} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />}
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-clay-500 text-white shadow-lift transition-transform group-hover:scale-110">
                <Play aria-hidden="true" className="size-7 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-5">
        <p className="font-bold">{item.name}</p>
        <p className="text-xs text-ink-muted">{item.meta}</p>
        <p className="mt-2 line-clamp-3 text-sm text-ink-soft">“{item.quote}”</p>
      </div>
    </article>
  );
}

export function VideoTestimonials({ items }: { items: Testimonial[] }) {
  const withVideo = items.filter((i): i is Testimonial & { video: NonNullable<Testimonial["video"]> } =>
    Boolean(i.video && (i.video.youtubeId || i.video.file)),
  );
  if (withVideo.length === 0) return null;
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {withVideo.map((item) => (
        <li key={item.id}>
          <VideoCard item={item} />
        </li>
      ))}
    </ul>
  );
}
