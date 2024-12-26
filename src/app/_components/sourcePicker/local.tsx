"use client";

import { useEffect, useState } from "react";
import { Input } from "~/app/_components/ui/input";

export interface LocalProps {
  handleSave: (url: string) => void;
}

export function Local(props: LocalProps) {
  const [savedUrl, setSavedUrl] = useState<string>("");

  useEffect(() => props.handleSave(savedUrl), [savedUrl, props]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-[500px] gap-1">
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              const url = URL.createObjectURL(file);
              setSavedUrl(url);
              console.log(url);
            }
          }}
          accept="video/*"
        />
      </div>

      {savedUrl && <iframe src={savedUrl} className="h-[50vh] w-[60vw]" />}
    </div>
  );
}
