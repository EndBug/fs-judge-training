import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const intimeRouter = createTRPCRouter({
  getVideoSource: publicProcedure
    .input(
      z.object({
        url: z
          .string()
          .regex(
            /https?:\/\/(www\.)?intimescoring.com\/view\/flight\/\d+\/\d+\/\d+/,
            "Invalid video url",
          ),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { url } = input;

        const webPage = await fetch(url, { mode: "no-cors" });
        const html = await webPage.text();

        // <input id="VideoFileName" name="VideoFileName" type="hidden" value="19_18/XFLYSPOTOpen2024_FS4-Way-Rookie_601BZIMTIM_1.mp4" />
        const videoFileName =
          /<input id="VideoFileName" name="VideoFileName" type="hidden" value="([^"]+)"/.exec(
            html,
          )?.[1];

        if (!videoFileName) throw new Error("Can't parse URL: " + url);

        return `https://intimeonlinemedia.blob.core.windows.net/videos/${videoFileName}&sv=2020-08-04&ss=b&srt=sco&sp=r&se=2025-01-03T13:32:35Z&st=2022-01-03T05:32:35Z&spr=https&sig=LChqUHKbrMhRJtvRxLe%2F6cDzcr1E3TZ8y4QOgZ0EfcI%3D`;
      } catch (error) {
        throw new Error(
          `Server error: ${error instanceof Error ? error.message : (error as string) + ""}`,
        );
      }
    }),
});
