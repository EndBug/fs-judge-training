"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";

const urlRegex =
  /https?:\/\/(www\.)?intimescoring.com\/view\/flight\/\d+\/\d+\/\d+/;

export interface InTimeScoringProps {
  handleSave: (url: string) => void;
}

export function InTimeScoring(props: InTimeScoringProps) {
  const [url, setUrl] = useState<string>("");
  const [savedUrl, setSavedUrl] = useState<string>("");

  const isSaveDisabled = useMemo(() => !urlRegex.test(url), [url]);
  useEffect(() => props.handleSave(savedUrl), [savedUrl, props]);

  return (
    <div className="flex flex-col items-center gap-4">
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
          Save
        </Button>
      </div>

      <p className="text-center">
        Streaming via InTimeScoring may introduce a few moments of buffering.
        <br />
        For this reason, the timer will increase the working time by 5s.
        <br />
        Remember to check the times of your scores for the correct working time.
      </p>

      {savedUrl && <iframe src={savedUrl} className="h-[50vh] w-[60vw]" />}
    </div>
  );
}
