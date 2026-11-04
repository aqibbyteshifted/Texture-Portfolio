import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationView } from "@/components/features/ConfirmationView";

export const metadata: Metadata = {
  title: "Request Dispatched",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="container-page py-32" aria-busy="true" />}>
      <ConfirmationView />
    </Suspense>
  );
}
