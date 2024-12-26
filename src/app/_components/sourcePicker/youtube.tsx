"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";

// youtu.be/ID
// youtube.com/watch?v=ID
// youtube.com/embed/ID

const urlRegex =
  /https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=)(\w+).*/;

export interface YouTubeProps {
  handleSave: (url: string) => void;
}

export function YouTube(props: YouTubeProps) {
  const t = useTranslations();

  const [url, setUrl] = useState<string>("");
  const [savedUrl, setSavedUrl] = useState<string>("");

  const isSaveDisabled = useMemo(() => !urlRegex.test(url), [url]);
  useEffect(() => {
    props.handleSave(savedUrl);
  }, [savedUrl, props]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-[500px] gap-1">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=ID"
        />
        <Button
          disabled={isSaveDisabled}
          onClick={() => {
            const id = urlRegex.exec(url)?.[1];
            if (id) setSavedUrl(`https://www.youtube.com/embed/${id}`);
          }}
          className="flex flex-col items-center justify-center gap-0"
        >
          {t("actions.save")}
        </Button>
      </div>

      {savedUrl && <iframe src={savedUrl} className="h-[75vh] w-[60vw]" />}
    </div>
  );
}
