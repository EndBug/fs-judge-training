"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SourcePicker,
  SourceType,
} from "~/app/_components/sourcePicker/sourcePicker";
import { Select } from "~/app/_components/ui/select";
import { ModeToggle } from "../_components/mode-toggle";
import { Button } from "../_components/ui/button";
import { GitHubLink } from "../_components/github-link";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "../_components/language-toggle";

const KEY_POINT = "x";
const KEY_BUST = "c";
const ROUND_MS = 1000;

enum JudgeEvent {
  Bust,
  Point,
  Start,
}

export default function HomePage() {
  const [sourceType, setSourceType] = useState<SourceType | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [timerDisplay, setTimerDisplay] = useState<string>("00.000");
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const t = useTranslations();

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

  useEffect(() => startButtonRef.current?.scrollIntoView(), [videoURL]);

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

  useEffect(() => {
    if (app.report[0] === undefined) return setTimerDisplay("00.000");
    if (app.isRoundOver) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff =
        now.getTime() -
        app.report
          .find(([_, action]) => action === JudgeEvent.Start)![0]
          .getTime();

      if (diff < effectiveRoundMs) {
        const displayedDiff = diff;
        const seconds = Math.floor(displayedDiff / 1000);
        const milliseconds = displayedDiff % 1000;
        setTimerDisplay(
          `${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`,
        );
      } else {
        const displayedDiff = effectiveRoundMs;
        const seconds = Math.floor(displayedDiff / 1000);
        const milliseconds = displayedDiff % 1000;
        setTimerDisplay(
          `${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`,
        );
        setApp((curr) => ({ ...curr, isRoundOver: true }));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [app.report, app.isRoundOver, effectiveRoundMs]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute right-4 top-4 flex gap-3">
        <GitHubLink />
        <LanguageToggle />
        <ModeToggle />
      </div>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {t("home.title")}
        </h1>
        <div className="flex min-w-56 flex-col items-center gap-4">
          <Select
            value={sourceType}
            onChange={setSourceType}
            placeholder={t("home.selectSource")}
            selectLabel={t("home.sources")}
            options={[
              {
                value: SourceType.InTimeScoring,
                label: t("home.inTimeScoring"),
              },
              { value: SourceType.Local, label: t("home.localFile") },
            ]}
          />
          {sourceType !== null && (
            <SourcePicker sourceType={sourceType} handleSave={setVideoURL} />
          )}

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-center">
              {t("home.pointKeyDesc")}: {KEY_POINT.toUpperCase()}
              <br />
              {t("home.bustKeyDesc")}: {KEY_BUST.toUpperCase()}
            </p>

            {!app.isReady && (
              <div
                className={`flex flex-col items-center justify-center gap-2 ${sourceType === null ? "hidden" : ""}`}
              >
                <p>{t("home.pressStart")}</p>
                <Button
                  disabled={!videoURL}
                  onClick={() => setApp((curr) => ({ ...curr, isReady: true }))}
                  id="start-button"
                  ref={startButtonRef}
                >
                  {t("actions.start")}
                </Button>
              </div>
            )}
            {app.isReady && (
              <h2 className="text-xl font-semibold">{timerDisplay}</h2>
            )}

            {app.isRoundOver && (
              <div className="flex flex-col gap-3">
                <div className="border-border-white flex justify-center">
                  <p className="flex items-center justify-center border px-3 py-1">
                    {t("home.you")}
                  </p>
                  <div className="flex flex-wrap items-center">
                    {app.report
                      .filter((e) => e[1] !== JudgeEvent.Start)
                      .map((e, i) => (
                        <p
                          className="flex w-14 flex-col items-center justify-center border px-3 py-1"
                          key={i}
                        >
                          <span className="text-blue-900 dark:text-blue-400">
                            {i}
                          </span>
                          <span className="text-lg font-semibold">
                            {e[1] === JudgeEvent.Point ? (
                              <span className="text-green-500">1</span>
                            ) : (
                              <span className="text-red-500">0</span>
                            )}
                          </span>
                          <span
                            className={`flex ${e[0].getTime() - app.report[0]![0].getTime() > ROUND_MS ? "text-yellow-500" : ""}`}
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
                <p className="p-3 text-center">
                  {t("home.totalPoints")}:{" "}
                  <span className="font-semibold">
                    {app.report.filter((e) => e[1] === JudgeEvent.Point).length}
                  </span>
                  <br />
                  {t("home.totalBusts")}:{" "}
                  <span className="font-semibold">
                    {app.report.filter((e) => e[1] === JudgeEvent.Bust).length}
                  </span>
                </p>
              </div>
            )}

            {sourceType !== null && (
              <Button
                onClick={() =>
                  setApp(() => ({
                    isReady: false,
                    isRoundOver: false,
                    report: [],
                  }))
                }
              >
                {t("actions.reset")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
