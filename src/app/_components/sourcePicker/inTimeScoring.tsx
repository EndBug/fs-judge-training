"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { api } from "~/trpc/react";

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
    () => !!error || !urlRegex.test(url),
    [url, error],
  );
  useEffect(() => setError(null), [url]);

  return (
    <div className="flex w-[500px]">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.intimescoring.com/view/flight/12/345/6"
      />
      <Button disabled={isSaveDisabled} onClick={() => setSavedUrl(url)}>
        Save
      </Button>
    </div>
  );
}
