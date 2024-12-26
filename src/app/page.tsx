"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SourcePicker } from "~/app/_components/sourcePicker/sourcePicker";
import { Select } from "~/app/_components/ui/select";
import { ModeToggle } from "./_components/mode-toggle";
import { Button } from "./_components/ui/button";

const KEY_POINT = "x";
const KEY_BUST = "c";
const ROUND_MS = 35000;

export enum SourceType {
  Local,
  InTimeScoring,
}

enum JudgeEvent {
  Bust,
  Point,
  Start,
}

export default function HomePage() {
  const [sourceType, setSourceType] = useState<SourceType | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [timerDisplay, setTimerDisplay] = useState<string>("00.000");

  const [app, setApp] = useState({
    isReady: false,
    isRoundOver: false,
    report: [] as [Date, JudgeEvent][],
  });

  const effectiveRoundMs = useMemo(
    () =>
      sourceType === SourceType.InTimeScoring ? ROUND_MS + 5000 : ROUND_MS,
    [sourceType],
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    setApp((curr) => {
      if (e.repeat || !curr.isReady) return curr;

      let nextReport = curr.report;
      if (e.key === KEY_POINT) {
        if (curr.report[0] === undefined) {
          nextReport = [...curr.report, [new Date(), JudgeEvent.Start]];
        } else {
          nextReport = [...curr.report, [new Date(), JudgeEvent.Point]];
        }
      } else if (e.key === KEY_BUST) {
        if (curr.report[0] !== undefined) {
          nextReport = [...curr.report, [new Date(), JudgeEvent.Bust]];
        }
      }

      return { ...curr, report: nextReport };
    });
  };

  useEffect(() => console.log(app.report), [app.report]);

  useEffect(() => {
    if (app.report[0] === undefined) return;
    if (app.isRoundOver) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff =
        now.getTime() -
        app.report
          .find(([_, action]) => action === JudgeEvent.Start)![0]
          .getTime();
      const seconds = Math.floor(diff / 1000);
      const milliseconds = diff % 1000;

      if (diff < effectiveRoundMs) {
        setTimerDisplay(
          `${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`,
        );
      } else {
        setTimerDisplay("35.000");
        setApp((curr) => ({ ...curr, isRoundOver: true }));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [app.report, app.isRoundOver]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-center">
              Point/Round start: {KEY_POINT.toUpperCase()}
              <br />
              Bust: {KEY_BUST.toUpperCase()}
            </p>

            {!app.isReady && videoURL !== null && (
              <div className="flex flex-col items-center justify-center gap-2">
                <p>Once the video is playing, press the start button</p>
                <Button
                  disabled={videoURL === null}
                  onClick={() => setApp((curr) => ({ ...curr, isReady: true }))}
                >
                  Start
                </Button>
              </div>
            )}
            {app.isReady && (
              <h2 className="text-xl font-semibold">{timerDisplay}</h2>
            )}

            {app.isRoundOver && (
              <div className="border-border-white flex justify-center">
                <p className="flex items-center justify-center border border-white px-3 py-1">
                  YOU
                </p>
                <div className="flex flex-wrap items-center justify-center">
                  {app.report
                    .filter((e) => e[1] !== JudgeEvent.Start)
                    .map((e, i) => (
                      <p
                        className="broder-white flex flex-1 flex-col items-center justify-center border border-white px-3 py-1"
                        key={i}
                      >
                        <span className="font-semibold">
                          {e[1] === JudgeEvent.Point ? (
                            <span className="text-green-500">1</span>
                          ) : (
                            <span className="text-red-500">0</span>
                          )}
                        </span>
                        <span
                          className={`flex flex-[3] ${e[0].getTime() - app.report[0]![0].getTime() > ROUND_MS ? "text-yellow-500" : ""}`}
                        >
                          {(
                            (e[0].getTime() - app.report[0]![0].getTime()) /
                            1000
                          ).toFixed(2)}
                        </span>
                      </p>
                    ))}
                </div>
              </div>
            )}

            {app.isRoundOver && (
              <Button
                onClick={() =>
                  setApp((curr) => ({
                    isReady: false,
                    isRoundOver: false,
                    report: [],
                  }))
                }
              >
                Restart
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
