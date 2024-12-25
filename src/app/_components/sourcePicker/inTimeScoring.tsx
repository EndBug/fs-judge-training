"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { api } from "~/trpc/react";
import { Spinner } from "../ui/spinner";

const urlRegex =
  /https?:\/\/(www\.)?intimescoring.com\/view\/flight\/\d+\/\d+\/\d+/;

export interface InTimeScoringProps {
  handleSave: (url: string) => void;
}

export function InTimeScoring(props: InTimeScoringProps) {
  const [url, setUrl] = useState<string>("");
  const [savedUrl, setSavedUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const sourceURL = api.intime.getVideoSource.useQuery(
    { url: savedUrl },
    { enabled: !!savedUrl },
  );

  useEffect(() => {
    if (sourceURL.isError)
      setError(
        "Couldn't get video from this source. Try with a different one.",
      );
    if (sourceURL.data) props.handleSave(sourceURL.data);
  }, [sourceURL, props]);

  const isSaveDisabled = useMemo(
    () => !!error || !urlRegex.test(url) || sourceURL.isLoading,
    [url, error, sourceURL],
  );
  useEffect(() => setError(null), [url]);

  return (
    <div className="flex w-[500px] gap-1">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.intimescoring.com/view/flight/12/345/6"
      />
      <Button
        disabled={isSaveDisabled}
        onClick={() => setSavedUrl(url)}
        className="flex flex-col items-center justify-center gap-0"
      >
        <span className={sourceURL.isLoading ? "invisible h-0" : ""}>Save</span>
        {sourceURL.isLoading && (
          <Spinner className="text-white dark:text-black" />
        )}
      </Button>
    </div>
  );
}
