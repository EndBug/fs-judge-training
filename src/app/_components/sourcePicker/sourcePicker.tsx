"use client";

export enum SourceType {
  Local,
  InTimeScoring,
  YouTube,
}

import { InTimeScoring } from "./inTimeScoring";
import { Local } from "./local";
import { YouTube } from "./youtube";

export interface SourcePickerProps {
  sourceType: SourceType;
  handleSave: (url: string) => void;
}

export function SourcePicker(props: SourcePickerProps) {
  if (props.sourceType === SourceType.InTimeScoring) {
    return <InTimeScoring handleSave={props.handleSave} />;
  } else if (props.sourceType === SourceType.Local) {
    return <Local handleSave={props.handleSave} />;
  } else if (props.sourceType === SourceType.YouTube) {
    return <YouTube handleSave={props.handleSave} />;
  }
}
