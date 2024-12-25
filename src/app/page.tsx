"use client";

import { useState } from "react";
import { SourcePicker } from "~/app/_components/sourcePicker/sourcePicker";
import { Select } from "~/app/_components/ui/select";
import { ModeToggle } from "./_components/mode-toggle";

export enum SourceType {
  Local,
  InTimeScoring,
}

export default function HomePage() {
  const [sourceType, setSourceType] = useState<SourceType | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          FS Judge Training
        </h1>
        <div className="flex flex-col items-center gap-4">
          <Select
            value={sourceType}
            onChange={setSourceType}
            placeholder="Select a source type"
            selectLabel="Sources"
            options={[
              { value: SourceType.InTimeScoring, label: "InTime Scoring" },
              { value: SourceType.Local, label: "Local file" },
            ]}
          />
          {sourceType !== null && (
            <SourcePicker sourceType={sourceType} handleSave={setVideoURL} />
          )}
          {videoURL}
        </div>
      </div>
    </main>
  );
}
