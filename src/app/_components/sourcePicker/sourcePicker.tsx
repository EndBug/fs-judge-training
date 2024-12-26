"use client";

import { SourceType } from "~/app/page";
import { InTimeScoring } from "./inTimeScoring";
import { Local } from "./local";

export interface SourcePickerProps {
  sourceType: SourceType;
  handleSave: (url: string) => void;
}

export function SourcePicker(props: SourcePickerProps) {
  if (props.sourceType === SourceType.InTimeScoring) {
    return <InTimeScoring handleSave={props.handleSave} />;
  } else if (props.sourceType === SourceType.Local) {
    return <Local handleSave={props.handleSave} />;
  }
}
